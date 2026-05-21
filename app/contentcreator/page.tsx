'use client'

import { useState, useEffect } from 'react'
import {
    Video,
    Calendar as CalendarIcon,
    Clock,
    User,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    CircleDot,
    PlayCircle,
    Loader2,
    ArrowRight,
    Sparkles,
    FileVideo
} from 'lucide-react'
import Link from 'next/link'
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

export default function CreatorDashboard() {
    const [tasks, setTasks] = useState<VideoTask[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date()) // Handles calendar navigation
    const [selectedTask, setSelectedTask] = useState<VideoTask | null>(null)
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

    // Load active creator tasks from backend API
    const loadTasks = async () => {
        try {
            setLoading(true)
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch('http://localhost:1000/api/video-tasks', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            } else {
                console.error("Failed to fetch creator tasks")
            }
        } catch (e) {
            console.error("Error fetching tasks", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    // Update Status Handler
    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            setUpdatingStatusId(taskId)
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch(`http://localhost:1000/api/video-tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                const updatedTask = await res.json()
                setTasks(prev => prev.map(t => t._id === taskId ? updatedTask : t))
                if (selectedTask && selectedTask._id === taskId) {
                    setSelectedTask(updatedTask)
                }
                toast.success(`Task status updated to ${newStatus}`)
            } else {
                toast.error("Failed to update status")
            }
        } catch (e) {
            console.error("Status update error", e)
            toast.error("An error occurred")
        } finally {
            setUpdatingStatusId(null)
        }
    }

    // Status Mapping Helper for Creator-centric Terms
    const mapStatusToCreator = (status: string) => {
        switch (status) {
            case 'To Do': return 'Concept Idea'
            case 'In Progress': return 'Scriptwriting'
            case 'In Review': return 'Filming Queue'
            case 'Completed': return 'Draft Sent to Editor'
            case 'Published': return 'Published & Live!'
            default: return status
        }
    }

    // Dynamic stats computations
    const totalTasks = tasks.length
    const toDoTasks = tasks.filter(t => t.status === 'To Do').length
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length
    const reviewTasks = tasks.filter(t => t.status === 'In Review').length
    const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Published').length

    // Progress percentage
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Priority styles helper
    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            case 'Medium': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
            default: return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        }
    }

    // Status styles helper
    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-50 text-green-700 border-green-200'
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'In Review': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-gray-50 text-gray-600 border-gray-200'
        }
    }

    // Calendar Calculations
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay() // Day of the week for index 1
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate() // Last date of month

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    // Prepare Calendar Grid Array
    const calendarCells = []

    // Empty cells for alignment before first day
    const blankCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to start on Monday
    for (let i = 0; i < blankCount; i++) {
        calendarCells.push({ dateStr: '', dayNum: 0 })
    }

    // Real day cells
    for (let i = 1; i <= totalDaysInMonth; i++) {
        const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        calendarCells.push({ dateStr: dString, dayNum: i })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Welcome Card */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-emerald-500/20 relative overflow-hidden group hover:shadow-emerald-950/20 hover:shadow-2xl transition-all duration-300">
                {/* Decorative Glowing blobs */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Creator Workspace Studio</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">Creative Studio Workspace</h2>
                    <p className="text-slate-200/80 text-sm max-w-xl leading-relaxed">
                        Draft engaging scripts, outline viral hooks, coordinate filming schedules, and archive story ideas.
                    </p>
                </div>
                <div className="shrink-0 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 relative z-10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                        {progressPercent}%
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400">Total Completion</p>
                        <p className="text-sm font-extrabold text-white">{completedTasks} / {totalTasks} Scripts Live</p>
                    </div>
                </div>
            </div>

            {/* Dynamic KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Concepts & Ideas', value: toDoTasks, gradient: 'from-gray-50 to-slate-100/50 text-slate-700 border-slate-200/60 hover:border-slate-350', icon: CircleDot, iconBg: 'bg-slate-100 text-slate-500' },
                    { label: 'Scriptwriting', value: inProgressTasks, gradient: 'from-blue-50/50 to-indigo-50/20 text-blue-700 border-blue-100 hover:border-blue-200', icon: Clock, iconBg: 'bg-blue-50 text-blue-500' },
                    { label: 'Filming Queue', value: reviewTasks, gradient: 'from-amber-50/50 to-yellow-50/20 text-amber-700 border-amber-100 hover:border-amber-200', icon: AlertCircle, iconBg: 'bg-amber-50 text-amber-500' },
                    { label: 'Scripts Delivered', value: completedTasks, gradient: 'from-emerald-50/50 to-teal-50/20 text-emerald-700 border-emerald-100 hover:border-emerald-200', icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-500' },
                ].map((kpi, idx) => (
                    <div 
                        key={idx} 
                        className={`bg-white/80 backdrop-blur-md p-5 rounded-2xl border ${kpi.gradient} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 group cursor-default`}
                    >
                        <div className="space-y-1 min-w-0">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block truncate">{kpi.label}</span>
                            <span className="text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-300 inline-block">{kpi.value}</span>
                        </div>
                        <div className={`w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <kpi.icon className="w-5.5 h-5.5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress and Video uploads pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Progress Panel */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">Script Pipeline Status</h3>
                            <span className="text-xs bg-emerald-50 text-emerald-600 font-extrabold px-2.5 py-1 rounded-full">{progressPercent}% Delivered</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { raw: 'To Do', status: 'Concept Idea', count: toDoTasks, total: totalTasks, color: 'bg-gray-400' },
                                { raw: 'In Progress', status: 'Scriptwriting', count: inProgressTasks, total: totalTasks, color: 'bg-blue-500' },
                                { raw: 'In Review', status: 'Filming Queue', count: reviewTasks, total: totalTasks, color: 'bg-amber-500' },
                                { raw: 'Completed', status: 'Draft Sent to Editor', count: completedTasks, total: totalTasks, color: 'bg-emerald-500' }
                            ].map((row, rIdx) => {
                                const rowPercent = totalTasks > 0 ? Math.round((row.count / totalTasks) * 100) : 0
                                return (
                                    <div key={rIdx} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-700 flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${row.color}`}></span>
                                                {row.status}
                                            </span>
                                            <span className="text-gray-900">{row.count} ({rowPercent}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
                                            <div className={`${row.color} h-full rounded-full`} style={{ width: `${rowPercent}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-150">
                        <Link href="/contentcreator/videos" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center justify-between group">
                            <span>Submit Finalized Script & Hook Vault Item</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Queue lists */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Creator Production Pipeline</h3>
                            <p className="text-xs text-gray-500 mt-0.5">High priority storyboard scripts & draft concepts.</p>
                        </div>
                        <Link href="/contentcreator/schedules" className="text-xs font-bold text-emerald-600 hover:underline">
                            View All Scheduler
                        </Link>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl">
                            <FileVideo className="w-12 h-12 text-gray-300 mb-3" />
                            <h4 className="font-bold text-gray-900 text-sm">Concept Vault Empty</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-xs">No script projects or uploads have been logged yet.</p>
                            <Link href="/contentcreator/schedules" className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors">
                                Add First Concept
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto max-h-[300px]">
                            {tasks.filter(t => t.status !== 'Completed' && t.status !== 'Published').slice(0, 4).map(task => (
                                <div
                                    key={task._id}
                                    onClick={() => setSelectedTask(task)}
                                    className="p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-150 shadow-sm flex items-center justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 text-sm line-clamp-1">{task.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{task.dueDate} • {task.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getPriorityStyle(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getStatusBadgeStyle(task.status)}`}>
                                            {mapStatusToCreator(task.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Interactive Calendar view */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-md transition-all duration-300">
                {/* Calendar Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-55/10">
                    <div>
                        <h3 className="font-extrabold text-gray-950 text-lg flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-emerald-500" />
                            Production Calendar & Scheduler
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Monthly content pipeline scheduling and release planning.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-xs font-extrabold text-gray-800 min-w-[100px] text-center">
                            {monthNames[month]} {year}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex flex-col bg-gray-100">
                    <div className="grid grid-cols-7 gap-px bg-gray-250">
                        {/* Days Header */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="bg-white py-3 text-center border-b border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                        {calendarCells.map((cell, idx) => {
                            if (!cell.dayNum) {
                                return <div key={`blank-${idx}`} className="bg-gray-50/50 min-h-[110px] p-2"></div>
                            }

                            // Match tasks on this day
                            const dayTasks = tasks.filter(t => t.dueDate === cell.dateStr)

                            return (
                                <div key={cell.dateStr} className="bg-white min-h-[110px] p-2 flex flex-col gap-1.5 border-b border-gray-50 group hover:bg-gray-50/40 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-extrabold text-gray-900">{cell.dayNum}</span>
                                        {dayTasks.length > 0 && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
                                        {dayTasks.map(task => (
                                            <div
                                                key={task._id}
                                                onClick={() => setSelectedTask(task)}
                                                className={`p-1 px-1.5 text-[9px] font-extrabold rounded-md border truncate leading-tight cursor-pointer shadow-sm hover:scale-102 transition-transform ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    task.status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-250'
                                                    }`}
                                                title={task.title}
                                            >
                                                {task.time} {task.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-55/50">
                            <div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getPriorityStyle(selectedTask.priority)}`}>
                                    {selectedTask.priority} Priority
                                </span>
                                <h3 className="font-extrabold text-gray-900 text-lg mt-1">{selectedTask.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-150/40 p-1.5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4 text-sm">
                            {selectedTask.description && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Concept Summary</h4>
                                    <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Upload Date & Time</h4>
                                    <p className="text-gray-900 font-semibold">{selectedTask.dueDate} • {selectedTask.time}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Platform Focus</h4>
                                    <p className="text-gray-900 font-semibold">{selectedTask.type}</p>
                                </div>
                            </div>

                            {selectedTask.duration && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Video Duration Target</h4>
                                    <p className="text-gray-900 font-semibold">{selectedTask.duration}</p>
                                </div>
                            )}

                            {selectedTask.videoUrl && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Draft Script / Storyboard Reference</h4>
                                    <a
                                        href={selectedTask.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:underline font-bold flex items-center gap-1.5 mt-0.5"
                                    >
                                        <PlayCircle className="w-4 h-4 shrink-0" />
                                        <span>View Submitted Vault Item</span>
                                    </a>
                                </div>
                            )}

                            {(() => {
                                const renderNotes = (notesStr?: string) => {
                                    if (!notesStr) return null;
                                    try {
                                        const parsed = JSON.parse(notesStr)
                                        if (parsed && typeof parsed === 'object') {
                                            return (
                                                <div className="space-y-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 text-xs">
                                                    {parsed.platform && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Publish Platform</span>
                                                            <span className="text-xs font-extrabold text-slate-800 inline-block bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5">{parsed.platform}</span>
                                                        </div>
                                                    )}
                                                    {parsed.audience && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Target Audience</span>
                                                            <p className="text-xs font-bold text-gray-800 mt-0.5">🎯 {parsed.audience}</p>
                                                        </div>
                                                    )}
                                                    {parsed.scriptUrl && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Script Link</span>
                                                            <a 
                                                                href={parsed.scriptUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-xs font-bold text-emerald-600 hover:underline block truncate mt-0.5"
                                                            >
                                                                🔗 {parsed.scriptUrl}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {parsed.scriptDraft && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Script Draft</span>
                                                            <div className="mt-1 p-2.5 bg-white border border-gray-200 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800">
                                                                {parsed.scriptDraft}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {parsed.storyHooks && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Viral Story Hooks</span>
                                                            <div className="mt-1 p-2.5 bg-white border border-gray-200 rounded-lg max-h-24 overflow-y-auto text-[11px] leading-relaxed text-slate-700 font-semibold italic">
                                                                ✨ {parsed.storyHooks}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {parsed.rawNotes && (
                                                        <div>
                                                            <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Campaign Notes</span>
                                                            <p className="text-xs text-gray-650 leading-relaxed mt-0.5">{parsed.rawNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                    } catch (e) {
                                        // Fallback
                                    }
                                    return <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg text-xs leading-relaxed border border-gray-150">{notesStr}</p>
                                }

                                if (selectedTask.notes) {
                                    return (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Campaign Goals & Audience Hooks</h4>
                                            {renderNotes(selectedTask.notes)}
                                        </div>
                                    )
                                }
                                return null
                            })()}

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Update Production Phase</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { raw: 'To Do', label: 'Concept Idea' },
                                        { raw: 'In Progress', label: 'Scriptwriting' },
                                        { raw: 'In Review', label: 'Filming Queue' }
                                    ].map(st => (
                                        <button
                                            key={st.raw}
                                            disabled={updatingStatusId !== null}
                                            onClick={() => handleStatusChange(selectedTask._id, st.raw)}
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${selectedTask.status === st.raw
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href="/contentcreator/videos"
                                        onClick={() => setSelectedTask(null)}
                                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs text-center shadow-md transition-colors"
                                    >
                                        Submit Draft Story / Script & Finalize
                                    </Link>
                                </div>
                            </div>
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
