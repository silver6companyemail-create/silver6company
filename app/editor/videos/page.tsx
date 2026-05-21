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
    Eye
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

export default function VideoUploads() {
    const [tasks, setTasks] = useState<VideoTask[]>([])
    const [loading, setLoading] = useState(true)
    
    // Upload Form State
    const [selectedTaskId, setSelectedTaskId] = useState('')
    const [videoTitle, setVideoTitle] = useState('')
    const [videoDesc, setVideoDesc] = useState('')
    const [videoLink, setVideoLink] = useState('')
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const [submissionStatus, setSubmissionStatus] = useState<'In Review' | 'Completed'>('In Review')

    // File picker state
    const [uploadingImage, setUploadingImage] = useState(false)

    // Load active editor tasks from backend API
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
            }
        } else {
            setVideoTitle('')
            setVideoDesc('')
            setVideoLink('')
            setThumbnailUrl('')
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
                toast.success("Thumbnail uploaded to Cloudinary successfully")
            } else {
                toast.error(data.message || "Failed to upload thumbnail")
            }
        } catch (error) {
            console.error("Thumbnail upload error", error)
            toast.error("Thumbnail upload failed")
        } finally {
            setUploadingImage(false)
        }
    }

    // Submit Video Asset Form
    const handleAssetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!videoTitle) {
            toast.error("Please fill in Video Title")
            return
        }

        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

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
                        description: videoDesc,
                        videoUrl: videoLink,
                        thumbnailUrl: thumbnailUrl,
                        status: submissionStatus
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
                        description: videoDesc,
                        type: 'Video',
                        dueDate: todayStr,
                        time: new Date().toTimeString().slice(0, 5),
                        videoUrl: videoLink,
                        thumbnailUrl: thumbnailUrl,
                        status: submissionStatus,
                        priority: 'Medium'
                    })
                })
            }

            if (res.ok) {
                toast.success("Finalized video asset delivered successfully")
                setSelectedTaskId('')
                setVideoTitle('')
                setVideoDesc('')
                setVideoLink('')
                setThumbnailUrl('')
                loadTasks() // Refresh timeline lists
            } else {
                toast.error("Failed to submit video asset")
            }
        } catch (error) {
            console.error("Asset submission error", error)
            toast.error("An error occurred")
        }
    }

    // Filters pending and delivered assets
    const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress')
    const deliveredAssets = tasks.filter(t => t.status === 'In Review' || t.status === 'Completed' || t.status === 'Published')

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Overview banner */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Finalized Video Assets</h2>
                    <p className="text-gray-500 mt-0.5">Submit links, specify requirements, and configure thumbnails for delivery reviews.</p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-150 text-center min-w-[120px]">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-550">Pending Edits</span>
                        <span className="text-2xl font-extrabold">{pendingTasks.length}</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-150 text-center min-w-[120px]">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-550">Completed Assets</span>
                        <span className="text-2xl font-extrabold">{deliveredAssets.length}</span>
                    </div>
                </div>
            </div>

            {/* Submission Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Delivery upload form panel */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-extrabold text-gray-950 text-lg flex items-center gap-2">
                            <Upload className="w-5 h-5 text-emerald-500" />
                            Creative Submission Console
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Deliver edited timelines or upload finished content assets directly.</p>
                    </div>

                    <form onSubmit={handleAssetSubmit} className="space-y-4 text-sm">
                        {/* Select Task timeline dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Link to Active Schedule/Task (Optional)</label>
                            <select
                                value={selectedTaskId}
                                onChange={e => setSelectedTaskId(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-gray-50/40 text-sm"
                            >
                                <option value="">-- Submit Standalone Video Asset --</option>
                                {pendingTasks.map(t => (
                                    <option key={t._id} value={t._id}>
                                        [{t.type}] {t.title} (Due: {t.dueDate})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title & Desc */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Asset Title</label>
                                <input
                                    required
                                    type="text"
                                    value={videoTitle}
                                    onChange={e => setVideoTitle(e.target.value)}
                                    placeholder="e.g. Winter Clothes Promo Final"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Finalized Delivery Status</label>
                                <select
                                    value={submissionStatus}
                                    onChange={e => setSubmissionStatus(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-600 bg-emerald-50/30"
                                >
                                    <option value="In Review">Awaiting Review (In Review)</option>
                                    <option value="Completed">Direct Completion (Completed)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description & Credits</label>
                            <textarea
                                rows={3}
                                value={videoDesc}
                                onChange={e => setVideoDesc(e.target.value)}
                                placeholder="Describe the video content, edit changes, or team credits..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none"
                            />
                        </div>

                        {/* Video URL Link */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Edited Video URL Link</label>
                            <div className="relative">
                                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="url"
                                    value={videoLink}
                                    onChange={e => setVideoLink(e.target.value)}
                                    placeholder="https://youtube.com/... or Google Drive URL (Optional)"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Cloudinary Upload */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Video Thumbnail Image (Hosted on Cloudinary)</label>
                            <div className="mt-1 flex flex-col md:flex-row gap-4 items-center">
                                {/* Preview card */}
                                <div className="w-40 aspect-video bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center relative shrink-0">
                                    {thumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                                            <ImageIcon className="w-6 h-6" />
                                            <span className="text-[10px] font-bold">No Image Chosen</span>
                                        </div>
                                    )}
                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                {/* Drag and upload button */}
                                <label className="flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50/50 hover:border-emerald-400 cursor-pointer transition-colors text-center">
                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Choose Thumbnail Image</span>
                                    <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 10MB</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleThumbnailUpload} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-150 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 rounded-xl transition-all text-xs shadow-md flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Deliver Creative Asset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Delivered assets list */}
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-extrabold text-gray-950 text-lg flex items-center gap-2">
                            <FileVideo className="w-5 h-5 text-emerald-500" />
                            Delivery Archives
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Delivered assets sync history log.</p>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : deliveredAssets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-150 rounded-xl">
                            <Video className="w-8 h-8 text-gray-300 mb-2" />
                            <span className="text-xs font-bold text-gray-800">No delivered assets</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 max-w-[150px]">Finalized assets will be listed here after console submission.</span>
                        </div>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-[480px] flex-1 pr-1">
                            {deliveredAssets.map(asset => (
                                <div key={asset._id} className="group border border-gray-150 rounded-xl overflow-hidden shadow-sm bg-gray-50/20 hover:shadow-md transition-shadow">
                                    {/* Image container */}
                                    <div className="aspect-video bg-gray-150 relative flex items-center justify-center border-b border-gray-150 overflow-hidden">
                                        {asset.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                                        ) : (
                                            <Video className="w-10 h-10 text-gray-300" />
                                        )}
                                        {/* Play Hover Overlay */}
                                        {asset.videoUrl && (
                                            <a 
                                                href={asset.videoUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                title="Watch Video Asset"
                                            >
                                                <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-md" />
                                            </a>
                                        )}
                                        {/* Priority Badge */}
                                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-black/60 text-white tracking-wide">
                                            {asset.type}
                                        </span>
                                    </div>
                                    {/* Body */}
                                    <div className="p-3 text-xs">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-extrabold text-gray-900 truncate pr-2 max-w-[140px]" title={asset.title}>{asset.title}</h4>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                                asset.status === 'Completed' || asset.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {asset.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{asset.dueDate} • {asset.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
