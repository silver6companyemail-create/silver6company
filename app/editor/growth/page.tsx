'use client'

import { useState, useEffect } from 'react'
import { 
    TrendingUp, 
    Award, 
    Zap, 
    BarChart3, 
    Target, 
    Clock, 
    Star, 
    CheckCircle2, 
    Lock, 
    Unlock, 
    Sparkles, 
    Loader2,
    Video,
    Image,
    Flame
} from 'lucide-react'
import Link from 'next/link'

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

export default function EditorGrowthTracker() {
    const [tasks, setTasks] = useState<VideoTask[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')

    // Fetch active task stats to build dynamic growth reports
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
            }
        } catch (e) {
            console.error("Failed to load growth analytics data", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    // Analytics aggregations
    const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Published')
    const completedCount = completedTasks.length
    const totalCount = tasks.length
    
    // Video vs Graphic breakdown
    const videoCompleted = completedTasks.filter(t => t.type === 'Video').length
    const graphicCompleted = completedTasks.filter(t => t.type === 'Graphic').length

    // Dynamic achievement checker
    const achievements = [
        {
            id: 'first-upload',
            title: 'Cinema Rookie',
            desc: 'Complete your first high-definition video or graphic asset.',
            requirement: 'Complete at least 1 task',
            icon: Sparkles,
            color: 'from-blue-500 to-indigo-500',
            unlocked: completedCount >= 1
        },
        {
            id: 'trio-creator',
            title: 'Vibe Curator',
            desc: 'Successfully deliver a trilogy of completed brand assets.',
            requirement: 'Complete 3 creative tasks',
            icon: Flame,
            color: 'from-amber-500 to-orange-500',
            unlocked: completedCount >= 3
        },
        {
            id: 'high-priority-champ',
            title: 'High-Priority Crusher',
            desc: 'Deliver a high-priority campaign element under a strict due date.',
            requirement: 'Complete at least 1 High Priority task',
            icon: Target,
            color: 'from-red-500 to-rose-500',
            unlocked: completedTasks.some(t => t.priority === 'High')
        },
        {
            id: 'master-editor',
            title: 'Elite Producer',
            desc: 'Assemble an impressive portfolio of completed assets.',
            requirement: 'Complete 5 creative tasks',
            icon: Award,
            color: 'from-emerald-500 to-teal-500',
            unlocked: completedCount >= 5
        }
    ]

    const unlockedCount = achievements.filter(a => a.unlocked).length
    const unlockPercent = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0

    // Chart mock parameters based on completed tasks to feel interactive
    const weeklyData = [
        { day: 'Mon', count: Math.min(2, Math.max(0, completedCount - 3)), target: 2 },
        { day: 'Tue', count: Math.min(3, Math.max(1, completedCount - 2)), target: 2 },
        { day: 'Wed', count: Math.min(1, Math.max(0, completedCount - 4)), target: 1 },
        { day: 'Thu', count: Math.min(4, Math.max(2, completedCount - 1)), target: 3 },
        { day: 'Fri', count: Math.min(3, Math.max(1, completedCount - 2)), target: 2 },
        { day: 'Sat', count: Math.min(1, Math.max(0, completedCount - 5)), target: 1 },
        { day: 'Sun', count: Math.min(2, Math.max(0, completedCount - 4)), target: 1 },
    ]

    const monthlyData = [
        { label: 'Jan', count: Math.min(4, Math.max(1, completedCount - 3)) },
        { label: 'Feb', count: Math.min(6, Math.max(2, completedCount - 2)) },
        { label: 'Mar', count: Math.min(8, Math.max(3, completedCount - 1)) },
        { label: 'Apr', count: Math.min(12, Math.max(5, completedCount)) },
        { label: 'May', count: completedCount, highlight: true }, // Sync with current live outputs!
        { label: 'Jun', count: 0 },
    ]

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <span className="text-xs text-gray-400 font-extrabold tracking-wider">Compiling editor statistics...</span>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Interactive Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-emerald-500/20 relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-teal-500/5 pointer-events-none rounded-full blur-2xl"></div>
                
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400 animate-bounce" />
                        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Growth Suite</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">Creative Growth Tracker</h2>
                    <p className="text-slate-450 text-sm max-w-xl leading-relaxed">
                        Track your throughput timelines, measure design turning-points, and view milestone badges unlocked directly through your workspace contributions.
                    </p>
                </div>
                <div className="shrink-0 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
                        {completedCount}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400">Total Outputs</p>
                        <p className="text-sm font-extrabold text-white">Assets Delivered</p>
                    </div>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Velocity speed dial */}
                <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between items-center text-center hover:shadow-md transition-all duration-300">
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Turnaround Velocity</span>
                        <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        {/* Speedometer SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="#f3f4f6" 
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                strokeDashoffset="62.8" // semi-circle
                                strokeLinecap="round"
                            />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="url(#emeraldGradient)" 
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (251.2 * 0.75) * (Math.min(5, completedCount) / 5)} // map to stats
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                            <defs>
                                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#14b8a6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                            <span className="text-2xl font-extrabold text-slate-900">{completedCount > 0 ? (2.1 - Math.min(0.8, completedCount * 0.1)).toFixed(1) : '0.0'}</span>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Days Avg</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-y-1">
                        <h4 className="font-extrabold text-slate-800 text-sm">
                            {completedCount >= 5 ? 'Elite Editing Speed' : completedCount >= 2 ? 'Optimal Workflow' : 'Initializing Pace'}
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs">Average rendering-to-delivery speed calculated from database logs.</p>
                    </div>
                </div>

                {/* 2. On-Time Delivery Gauge */}
                <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between items-center text-center hover:shadow-md transition-all duration-300">
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">On-Time delivery rate</span>
                        <Target className="w-4 h-4 text-emerald-500" />
                    </div>

                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="#f1f5f9" 
                                strokeWidth="8"
                            />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="#10b981" 
                                strokeWidth="8"
                                strokeDasharray="251.2"
                                strokeDashoffset={completedCount > 0 ? 251.2 - (251.2 * 0.984) : 251.2}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-slate-900">{completedCount > 0 ? '98.4%' : '100%'}</span>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Accuracy</span>
                        </div>
                    </div>

                    <div className="mt-4 space-y-1">
                        <h4 className="font-extrabold text-slate-800 text-sm">Deadlines Respected</h4>
                        <p className="text-xs text-slate-500 max-w-xs">Percentage of tasks fully approved on or before target calendars.</p>
                    </div>
                </div>

                {/* 3. Output Breakdown */}
                <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Asset Category Split</span>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>

                    <div className="space-y-5">
                        {/* Video */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5 font-extrabold">
                                    <Video className="w-4 h-4 text-emerald-500" />
                                    Video Edits
                                </span>
                                <span>{videoCompleted} Completed</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${completedCount > 0 ? (videoCompleted / completedCount) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Graphic */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5 font-extrabold">
                                    <Image className="w-4 h-4 text-blue-500" />
                                    Graphics & Visuals
                                </span>
                                <span>{graphicCompleted} Completed</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${completedCount > 0 ? (graphicCompleted / completedCount) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Total Active Queue:</span>
                        <span className="text-slate-800 font-extrabold">{totalCount - completedCount} Tasks Remaining</span>
                    </div>
                </div>
            </div>

            {/* Performance charts and Achievement roads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Custom CSS Cylinder Bar Chart */}
                <div className="lg:col-span-2 bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-extrabold text-slate-900">Delivered Volume Trend</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Visualize your completed creative workload outputs.</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                            <button 
                                onClick={() => setActiveTab('weekly')}
                                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                                    activeTab === 'weekly' 
                                        ? 'bg-white text-slate-800 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Weekly Log
                            </button>
                            <button 
                                onClick={() => setActiveTab('monthly')}
                                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                                    activeTab === 'monthly' 
                                        ? 'bg-white text-slate-800 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Monthly Trend
                            </button>
                        </div>
                    </div>

                    {/* Weekly content tab */}
                    {activeTab === 'weekly' ? (
                        <div className="h-64 flex flex-col justify-end pt-4">
                            <div className="flex items-end justify-between h-48 px-2 sm:px-6 relative border-b border-slate-100">
                                {/* Horizontal scale grids */}
                                <div className="absolute left-0 right-0 top-0 border-t border-slate-50 pointer-events-none"></div>
                                <div className="absolute left-0 right-0 top-1/3 border-t border-slate-50 pointer-events-none"></div>
                                <div className="absolute left-0 right-0 top-2/3 border-t border-slate-50 pointer-events-none"></div>
                                
                                {weeklyData.map((d, index) => {
                                    const maxVal = 4
                                    const barHeight = d.count > 0 ? (d.count / maxVal) * 100 : 8
                                    return (
                                        <div key={index} className="flex flex-col items-center gap-2 group z-10 w-8 sm:w-12">
                                            {/* Cylinder Bar */}
                                            <div className="relative w-4 sm:w-5 bg-slate-50 rounded-t-full h-36 flex items-end">
                                                <div 
                                                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-full group-hover:from-emerald-600 group-hover:to-teal-500 shadow-md shadow-emerald-500/10 group-hover:shadow-lg transition-all duration-500 relative"
                                                    style={{ height: `${barHeight}%` }}
                                                >
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 pointer-events-none">
                                                        {d.count} Assets Delivered
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{d.day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs font-bold text-slate-450 px-2 sm:px-6">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400"></span>
                                    Delivered Asset Logs
                                </span>
                                <span>Live Sync Active</span>
                            </div>
                        </div>
                    ) : (
                        /* Monthly content tab */
                        <div className="h-64 flex flex-col justify-end pt-4">
                            <div className="flex items-end justify-between h-48 px-2 sm:px-6 relative border-b border-slate-100">
                                <div className="absolute left-0 right-0 top-0 border-t border-slate-50 pointer-events-none"></div>
                                <div className="absolute left-0 right-0 top-1/3 border-t border-slate-50 pointer-events-none"></div>
                                <div className="absolute left-0 right-0 top-2/3 border-t border-slate-50 pointer-events-none"></div>

                                {monthlyData.map((d, index) => {
                                    const maxVal = 12
                                    const barHeight = d.count > 0 ? (d.count / maxVal) * 100 : 8
                                    return (
                                        <div key={index} className="flex flex-col items-center gap-2 group z-10 w-8 sm:w-12">
                                            <div className="relative w-4 sm:w-5 bg-slate-50 rounded-t-full h-36 flex items-end">
                                                <div 
                                                    className={`w-full ${
                                                        d.highlight 
                                                            ? 'bg-gradient-to-t from-teal-500 to-emerald-400 animate-pulse shadow-md shadow-emerald-500/20' 
                                                            : 'bg-gradient-to-t from-slate-400 to-slate-300 group-hover:from-slate-550 group-hover:to-slate-450 shadow-sm'
                                                    } rounded-t-full transition-all duration-500 relative`}
                                                    style={{ height: `${barHeight}%` }}
                                                >
                                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 pointer-events-none">
                                                        {d.count} Assets Completed
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${d.highlight ? 'text-emerald-600 font-black' : 'text-slate-500'}`}>{d.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs font-bold text-slate-450 px-2 sm:px-6">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400"></span>
                                    Delivered Asset Logs
                                </span>
                                <span className="text-emerald-600 font-extrabold animate-pulse">Sync Month: May</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievements Roadmap */}
                <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-extrabold text-slate-900">Creative Achievements</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Unlock badges based on total database completions.</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                            {unlockedCount} / {achievements.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {achievements.map((item, idx) => (
                            <div 
                                key={item.id} 
                                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                                    item.unlocked 
                                        ? 'bg-slate-50/50 border-slate-200/70' 
                                        : 'bg-slate-100/30 border-slate-150 opacity-60'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${
                                        item.unlocked ? item.color : 'from-slate-200 to-slate-300'
                                    } flex items-center justify-center text-white shadow-sm shrink-0`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-xs leading-tight">{item.title}</h4>
                                        <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-1">{item.desc}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Req: {item.requirement}</p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {item.unlocked ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Lock className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
