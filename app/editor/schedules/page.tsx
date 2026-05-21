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

export default function EditorSchedules() {
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
        notes: ''
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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch('http://localhost:1000/api/video-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(formData)
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
                    notes: ''
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

            const res = await fetch(`http://localhost:1000/api/video-tasks/${editTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(editTask)
            })

            if (res.ok) {
                const updated = await res.json()
                setTasks(tasks.map(t => t._id === editTask._id ? updated : t))
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
                    <h2 className="text-2xl font-bold text-gray-900">Task Schedules & Queue</h2>
                    <p className="text-gray-500 mt-0.5">Manage work logs, deadline lists, and plan delivery categories dynamically.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transform transition-transform"
                >
                    <Plus className="w-5 h-5 shrink-0" />
                    New Task Schedule
                </button>
            </div>

            {/* Main Timelines Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden min-h-[450px]">
                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                        <span className="text-xs text-gray-400 font-bold">Synchronizing editor timeline logs...</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-center p-6">
                        <CalendarCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No scheduled tasks logged</h3>
                        <p className="text-gray-500 mt-1 max-w-sm text-sm">Create schedules detailing edit deadlines and upload details. They will automatically plot to your calendar dashboard.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors"
                        >
                            Add Scheduled Task
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6 font-semibold">Title & Category</th>
                                    <th className="p-4 font-semibold">Description</th>
                                    <th className="p-4 font-semibold">Timeline Deadlines</th>
                                    <th className="p-4 font-semibold">Duration Estimate</th>
                                    <th className="p-4 font-semibold">Priority</th>
                                    <th className="p-4 font-semibold">Status State</th>
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
                                                    <span className="block text-[10px] text-gray-400 font-bold mt-0.5">{task.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 max-w-[200px] truncate" title={task.description}>
                                            {task.description || "N/A"}
                                        </td>
                                        <td className="p-4 text-gray-600">
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
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-extrabold capitalize ${task.status === 'Completed' || task.status === 'Published' ? 'bg-green-50 text-green-700' :
                                                task.status === 'In Review' ? 'bg-amber-50 text-amber-700' :
                                                    task.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditTask(task)}
                                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Edit Task Schedule"
                                                >
                                                    <Edit className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(task._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Schedule"
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
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Create New Task Schedule</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Plot dates and durations onto your workflow calendar.</p>
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
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Task Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Winter Clothes Promo Reel"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter instructions, requirements, or guidelines..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Asset Category</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    >
                                        <option value="Video">Video Edit</option>
                                        <option value="Graphic">Graphic Template</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Task Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Due Date</label>
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

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Duration (e.g. 0:45 or 3 hours)</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g. 1:30"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Notes / Link references</label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional assets or reference links..."
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
                                    Create Schedule Task
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
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Modify Task Details</h3>
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
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Task Title</label>
                                <input
                                    required
                                    type="text"
                                    value={editTask.title}
                                    onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={editTask.description}
                                    onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Asset Category</label>
                                    <select
                                        value={editTask.type}
                                        onChange={e => setEditTask({ ...editTask, type: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    >
                                        <option value="Video">Video</option>
                                        <option value="Graphic">Graphic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Priority</label>
                                    <select
                                        value={editTask.priority}
                                        onChange={e => setEditTask({ ...editTask, priority: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
                                    <select
                                        value={editTask.status}
                                        onChange={e => setEditTask({ ...editTask, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-600 bg-emerald-50/50"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Due Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={editTask.dueDate}
                                        onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Time</label>
                                    <input
                                        required
                                        type="time"
                                        value={editTask.time}
                                        onChange={e => setEditTask({ ...editTask, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Duration Estimate</label>
                                    <input
                                        type="text"
                                        value={editTask.duration || ''}
                                        onChange={e => setEditTask({ ...editTask, duration: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Reference Notes</label>
                                    <input
                                        type="text"
                                        value={editTask.notes || ''}
                                        onChange={e => setEditTask({ ...editTask, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                                    />
                                </div>
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
                                    Save Timelines
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
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Task Schedule?</h2>
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
