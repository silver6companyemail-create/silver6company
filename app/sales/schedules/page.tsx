'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Loader2,
  X,
  TrendingUp,
  Award
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface MeetingTask {
  _id: string
  title: string
  description: string
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed' | 'Published'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string // YYYY-MM-DD
  time: string // HH:MM
  notes: string // We will store Zoom/Meet platform details here as serialized JSON or text
  type: 'Video' | 'Graphic'
}

export default function MeetingPlanner() {
  const [meetings, setMeetings] = useState<MeetingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'Zoom' as 'Zoom' | 'Google Meet' | 'Phone Sync' | 'In Person',
    meetUrl: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    dueDate: '',
    time: '',
    rawNotes: ''
  })

  // Load meeting tasks from live API
  const loadMeetings = async () => {
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
        setMeetings(data)
      } else {
        toast.error("Failed to load scheduled sync meetings")
      }
    } catch (e) {
      console.error("Error loading meetings", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeetings()
  }, [])

  // Create Meeting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.dueDate || !formData.time) {
      toast.error("Please enter a meeting title, date, and time")
      return
    }

    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr)

      // Serialize Zoom/Meet information securely inside the notes field
      const serializedNotes = JSON.stringify({
        platform: formData.platform,
        meetUrl: formData.meetUrl || 'No Link Provided',
        rawNotes: formData.rawNotes
      })

      const payload = {
        title: formData.title,
        description: formData.description,
        type: 'Video' as const, // Reusing existing video schema type
        status: 'To Do' as const,
        priority: formData.priority,
        dueDate: formData.dueDate,
        time: formData.time,
        notes: serializedNotes
      }

      const res = await fetch('http://localhost:1000/api/video-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const newMeeting = await res.json()
        setMeetings(prev => [...prev, newMeeting])
        setIsAddOpen(false)
        setFormData({
          title: '',
          description: '',
          platform: 'Zoom',
          meetUrl: '',
          priority: 'Medium',
          dueDate: '',
          time: '',
          rawNotes: ''
        })
        toast.success("Client sync meeting scheduled!")
      } else {
        toast.error("Failed to schedule meeting on backend")
      }
    } catch (e) {
      console.error("Schedule error", e)
      toast.error("An error occurred scheduling meeting")
    }
  }

  // Delete Meeting
  const handleDelete = async (meetingId: string) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return

    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr)

      const res = await fetch(`http://localhost:1000/api/video-tasks/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      })

      if (res.ok) {
        setMeetings(prev => prev.filter(m => m._id !== meetingId))
        toast.success("Sync meeting successfully deleted")
      } else {
        toast.error("Failed to delete meeting")
      }
    } catch (e) {
      console.error("Delete meeting error", e)
      toast.error("An error occurred")
    }
  }

  // Update Status / Done
  const handleToggleComplete = async (meeting: MeetingTask) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr)

      const newStatus = meeting.status === 'Completed' ? 'To Do' : 'Completed'

      const res = await fetch(`http://localhost:1000/api/video-tasks/${meeting._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        const updated = await res.json()
        setMeetings(prev => prev.map(m => m._id === meeting._id ? updated : m))
        toast.success(`Meeting status marked as ${newStatus}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch (e) {
      console.error("Status update error", e)
      toast.error("An error occurred")
    }
  }

  // Parse Meeting Notes Helper
  const parseNotes = (notesStr: string) => {
    try {
      return JSON.parse(notesStr)
    } catch (e) {
      return {
        platform: 'Direct Call',
        meetUrl: '',
        rawNotes: notesStr || 'No custom meeting details.'
      }
    }
  }

  // Style helpers for platform badges
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'Zoom': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Google Meet': return 'bg-red-50 text-red-700 border-red-200'
      case 'Phone Sync': return 'bg-teal-50 text-teal-700 border-teal-200'
      default: return 'bg-purple-50 text-purple-700 border-purple-200'
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-800 text-base">Client Meeting & Pitch Scheduler</h3>
          <p className="text-xs text-slate-400 font-medium">Plan zoom demo walks and proposal reviews with target warm accounts.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 flex items-center gap-2 transition-transform duration-200 active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Schedule Zoom / Meet Call
        </button>
      </div>

      {/* Meeting Cards List */}
      {loading ? (
        <div className="p-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-350 shadow-inner">
            <Video className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-800 text-sm">No scheduled meetings</h4>
            <p className="text-xs text-slate-400">Your calendar is clear! Click "Schedule Zoom / Meet Call" to book a client demo walkthrough.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {meetings.map(m => {
            const parsed = parseNotes(m.notes)
            const isCompleted = m.status === 'Completed'

            return (
              <div 
                key={m._id}
                className={`bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition-all relative ${
                  isCompleted ? 'opacity-70 bg-slate-50/50' : ''
                }`}
              >
                {/* Upper Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide border ${getPlatformBadge(parsed.platform)}`}>
                      {parsed.platform}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-extrabold uppercase tracking-wider border ${getPriorityStyle(m.priority)}`}>
                      {m.priority} Priority
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className={`font-extrabold text-sm text-slate-800 truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-550 leading-relaxed font-medium line-clamp-3">{m.description || 'No detailed meeting agenda.'}</p>
                  </div>

                  {/* Date & Time badges */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-450">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {m.dueDate}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {m.time}
                    </span>
                  </div>

                  {/* Serialized Link and Info */}
                  {parsed.meetUrl && parsed.meetUrl !== 'No Link Provided' && (
                    <div className="pt-2">
                      <a 
                        href={parsed.meetUrl.startsWith('http') ? parsed.meetUrl : `https://${parsed.meetUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-extrabold text-[10px] hover:underline"
                      >
                        Join Virtual Meeting <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {parsed.rawNotes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] font-medium text-slate-500">
                      <span className="font-bold text-slate-705 block mb-0.5">Meeting Agenda Notes:</span>
                      {parsed.rawNotes}
                    </div>
                  )}
                </div>

                {/* Actions Bottom */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleToggleComplete(m)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-white border-slate-250 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {isCompleted ? 'Sync Completed' : 'Mark Completed'}
                  </button>

                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Cancel Meeting"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* Add Scheduler Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-500" />
                <span className="font-extrabold text-sm text-slate-800">Schedule Client Sync Call</span>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sync Title / Agenda</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Apex Explainer Storyboard Walkthrough"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Agenda Description</label>
                  <textarea 
                    placeholder="Provide a brief summary of what will be discussed during this sync session..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2 rounded-xl transition-shadow text-slate-800 font-semibold h-20 resize-none animate-in fade-in"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conference Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="Zoom">Zoom Video</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Phone Sync">Direct Phone Sync</option>
                    <option value="In Person">In-Person Office Sync</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting URL / Link</label>
                  <input 
                    type="text"
                    placeholder="e.g. zoom.us/j/123456"
                    value={formData.meetUrl}
                    onChange={(e) => setFormData({...formData, meetUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Meeting Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-bold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Meeting Time</label>
                  <input 
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-bold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agenda Raw Notes</label>
                  <input 
                    type="text"
                    placeholder="e.g. Bring Apex contract pricing sheet"
                    value={formData.rawNotes}
                    onChange={(e) => setFormData({...formData, rawNotes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold px-5 py-2 rounded-xl shadow-md shadow-emerald-500/15 transition-all"
                >
                  Confirm Sync Meeting
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
