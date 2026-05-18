'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, List as ListIcon, Filter, Search, Plus, Clock, User, Building, AlertCircle, ChevronLeft, ChevronRight, X, Trash2, Edit } from 'lucide-react'

// --- Mock Data ---
interface Schedule {
    id: string
    title: string
    department: string
    assignee: string
    date: string // YYYY-MM-DD
    time: string
    status: 'Pending' | 'In Progress' | 'Completed'
    priority: 'High' | 'Medium' | 'Low'
}

const DEPARTMENTS = ['All', 'Content', 'Sales', 'Delivery', 'Follow-up']
const FORM_DEPARTMENTS = ['Content', 'Sales', 'Delivery', 'Follow-up']

const initialSchedules: Schedule[] = [
    { id: 's1', title: 'Edit Summer Promo Video', department: 'Content', assignee: 'Alex R.', date: '2026-05-18', time: '10:00', status: 'Pending', priority: 'High' },
    { id: 's2', title: 'Client Pitch Meeting', department: 'Sales', assignee: 'Sarah M.', date: '2026-05-18', time: '14:00', status: 'In Progress', priority: 'High' },
    { id: 's3', title: 'Downtown Deliveries (Route A)', department: 'Delivery', assignee: 'John D.', date: '2026-05-19', time: '08:00', status: 'Pending', priority: 'Medium' },
    { id: 's4', title: 'Customer Feedback Calls', department: 'Follow-up', assignee: 'Diana P.', date: '2026-05-19', time: '11:00', status: 'Completed', priority: 'Low' },
    { id: 's5', title: 'Create Ad Graphics', department: 'Content', assignee: 'Sam T.', date: '2026-05-20', time: '09:00', status: 'Pending', priority: 'Medium' },
    { id: 's6', title: 'Follow up on Bulk Order', department: 'Sales', assignee: 'Bob S.', date: '2026-05-20', time: '15:30', status: 'Pending', priority: 'High' },
    { id: 's7', title: 'Express Delivery - Tech Hub', department: 'Delivery', assignee: 'Mike Speed', date: '2026-05-21', time: '12:00', status: 'Pending', priority: 'High' },
    { id: 's8', title: 'Content Review Sync', department: 'Content', assignee: 'Alex R.', date: '2026-05-21', time: '16:00', status: 'Pending', priority: 'Medium' },
    { id: 's9', title: 'Weekly Sales Report', department: 'Sales', assignee: 'Sarah M.', date: '2026-05-22', time: '10:00', status: 'Pending', priority: 'High' },
    { id: 's10', title: 'Suburban Deliveries', department: 'Delivery', assignee: 'John D.', date: '2026-05-22', time: '09:00', status: 'Pending', priority: 'Medium' },
]

// Hardcoded week for the mock calendar view
const weekDays = [
    { name: 'Monday', date: '2026-05-18', dayNumber: '18' },
    { name: 'Tuesday', date: '2026-05-19', dayNumber: '19' },
    { name: 'Wednesday', date: '2026-05-20', dayNumber: '20' },
    { name: 'Thursday', date: '2026-05-21', dayNumber: '21' },
    { name: 'Friday', date: '2026-05-22', dayNumber: '22' },
    { name: 'Saturday', date: '2026-05-23', dayNumber: '23' },
    { name: 'Sunday', date: '2026-05-24', dayNumber: '24' },
]

export default function Schedules() {
    const [activeView, setActiveView] = useState<'list' | 'calendar'>('list')
    const [deptFilter, setDeptFilter] = useState('All')
    const [employeeFilter, setEmployeeFilter] = useState('')
    const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)

    // Modal State
    const [isBulkAddOpen, setIsBulkAddOpen] = useState(false)
    const [newTasks, setNewTasks] = useState([{ title: '', department: 'Content', assignee: '', date: '', time: '', priority: 'Medium' as 'High' | 'Medium' | 'Low' }])
    
    // Edit & Delete State
    const [editSchedule, setEditSchedule] = useState<Schedule | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Filtering logic
    const filteredSchedules = schedules.filter(schedule => {
        const matchesDept = deptFilter === 'All' || schedule.department === deptFilter
        const matchesEmployee = schedule.assignee.toLowerCase().includes(employeeFilter.toLowerCase())
        return matchesDept && matchesEmployee
    })

    // Helper for Priority Colors
    const getPriorityColor = (priority: string) => {
        if (priority === 'High') return 'bg-red-50 text-red-700 border-red-200'
        if (priority === 'Medium') return 'bg-orange-50 text-orange-700 border-orange-200'
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }

    // Modal Handlers (Bulk Add)
    const handleAddTaskRow = () => {
        setNewTasks([...newTasks, { title: '', department: 'Content', assignee: '', date: '', time: '', priority: 'Medium' }])
    }

    const handleRemoveTaskRow = (index: number) => {
        if (newTasks.length > 1) {
            setNewTasks(newTasks.filter((_, i) => i !== index))
        }
    }

    const handleTaskChange = (index: number, field: string, value: string) => {
        const updated = [...newTasks]
        updated[index] = { ...updated[index], [field]: value }
        setNewTasks(updated)
    }

    const handleSaveSchedules = (e: React.FormEvent) => {
        e.preventDefault()
        const formattedTasks: Schedule[] = newTasks
            .filter(t => t.title && t.assignee && t.date && t.time)
            .map((t, i) => ({
                id: `ns-${Date.now()}-${i}`,
                title: t.title,
                department: t.department,
                assignee: t.assignee,
                date: t.date,
                time: t.time,
                status: 'Pending',
                priority: t.priority
            }))
        if (formattedTasks.length > 0) {
            setSchedules([...formattedTasks, ...schedules])
        }
        setIsBulkAddOpen(false)
        setNewTasks([{ title: '', department: 'Content', assignee: '', date: '', time: '', priority: 'Medium' }])
    }

    // Modal Handlers (Edit & Delete)
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editSchedule) return
        setSchedules(schedules.map(s => s.id === editSchedule.id ? editSchedule : s))
        setEditSchedule(null)
    }

    const handleDelete = () => {
        if (!deleteConfirmId) return
        setSchedules(schedules.filter(s => s.id !== deleteConfirmId))
        setDeleteConfirmId(null)
    }

    // Format 24h time to 12h time for display
    const formatTime = (time: string) => {
        if (!time) return ''
        const [h, m] = time.split(':')
        let hours = parseInt(h)
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12 || 12
        return `${hours}:${m} ${ampm}`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Schedules & Tasks</h2>
                    <p className="text-gray-500 mt-0.5">Manage schedules across all departments and track employee assignments.</p>
                </div>
                <button 
                    onClick={() => setIsBulkAddOpen(true)}
                    className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Schedule
                </button>
            </div>

            {/* Filters & View Toggles */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Department Filter */}
                    <div className="relative w-full sm:w-auto min-w-[200px]">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select 
                            value={deptFilter} 
                            onChange={e => setDeptFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] focus:border-[#2db34a] appearance-none"
                        >
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept} Department</option>
                            ))}
                        </select>
                    </div>

                    {/* Employee Filter */}
                    <div className="relative w-full sm:w-auto min-w-[250px]">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Filter by specific employee..." 
                            value={employeeFilter}
                            onChange={e => setEmployeeFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] focus:border-[#2db34a]"
                        />
                    </div>
                </div>

                {/* View Toggles */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-full lg:w-auto justify-center">
                    <button 
                        onClick={() => setActiveView('list')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeView === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ListIcon className="w-4 h-4" />
                        List View
                    </button>
                    <button 
                        onClick={() => setActiveView('calendar')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeView === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Calendar View
                    </button>
                </div>
            </div>

            {/* Views Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                
                {/* --- LIST VIEW --- */}
                {activeView === 'list' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                                <tr>
                                    <th className="p-4 font-medium">Task & Schedule</th>
                                    <th className="p-4 font-medium">Department</th>
                                    <th className="p-4 font-medium">Assignee</th>
                                    <th className="p-4 font-medium">Date & Time</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Priority</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredSchedules.map(schedule => (
                                    <tr key={schedule.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 font-medium text-gray-900">{schedule.title}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                                                <Building className="w-3.5 h-3.5" />
                                                {schedule.department}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {schedule.assignee.charAt(0)}
                                            </div>
                                            {schedule.assignee}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">{schedule.date}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" /> {schedule.time.includes('M') ? schedule.time : formatTime(schedule.time)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                schedule.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                                schedule.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                                'bg-orange-50 text-orange-700'
                                            }`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-bold ${getPriorityColor(schedule.priority)}`}>
                                                {schedule.priority === 'High' && <AlertCircle className="w-3 h-3" />}
                                                {schedule.priority}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditSchedule(schedule)} className="p-1.5 text-gray-400 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteConfirmId(schedule.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSchedules.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <CalendarIcon className="w-10 h-10 text-gray-300 mb-3" />
                                                <p className="text-lg font-medium text-gray-900">No schedules found</p>
                                                <p className="text-sm">Adjust your department or employee filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- CALENDAR VIEW --- */}
                {activeView === 'calendar' && (
                    <div className="flex flex-col h-full bg-gray-50">
                        {/* Calendar Header */}
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-lg">May 2026</h3>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-5 h-5"/></button>
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Today</button>
                                <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-5 h-5"/></button>
                            </div>
                        </div>

                        {/* Calendar Grid - Weekly representation */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 flex-1">
                            {/* Days Header */}
                            {weekDays.map(day => (
                                <div key={day.name} className="bg-white p-3 text-center border-b-2 border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{day.name.slice(0,3)}</p>
                                    <p className="text-xl font-medium text-gray-900 mt-1">{day.dayNumber}</p>
                                </div>
                            ))}

                            {/* Schedule Cells */}
                            {weekDays.map(day => {
                                const dayTasks = filteredSchedules.filter(s => s.date === day.date)
                                dayTasks.sort((a,b) => a.time.localeCompare(b.time))

                                return (
                                    <div key={`cell-${day.date}`} className="bg-white min-h-[350px] p-2 flex flex-col gap-2">
                                        {dayTasks.map(task => (
                                            <div 
                                                key={task.id} 
                                                onClick={() => setEditSchedule(task)}
                                                className={`p-2.5 rounded-lg border flex flex-col gap-1 hover:shadow-md cursor-pointer transition-shadow ${getPriorityColor(task.priority)} bg-opacity-40`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/50 px-1.5 py-0.5 rounded">{task.department}</span>
                                                    <span className="text-[10px] font-bold">{task.time.includes('M') ? task.time : formatTime(task.time)}</span>
                                                </div>
                                                <p className="text-xs font-bold leading-tight mt-1 line-clamp-2">{task.title}</p>
                                                <p className="text-[10px] font-medium flex items-center gap-1 mt-1 opacity-80">
                                                    <User className="w-3 h-3" /> {task.assignee}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}

            {/* Bulk Add Schedule Modal */}
            {isBulkAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add New Schedules</h2>
                                <p className="text-sm text-gray-500">Add one or multiple tasks across different employees simultaneously.</p>
                            </div>
                            <button onClick={() => setIsBulkAddOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveSchedules} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-5 overflow-y-auto flex-1 bg-gray-50/30">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-3">Task Title</div>
                                        <div className="col-span-2">Department</div>
                                        <div className="col-span-2">Assignee</div>
                                        <div className="col-span-2">Date</div>
                                        <div className="col-span-1">Time</div>
                                        <div className="col-span-1">Priority</div>
                                        <div className="col-span-1 text-center">Action</div>
                                    </div>

                                    {newTasks.map((task, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center">
                                            <div className="col-span-3">
                                                <input required type="text" value={task.title} onChange={e => handleTaskChange(index, 'title', e.target.value)} placeholder="e.g. Daily Sync" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                            </div>
                                            <div className="col-span-2">
                                                <select value={task.department} onChange={e => handleTaskChange(index, 'department', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                                    {FORM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input required type="text" value={task.assignee} onChange={e => handleTaskChange(index, 'assignee', e.target.value)} placeholder="Employee Name" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                            </div>
                                            <div className="col-span-2">
                                                <input required type="date" value={task.date} onChange={e => handleTaskChange(index, 'date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                            </div>
                                            <div className="col-span-1">
                                                <input required type="time" value={task.time} onChange={e => handleTaskChange(index, 'time', e.target.value)} className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                            </div>
                                            <div className="col-span-1">
                                                <select value={task.priority} onChange={e => handleTaskChange(index, 'priority', e.target.value)} className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Med</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button type="button" onClick={() => handleRemoveTaskRow(index)} disabled={newTasks.length === 1} className={`p-2 rounded-lg transition-colors ${newTasks.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" onClick={handleAddTaskRow} className="mt-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 font-medium text-sm transition-all flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Another Task
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                <button type="button" onClick={() => setIsBulkAddOpen(false)} className="px-5 py-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors shadow-sm">Save {newTasks.length} {newTasks.length === 1 ? 'Schedule' : 'Schedules'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Schedule Modal */}
            {editSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit Schedule</h2>
                            <button onClick={() => setEditSchedule(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input required type="text" value={editSchedule.title} onChange={e => setEditSchedule({ ...editSchedule, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select value={editSchedule.department} onChange={e => setEditSchedule({ ...editSchedule, department: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        {FORM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                    <input required type="text" value={editSchedule.assignee} onChange={e => setEditSchedule({ ...editSchedule, assignee: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input required type="date" value={editSchedule.date} onChange={e => setEditSchedule({ ...editSchedule, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input required type="time" value={editSchedule.time} onChange={e => setEditSchedule({ ...editSchedule, time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={editSchedule.status} onChange={e => setEditSchedule({ ...editSchedule, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select value={editSchedule.priority} onChange={e => setEditSchedule({ ...editSchedule, priority: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditSchedule(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Schedule?</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to delete this scheduled task? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex-1">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors flex-1">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}