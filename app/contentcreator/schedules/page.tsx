'use client'

import { useState, useEffect } from 'react'
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Clock, 
    AlertCircle, 
    Trash2, 
    Edit, 
    Loader2, 
    Folder, 
    CalendarCheck,
    Video,
    Film,
    Sparkles,
    CheckCircle2
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

export default function CreatorSchedules() {
    const [tasks, setTasks] = useState<VideoTask[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editTask, setEditTask] = useState<VideoTask | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Form inputs state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Video' as 'Video' | 'Graphic',
        priority: 'Medium' as 'Low' | 'Medium' | 'High',
        dueDate: '',
        time: '12:00',
        duration: '',
        platform: 'YouTube',
        scriptUrl: '',
        audience: '',
        rawNotes: ''
    })

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        _id: '',
        title: '',
        description: '',
        type: 'Video' as 'Video' | 'Graphic',
        priority: 'Medium' as 'Low' | 'Medium' | 'High',
        status: 'To Do' as any,
        dueDate: '',
        time: '12:00',
        duration: '',
        platform: 'YouTube',
        scriptUrl: '',
        audience: '',
        rawNotes: ''
    })

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
            toast.error("Failed to load task timelines")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const startEdit = (task: VideoTask) => {
        const parsed = parseNotesField(task.notes)
        setEditFormData({
            _id: task._id,
            title: task.title || '',
            description: task.description || '',
            type: task.type,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate || '',
            time: task.time || '12:00',
            duration: task.duration || '',
            platform: parsed.platform || 'YouTube',
            scriptUrl: parsed.scriptUrl || '',
            audience: parsed.audience || '',
            rawNotes: parsed.rawNotes || ''
        })
        setEditTask(task)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const serializedNotes = serializeNotes({
                platform: formData.platform,
                scriptUrl: formData.scriptUrl,
                audience: formData.audience,
                rawNotes: formData.rawNotes
            })

            const postBody = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                priority: formData.priority,
                dueDate: formData.dueDate,
                time: formData.time,
                duration: formData.duration,
                notes: serializedNotes
            }

            const res = await fetch('http://localhost:1000/api/video-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(postBody)
            })

            if (res.ok) {
                const data = await res.json()
                setTasks([data, ...tasks])
                setIsAddModalOpen(false)
                setFormData({
                    title: '',
                    description: '',
                    type: 'Video',
                    priority: 'Medium',
                    dueDate: '',
                    time: '12:00',
                    duration: '',
                    platform: 'YouTube',
                    scriptUrl: '',
                    audience: '',
                    rawNotes: ''
                })
                toast.success("Schedule created successfully")
            } else {
                toast.error("Failed to save schedule")
            }
        } catch (error) {
            console.error("Save schedule error", error)
            toast.error("An error occurred")
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editTask) return

        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const serializedNotes = serializeNotes({
                platform: editFormData.platform,
                scriptUrl: editFormData.scriptUrl,
                audience: editFormData.audience,
                rawNotes: editFormData.rawNotes
            })

            const putBody = {
                title: editFormData.title,
                description: editFormData.description,
                type: editFormData.type,
                priority: editFormData.priority,
                status: editFormData.status,
                dueDate: editFormData.dueDate,
                time: editFormData.time,
                duration: editFormData.duration,
                notes: serializedNotes
            }

            const res = await fetch(`http://localhost:1000/api/video-tasks/${editFormData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(putBody)
            })

            if (res.ok) {
                const updated = await res.json()
                setTasks(tasks.map(t => t._id === editFormData._id ? updated : t))
                setEditTask(null)
                toast.success("Schedule updated successfully")
            } else {
                toast.error("Failed to update schedule")
            }
        } catch (error) {
            console.error("Edit schedule error", error)
            toast.error("An error occurred")
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirmId) return

        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch(`http://localhost:1000/api/video-tasks/${deleteConfirmId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            })

            if (res.ok) {
                setTasks(tasks.filter(t => t._id !== deleteConfirmId))
                setDeleteConfirmId(null)
                toast.success("Schedule removed successfully")
            } else {
                toast.error("Failed to remove schedule")
            }
        } catch (error) {
            console.error("Delete schedule error", error)
            toast.error("An error occurred")
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 border border-red-200'
            case 'Medium': return 'bg-orange-50 text-orange-700 border border-orange-200'
            default: return 'bg-blue-50 text-blue-700 border border-blue-200'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload & Publish Planner</h2>
                    <p className="text-gray-500 mt-0.5">Plan release channels, script references, and track platform publish schedules.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transform transition-transform"
                >
                    <Plus className="w-5 h-5 shrink-0" />
                    New Publish Schedule
                </button>
            </div>

            {/* Main Timelines Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden min-h-[450px]">
                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                        <span className="text-xs text-gray-400 font-bold">Synchronizing creator timeline logs...</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-center p-6">
                        <CalendarCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No upload schedules planned</h3>
                        <p className="text-gray-500 mt-1 max-w-sm text-sm">Plan release schedules detailing platforms, script drafts, and target audiences. They will map onto your calendar workspace.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors"
                        >
                            Create Publish Plan
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6 font-semibold">Title & Category</th>
                                    <th className="p-4 font-semibold">Campaign Focus & Script</th>
                                    <th className="p-4 font-semibold">Publish Target</th>
                                    <th className="p-4 font-semibold">Duration Target</th>
                                    <th className="p-4 font-semibold">Priority</th>
                                    <th className="p-4 font-semibold">Production Status</th>
                                    <th className="p-4 pr-6 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {tasks.map(task => (
                                    <tr key={task._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 pl-6 font-semibold text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                                                    {task.type === 'Video' ? <Video className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className="font-extrabold text-slate-900">{task.title}</span>
                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{task.type}</span>
                                                        {(() => {
                                                            const parsed = parseNotesField(task.notes)
                                                            if (!parsed.platform) return null
                                                            let platformStyle = 'bg-gray-100 text-gray-800 border-gray-200'
                                                            if (parsed.platform === 'YouTube') platformStyle = 'bg-red-500/10 text-red-650 border-red-500/20'
                                                            else if (parsed.platform === 'TikTok') platformStyle = 'bg-slate-900 text-slate-100 border-slate-800'
                                                            else if (parsed.platform === 'Instagram Reels') platformStyle = 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-500/20 font-bold'
                                                            else if (parsed.platform === 'LinkedIn') platformStyle = 'bg-blue-600/10 text-blue-650 border-blue-650/20'
                                                            else if (parsed.platform === 'Facebook') platformStyle = 'bg-indigo-650/10 text-indigo-700 border-indigo-700/20'
                                                            else if (parsed.platform === 'X / Twitter') platformStyle = 'bg-slate-950/10 text-slate-900 border-slate-950/20'
                                                            return (
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold border ${platformStyle}`}>
                                                                    {parsed.platform}
                                                                </span>
                                                            )
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 max-w-[200px]" title={task.description}>
                                            <div className="space-y-1">
                                                <p className="truncate text-slate-700 font-medium">{task.description || "N/A"}</p>
                                                {(() => {
                                                    const parsed = parseNotesField(task.notes)
                                                    if (!parsed.audience && !parsed.scriptUrl && !parsed.rawNotes) return null
                                                    return (
                                                        <div className="text-[10px] text-gray-400 space-y-0.5">
                                                            {parsed.audience && <span className="block truncate text-slate-500 font-semibold">🎯 {parsed.audience}</span>}
                                                            {parsed.scriptUrl && (
                                                                <a 
                                                                    href={parsed.scriptUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-flex items-center gap-0.5 text-emerald-600 hover:underline font-bold"
                                                                >
                                                                    🔗 Script Draft
                                                                </a>
                                                            )}
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-650">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-gray-800">{task.dueDate}</span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 shrink-0" /> {task.time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700 font-medium">
                                            {task.duration || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getPriorityBadge(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-extrabold capitalize ${
                                                task.status === 'Completed' || task.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                task.status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                'bg-gray-100 text-gray-650 border border-gray-200'
                                            }`}>
                                                {task.status === 'To Do' ? 'Concept Idea' : 
                                                 task.status === 'In Progress' ? 'Scriptwriting' :
                                                 task.status === 'In Review' ? 'Filming Queue' :
                                                 task.status === 'Completed' ? 'Draft Sent to Editor' :
                                                 task.status === 'Published' ? 'Published & Live!' : task.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => startEdit(task)} 
                                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Edit Schedule Details"
                                                >
                                                    <Edit className="w-4.5 h-4.5" />
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(task._id)} 
                                                    className="p-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Plan"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Schedule Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-55/50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Create New Publish Plan</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Plot channels, dates and durations onto your workspace calendar.</p>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(false)} 
                                className="text-gray-400 hover:text-gray-600 bg-gray-150/40 p-1.5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Content / Title</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                    placeholder="e.g. Winter Clothes Promo Video" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Campaign Summary / Instructions</label>
                                <textarea 
                                    rows={2} 
                                    value={formData.description} 
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                    placeholder="Describe campaign focus or video script theme..." 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Asset Category</label>
                                    <select 
                                        value={formData.type} 
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                                    >
                                        <option value="Video">Video Project</option>
                                        <option value="Graphic">Graphic / Thumbnail</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Task Priority</label>
                                    <select 
                                        value={formData.priority} 
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Publish Due Date</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={formData.dueDate} 
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Time</label>
                                    <input 
                                        required 
                                        type="time" 
                                        value={formData.time} 
                                        onChange={e => setFormData({ ...formData, time: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Publish Platform</label>
                                    <select 
                                        value={formData.platform} 
                                        onChange={e => setFormData({ ...formData, platform: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-600 bg-emerald-50/20"
                                    >
                                        <option value="YouTube">YouTube</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="Instagram Reels">Instagram Reels</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="X / Twitter">X / Twitter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Target Audience</label>
                                    <input 
                                        type="text" 
                                        value={formData.audience} 
                                        onChange={e => setFormData({ ...formData, audience: e.target.value })} 
                                        placeholder="e.g. Young Adults" 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Duration (e.g. 0:45 or 12 mins)</label>
                                    <input 
                                        type="text" 
                                        value={formData.duration} 
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })} 
                                        placeholder="e.g. 1:30" 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Script URL (Optional)</label>
                                    <input 
                                        type="url" 
                                        value={formData.scriptUrl} 
                                        onChange={e => setFormData({ ...formData, scriptUrl: e.target.value })} 
                                        placeholder="https://docs.google.com/..." 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Additional Notes</label>
                                <input 
                                    type="text" 
                                    value={formData.rawNotes} 
                                    onChange={e => setFormData({ ...formData, rawNotes: e.target.value })} 
                                    placeholder="Enter reference links or assets details..." 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)} 
                                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all text-xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 rounded-xl transition-all text-xs shadow-md"
                                >
                                    Create Publish Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Schedule Modal */}
            {editTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-55/50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Modify Publish Plan Details</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Edit schedule attributes and timeline logs.</p>
                            </div>
                            <button 
                                onClick={() => setEditTask(null)} 
                                className="text-gray-400 hover:text-gray-600 bg-gray-150/40 p-1.5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Content / Title</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={editFormData.title} 
                                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold text-slate-900" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Campaign Summary / Description</label>
                                <textarea 
                                    rows={2} 
                                    value={editFormData.description} 
                                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none" 
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                                    <select 
                                        value={editFormData.type} 
                                        onChange={e => setEditFormData({ ...editFormData, type: e.target.value as any })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                                    >
                                        <option value="Video">Video Project</option>
                                        <option value="Graphic">Graphic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Priority</label>
                                    <select 
                                        value={editFormData.priority} 
                                        onChange={e => setEditFormData({ ...editFormData, priority: e.target.value as any })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status State</label>
                                    <select 
                                        value={editFormData.status} 
                                        onChange={e => setEditFormData({ ...editFormData, status: e.target.value as any })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-extrabold text-emerald-600 bg-emerald-50/50"
                                    >
                                        <option value="To Do">Concept Idea</option>
                                        <option value="In Progress">Scriptwriting</option>
                                        <option value="In Review">Filming Queue</option>
                                        <option value="Completed">Draft Sent to Editor</option>
                                        <option value="Published">Published & Live!</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Publish Due Date</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={editFormData.dueDate} 
                                        onChange={e => setEditFormData({ ...editFormData, dueDate: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium text-slate-800" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Time</label>
                                    <input 
                                        required 
                                        type="time" 
                                        value={editFormData.time} 
                                        onChange={e => setEditFormData({ ...editFormData, time: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium text-slate-800" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Publish Platform</label>
                                    <select 
                                        value={editFormData.platform} 
                                        onChange={e => setEditFormData({ ...editFormData, platform: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-650 bg-emerald-50/20"
                                    >
                                        <option value="YouTube">YouTube</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="Instagram Reels">Instagram Reels</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="X / Twitter">X / Twitter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Target Audience</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.audience} 
                                        onChange={e => setEditFormData({ ...editFormData, audience: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Duration Estimate</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.duration} 
                                        onChange={e => setEditFormData({ ...editFormData, duration: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Script URL</label>
                                    <input 
                                        type="url" 
                                        value={editFormData.scriptUrl} 
                                        onChange={e => setEditFormData({ ...editFormData, scriptUrl: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Additional Notes</label>
                                <input 
                                    type="text" 
                                    value={editFormData.rawNotes} 
                                    onChange={e => setEditFormData({ ...editFormData, rawNotes: e.target.value })} 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setEditTask(null)} 
                                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all text-xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 rounded-xl transition-all text-xs shadow-md"
                                >
                                    Save Publish Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-650">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Publish Plan?</h2>
                        <p className="text-gray-500 mb-6 text-xs leading-relaxed">
                            Are you sure you want to remove this scheduled item? It will be permanently removed from your dashboard and calendar timelines.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setDeleteConfirmId(null)} 
                                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors text-xs flex-1"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="px-4 py-2 bg-red-650 text-white hover:bg-red-750 rounded-xl font-bold transition-colors text-xs flex-1 shadow-md"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
