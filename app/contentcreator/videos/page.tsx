'use client'

import { useState, useEffect } from 'react'
import { 
    Upload, 
    Video, 
    FileVideo, 
    Link as LinkIcon, 
    PlayCircle, 
    CheckCircle2, 
    Loader2, 
    X, 
    Image as ImageIcon,
    AlertCircle,
    Eye,
    Sparkles,
    BookOpen,
    FileText,
    Copy,
    Check
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VideoTask {
    _id: string
    title: string
    description: string
    type: 'Video' | 'Graphic'
    status: 'To Do' | 'In Progress' | 'In Review' | 'Completed' | 'Published'
    priority: 'Low' | 'Medium' | 'High'
    dueDate: string // YYYY-MM-DD
    time: string // HH:MM
    duration?: string
    videoUrl?: string
    thumbnailUrl?: string
    notes?: string
}

interface ParsedNotes {
    platform?: string
    scriptUrl?: string
    audience?: string
    scriptDraft?: string
    storyHooks?: string
    rawNotes?: string
}

const parseNotesField = (notesStr?: string): ParsedNotes => {
    if (!notesStr) return {}
    try {
        const parsed = JSON.parse(notesStr)
        if (parsed && typeof parsed === 'object') {
            return {
                platform: parsed.platform || '',
                scriptUrl: parsed.scriptUrl || '',
                audience: parsed.audience || '',
                scriptDraft: parsed.scriptDraft || '',
                storyHooks: parsed.storyHooks || '',
                rawNotes: parsed.rawNotes || ''
            }
        }
    } catch (e) {
        // Fallback
    }
    return { rawNotes: notesStr }
}

const serializeNotes = (parsed: ParsedNotes): string => {
    return JSON.stringify(parsed)
}

export default function CreatorScriptVault() {
    const [tasks, setTasks] = useState<VideoTask[]>([])
    const [loading, setLoading] = useState(true)
    
    // Upload/Submission Form State
    const [selectedTaskId, setSelectedTaskId] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [videoDesc, setVideoDesc] = useState('') // Internal descriptor
    const [videoLink, setVideoLink] = useState('') // Reference document link
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const [submissionStatus, setSubmissionStatus] = useState<'In Review' | 'Completed'>('In Review')

    // Custom Creator states serialized in Notes
    const [platform, setPlatform] = useState('YouTube')
    const [audience, setAudience] = useState('')
    const [scriptDraft, setScriptDraft] = useState('')
    const [storyHooks, setStoryHooks] = useState('')
    const [rawNotes, setRawNotes] = useState('')

    // Preview / Modal State
    const [activePreviewScript, setActivePreviewScript] = useState<VideoTask | null>(null)
    const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null)

    // File picker state
    const [uploadingImage, setUploadingImage] = useState(false)

    // Load active creator tasks from backend API
    const loadTasks = async () => {
        try {
            setLoading(true)
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch('http://localhost:1000/api/video-tasks', {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            }
        } catch (e) {
            console.error("Error loading tasks", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    // Prefill form when task is selected
    useEffect(() => {
        if (selectedTaskId) {
            const task = tasks.find(t => t._id === selectedTaskId)
            if (task) {
                setVideoTitle(task.title)
                setVideoDesc(task.description || '')
                setVideoLink(task.videoUrl || '')
                setThumbnailUrl(task.thumbnailUrl || '')

                const parsed = parseNotesField(task.notes)
                setPlatform(parsed.platform || 'YouTube')
                setAudience(parsed.audience || '')
                setScriptDraft(parsed.scriptDraft || '')
                setStoryHooks(parsed.storyHooks || '')
                setRawNotes(parsed.rawNotes || '')
            }
        } else {
            setVideoTitle('')
            setVideoDesc('')
            setVideoLink('')
            setThumbnailUrl('')
            setPlatform('YouTube')
            setAudience('')
            setScriptDraft('')
            setStoryHooks('')
            setRawNotes('')
        }
    }, [selectedTaskId, tasks])

    // Multipart File Upload Handler (Cloudinary)
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploadingImage(true)
            const formData = new FormData()
            formData.append('image', file)

            const res = await fetch('http://localhost:1000/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (res.ok && data.image) {
                setThumbnailUrl(data.image)
                toast.success("Storyboard thumbnail uploaded successfully")
            } else {
                toast.error(data.message || "Failed to upload storyboard")
            }
        } catch (error) {
            console.error("Storyboard upload error", error)
            toast.error("Storyboard image upload failed")
        } finally {
            setUploadingImage(false)
        }
    }

    // Submit Video Asset / Script Vault Form
    const handleAssetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!videoTitle) {
            toast.error("Please specify a script or concept title")
            return
        }

        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            // Serialize all Content Creator items into notes field
            const serializedNotes = serializeNotes({
                platform,
                scriptUrl: videoLink,
                audience,
                scriptDraft,
                storyHooks,
                rawNotes: rawNotes || videoDesc
            })

            let res;
            // Case 1: Linking and updating an existing task schedule
            if (selectedTaskId) {
                res = await fetch(`http://localhost:1000/api/video-tasks/${selectedTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    body: JSON.stringify({
                        title: videoTitle,
                        description: rawNotes || videoDesc,
                        videoUrl: videoLink,
                        thumbnailUrl: thumbnailUrl,
                        status: submissionStatus,
                        notes: serializedNotes
                    })
                })
            } else {
                // Case 2: Uploading a standalone finished creative asset (creates a new task marked completed/in-review)
                const todayStr = new Date().toISOString().split('T')[0]
                res = await fetch('http://localhost:1000/api/video-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    body: JSON.stringify({
                        title: videoTitle,
                        description: rawNotes || videoDesc,
                        type: 'Video',
                        dueDate: todayStr,
                        time: new Date().toTimeString().slice(0, 5),
                        videoUrl: videoLink,
                        thumbnailUrl: thumbnailUrl,
                        status: submissionStatus,
                        priority: 'Medium',
                        notes: serializedNotes
                    })
                })
            }

            if (res.ok) {
                toast.success("Concept & Script draft saved to Vault")
                setSelectedTaskId('')
                setVideoTitle('')
                setVideoDesc('')
                setVideoLink('')
                setThumbnailUrl('')
                setPlatform('YouTube')
                setAudience('')
                setScriptDraft('')
                setStoryHooks('')
                setRawNotes('')
                loadTasks() // Refresh archives
            } else {
                toast.error("Failed to deliver script vault concept")
            }
        } catch (error) {
            console.error("Asset submission error", error)
            toast.error("An error occurred during submission")
        }
    }

    const copyScriptToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedScriptId(id)
        toast.success("Script draft copied to clipboard!")
        setTimeout(() => setCopiedScriptId(null), 2000)
    }

    // Filters pending ideas and delivered scripts
    const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress')
    const deliveredAssets = tasks.filter(t => t.status === 'In Review' || t.status === 'Completed' || t.status === 'Published')

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Overview banner */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-emerald-500" />
                        Script & Concept Vault
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Pitch concepts, draft viral hooks, write script copies, and upload storyboards for visual synchronization.
                    </p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-100 text-center min-w-[120px] shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Pending Ideas</span>
                        <span className="text-2xl font-extrabold">{pendingTasks.length}</span>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-100 text-center min-w-[120px] shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">Archived Scripts</span>
                        <span className="text-2xl font-extrabold">{deliveredAssets.length}</span>
                    </div>
                </div>
            </div>

            {/* Submission Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Script submission form panel */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            Creative Submission Console
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            Lock in script drafts, choose delivery status stages, and connect them with schedules.
                        </p>
                    </div>

                    <form onSubmit={handleAssetSubmit} className="space-y-4 text-sm">
                        {/* Select Task timeline dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Link to Active Schedule/Task (Optional)</label>
                            <select
                                value={selectedTaskId}
                                onChange={e => setSelectedTaskId(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 text-sm font-semibold text-slate-700 transition-all"
                            >
                                <option value="">-- Create Standalone Vault Concept --</option>
                                {pendingTasks.map(t => (
                                    <option key={t._id} value={t._id}>
                                        [{t.type}] {t.title} (Due: {t.dueDate})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title & Concept Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Concept / Script Title</label>
                                <input
                                    required
                                    type="text"
                                    value={videoTitle}
                                    onChange={e => setVideoTitle(e.target.value)}
                                    placeholder="e.g. 5 Secrets of High-Performance Teams"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Concept stage status</label>
                                <select
                                    value={submissionStatus}
                                    onChange={e => setSubmissionStatus(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-bold text-emerald-700 bg-emerald-50/50 transition-all"
                                >
                                    <option value="In Review">Concept Draft (Awaiting Review)</option>
                                    <option value="Completed">Finalized Script (Approved for Production)</option>
                                </select>
                            </div>
                        </div>

                        {/* Platform Selector & Target Audience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Publish Target Platform</label>
                                <select
                                    value={platform}
                                    onChange={e => setPlatform(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 transition-all"
                                >
                                    <option value="YouTube">YouTube Video</option>
                                    <option value="TikTok">TikTok Short</option>
                                    <option value="Instagram Reels">Instagram Reels</option>
                                    <option value="LinkedIn">LinkedIn Broadcast</option>
                                    <option value="X/Twitter">X / Twitter Post</option>
                                    <option value="Facebook">Facebook Video</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Audience Focus</label>
                                <input
                                    type="text"
                                    value={audience}
                                    onChange={e => setAudience(e.target.value)}
                                    placeholder="e.g. Software engineers, Content strategists"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Story Hook Outline */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Viral Story Hooks
                            </label>
                            <textarea
                                rows={2}
                                value={storyHooks}
                                onChange={e => setStoryHooks(e.target.value)}
                                placeholder="Hook 1: This tiny productivity mistake is costing you hours...&#10;Hook 2: I analyzed 100 landing pages, and they all do this..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-700 placeholder:text-slate-400 placeholder:italic resize-none transition-all"
                            />
                        </div>

                        {/* Script Draft Area */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                Script Draft Copy
                            </label>
                            <textarea
                                rows={6}
                                value={scriptDraft}
                                onChange={e => setScriptDraft(e.target.value)}
                                placeholder="[Intro Hook]&#10;Stop scroll-pitching your products without a story. Here's why...&#10;&#10;[Body Segment]&#10;Point 1: Focus on the root pain.&#10;Point 2: Introduce simple shifts.&#10;&#10;[Outro CTA]&#10;Subscribe and download the guide in the bio!"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono leading-relaxed text-slate-800 placeholder:text-slate-450 transition-all"
                            />
                        </div>

                        {/* Reference script link url */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Reference Document Link (Notion, Google Docs, etc.)</label>
                            <div className="relative">
                                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="url"
                                    value={videoLink}
                                    onChange={e => setVideoLink(e.target.value)}
                                    placeholder="https://docs.google.com/document/... (Optional)"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Storyboard upload */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Storyboard Thumbnail / Concept Cue Image</label>
                            <div className="mt-1 flex flex-col md:flex-row gap-4 items-center">
                                {/* Preview card */}
                                <div className="w-40 aspect-video bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm">
                                    {thumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={thumbnailUrl} alt="Storyboard Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400 flex flex-col items-center gap-1">
                                            <ImageIcon className="w-6 h-6 text-slate-300" />
                                            <span className="text-[10px] font-bold">No Storyboard</span>
                                        </div>
                                    )}
                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                {/* Drag and upload button */}
                                <label className="flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50/50 hover:border-emerald-400 cursor-pointer transition-colors text-center">
                                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Choose Storyboard File</span>
                                    <span className="text-[10px] text-slate-450 mt-0.5">PNG, JPG up to 10MB</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleThumbnailUpload} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Raw notes / campaign notes */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Campaign Directives & Creative Directives</label>
                            <textarea
                                rows={2}
                                value={rawNotes}
                                onChange={e => setRawNotes(e.target.value)}
                                placeholder="Specify camera angles, sound track directions, visual B-roll links, or editing comments..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 rounded-xl transition-all text-xs shadow-md flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Save Script to Vault
                            </button>
                        </div>
                    </form>
                </div>

                {/* Delivered Script Archives List */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                            <FileVideo className="w-5 h-5 text-emerald-500" />
                            Vault Archives
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            Pitch log of delivered script versions and storyboard files.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : deliveredAssets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-2xl min-h-[300px]">
                            <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
                            <span className="text-xs font-bold text-slate-700">Vault is empty</span>
                            <span className="text-[10px] text-slate-450 mt-1 max-w-[170px]">
                                Submitted scripts and visual storyboards will register here.
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-[720px] flex-1 pr-1">
                            {deliveredAssets.map(asset => {
                                const parsed = parseNotesField(asset.notes)
                                return (
                                    <div key={asset._id} className="group border border-slate-150 rounded-xl overflow-hidden shadow-sm bg-slate-50/10 hover:shadow-md hover:border-slate-250 transition-all duration-300 flex flex-col">
                                        {/* Image container */}
                                        <div className="aspect-video bg-slate-100 relative flex items-center justify-center border-b border-slate-150 overflow-hidden">
                                            {asset.thumbnailUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                                            ) : (
                                                <div className="text-center text-slate-400 flex flex-col items-center gap-1.5 p-4">
                                                    <ImageIcon className="w-8 h-8 text-slate-350" />
                                                    <span className="text-[10px] font-bold">No Storyboard Preview</span>
                                                </div>
                                            )}
                                            
                                            {/* Dynamic Platform Tag */}
                                            {parsed.platform && (
                                                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide text-white bg-slate-900/80 backdrop-blur-sm shadow`}>
                                                    {parsed.platform}
                                                </span>
                                            )}

                                            {/* Video reference Link Overlay */}
                                            {asset.videoUrl && (
                                                <a 
                                                    href={asset.videoUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10"
                                                    title="Open Reference Document Link"
                                                >
                                                    <PlayCircle className="w-10 h-10 text-white drop-shadow-md hover:scale-110 transition-transform" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Body details */}
                                        <div className="p-3.5 text-xs flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                <div className="flex justify-between items-start gap-1.5">
                                                    <h4 className="font-extrabold text-slate-900 truncate pr-2 max-w-[155px]" title={asset.title}>
                                                        {asset.title}
                                                    </h4>
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                                                        asset.status === 'Completed' || asset.status === 'Published' 
                                                            ? 'bg-green-50 text-green-700 border border-green-200/40' 
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200/40'
                                                    }`}>
                                                        {asset.status === 'Completed' ? 'Approved' : asset.status === 'Published' ? 'Published' : 'In Review'}
                                                    </span>
                                                </div>

                                                {/* Text hooks preview */}
                                                {parsed.storyHooks && (
                                                    <p className="text-[10px] text-slate-500 italic mt-2 line-clamp-2 border-l-2 border-amber-300 pl-1.5 font-medium leading-relaxed">
                                                        "{parsed.storyHooks}"
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[9px] text-slate-400 font-semibold">{asset.dueDate || 'No Target Date'}</span>
                                                <button
                                                    onClick={() => setActivePreviewScript(asset)}
                                                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-colors text-[10px] flex items-center gap-1 shadow-sm"
                                                >
                                                    <Eye className="w-3 h-3 shrink-0" />
                                                    Read Script
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Glassmorphic Script Preview Modal */}
            {activePreviewScript && (() => {
                const parsed = parseNotesField(activePreviewScript.notes)
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="p-5 border-b border-slate-150 flex items-start justify-between bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                                            parsed.platform === 'YouTube' ? 'bg-red-50 text-red-700 border border-red-200' :
                                            parsed.platform === 'TikTok' ? 'bg-slate-900 text-white' :
                                            parsed.platform === 'Instagram Reels' || parsed.platform === 'Instagram' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {parsed.platform || 'Platform'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                            activePreviewScript.status === 'Completed' || activePreviewScript.status === 'Published' 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                            {activePreviewScript.status === 'Completed' ? 'Approved Script' : activePreviewScript.status === 'Published' ? 'Published' : 'Under Review'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-slate-900 mt-2 tracking-tight">{activePreviewScript.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setActivePreviewScript(null)}
                                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-650"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content body */}
                            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
                                {/* Story hooks */}
                                {parsed.storyHooks && (
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                            Viral Story Hooks
                                        </h4>
                                        <div className="p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-200/50 rounded-xl text-xs font-semibold italic text-slate-700 leading-relaxed">
                                            ✨ {parsed.storyHooks}
                                        </div>
                                    </div>
                                )}

                                {/* Script copy */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                        Script Content Draft
                                    </h4>
                                    {parsed.scriptDraft ? (
                                        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[320px] overflow-y-auto border border-slate-800 shadow-inner">
                                            {parsed.scriptDraft}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                                            No script text content drafted for this concept.
                                        </div>
                                    )}
                                </div>

                                {/* Targets grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {parsed.audience && (
                                        <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                                            <span className="text-[9px] font-extrabold uppercase text-slate-450 tracking-wider block">Target Audience Focus</span>
                                            <span className="text-xs font-bold text-slate-800">🎯 {parsed.audience}</span>
                                        </div>
                                    )}
                                    {parsed.scriptUrl && (
                                        <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                                            <span className="text-[9px] font-extrabold uppercase text-slate-450 tracking-wider block">Document URL Reference</span>
                                            <a 
                                                href={parsed.scriptUrl}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs font-bold text-emerald-600 hover:underline block truncate"
                                            >
                                                🔗 {parsed.scriptUrl}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Creative notes */}
                                {(activePreviewScript.description || parsed.rawNotes) && (
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider block">Campaign Notes & Directives</span>
                                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-650 leading-relaxed whitespace-pre-wrap font-medium">
                                            {activePreviewScript.description || parsed.rawNotes}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-150 bg-slate-50/80 flex justify-end gap-3">
                                <button
                                    onClick={() => copyScriptToClipboard(parsed.scriptDraft || '', activePreviewScript._id)}
                                    disabled={!parsed.scriptDraft}
                                    className="px-4 py-2 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                                >
                                    {copiedScriptId === activePreviewScript._id ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy Script Text
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActivePreviewScript(null)}
                                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}
