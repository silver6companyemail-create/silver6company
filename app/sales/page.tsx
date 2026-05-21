'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Target,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface SalesTask {
  _id: string
  title: string
  description: string
  type: 'Video' | 'Graphic' // Reused model categories
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed' | 'Published'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string // YYYY-MM-DD
  time: string // HH:MM
  notes?: string
}

export default function SalesDashboard() {
  const [tasks, setTasks] = useState<SalesTask[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date()) // Handles calendar navigation
  
  // Custom mock leads for dashboard visuals (synchronized with Leads hub)
  const [leadsCount, setLeadsCount] = useState(8)
  const [closedWonAmount, setClosedWonAmount] = useState(48200)
  const [conversionRate, setConversionRate] = useState(74)

  // Load scheduler sync meetings (stored in video-tasks for isolation)
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
        console.error("Failed to fetch schedules")
      }
    } catch (e) {
      console.error("Error fetching schedules", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()

    // Read leads stats from localStorage if they exist to match Leads page
    const storedLeads = localStorage.getItem('salesLeads')
    if (storedLeads) {
      try {
        const parsed = JSON.parse(storedLeads)
        if (Array.isArray(parsed)) {
          setLeadsCount(parsed.length)
          const won = parsed.filter(l => l.status === 'Closed Won (Converted)')
          const totalWonValue = won.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0)
          setClosedWonAmount(totalWonValue || 48200)
          
          const totalValid = parsed.length
          const wonCount = won.length
          if (totalValid > 0) {
            setConversionRate(Math.round((wonCount / totalValid) * 100))
          }
        }
      } catch (e) {
        console.error("Failed parsing stored leads", e)
      }
    }
  }, [])

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
  const blankCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to start on Monday
  
  for (let i = 0; i < blankCount; i++) {
    calendarCells.push({ dateStr: '', dayNum: 0 })
  }

  for (let i = 1; i <= totalDaysInMonth; i++) {
    const dString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    calendarCells.push({ dateStr: dString, dayNum: i })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-emerald-500/20 relative overflow-hidden group hover:shadow-emerald-950/20 hover:shadow-2xl transition-all duration-300">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Sales Executive Suite</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold">Enterprise Client Acquisitions Hub</h2>
          <p className="text-slate-450 text-sm max-w-xl leading-relaxed">
            Manage your corporate client pipeline, review pitched catalog portfolios, and coordinate closing Zoom meetings seamlessly.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 relative z-10 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl shadow-inner">
            {conversionRate}%
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Lead Conversion Velocity</p>
            <p className="text-sm font-extrabold text-white">{leadsCount} Deals Registered</p>
          </div>
        </div>
      </div>

      {/* Financial KPIs Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Pipeline Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active CRM Leads</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{leadsCount} Accounts</h3>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <span>+12% vs last month</span>
            </p>
          </div>
        </div>

        {/* Closed Won Value Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Closed Won Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-800">${closedWonAmount.toLocaleString()}</h3>
            <p className="text-xs text-teal-600 font-bold flex items-center gap-1 mt-0.5">
              <span>Highly profitable contract margins</span>
            </p>
          </div>
        </div>

        {/* Conversion Velocity Meter */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shadow-sm shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quota Performance</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{conversionRate}% Won</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${conversionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sync Meetings Calendar Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-500" />
                Pitch Meeting Calendar
              </h3>
              <p className="text-xs text-slate-400 font-medium">Coordinate Google Meet & Zoom contract walkthroughs</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-150">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-all hover:shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-700 px-2 min-w-[100px] text-center">
                {monthNames[month]} {year}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-all hover:shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="text-[10px] font-extrabold text-slate-400 uppercase py-1">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, idx) => {
                if (cell.dayNum === 0) {
                  return <div key={`blank-${idx}`} className="aspect-square bg-slate-50/30 rounded-lg border border-dashed border-slate-100/50"></div>
                }

                // Check meetings scheduled on this day
                const dayMeetings = tasks.filter(t => t.dueDate === cell.dateStr)
                const hasMeetings = dayMeetings.length > 0

                return (
                  <div 
                    key={cell.dateStr} 
                    className={`aspect-square p-1 rounded-lg border flex flex-col justify-between transition-all group cursor-pointer relative ${
                      hasMeetings 
                        ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className={`text-xs font-bold ${hasMeetings ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {cell.dayNum}
                    </span>
                    
                    {hasMeetings && (
                      <div className="flex flex-wrap gap-0.5 max-w-full">
                        {dayMeetings.map(m => {
                          const parsedNotes = m.notes ? m.notes.toLowerCase() : ''
                          let dotColor = 'bg-blue-500' // Zoom
                          if (parsedNotes.includes('meet')) dotColor = 'bg-red-500' // Google Meet
                          else if (parsedNotes.includes('phone')) dotColor = 'bg-teal-500' // Phone Sync
                          return (
                            <span 
                              key={m._id} 
                              className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} 
                              title={m.title}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-center pt-2 text-[10px] font-bold text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Zoom Meeting</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Google Meet</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Phone / Sync Call</span>
          </div>
        </div>

        {/* Right Column: Achievements & Hot Prospects */}
        <div className="space-y-8">
          {/* Sales Milestones Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Sales Career Milestones
            </h3>
            <div className="space-y-3.5">
              {[
                { title: 'First Pitch Registered', desc: 'Added first warm prospect in leads ledger', done: true },
                { title: 'Deal Negotiator', desc: 'Moved a client to proposed contract status', done: true },
                { title: 'Enterprise Closer', desc: 'Secure an account exceeding $10,000 quota value', done: false },
                { title: 'Pipeline Creator', desc: 'Track 10 separate leads dynamically inside CRM', done: false },
              ].map((achievement, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    achievement.done 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'border-slate-200 text-slate-350'
                  }`}>
                    {achievement.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 leading-tight">{achievement.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot Prospects Showcase */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                Target Accounts
              </h3>
              <Link href="/sales/leads" className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5">
                Go to CRM <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {[
                { name: 'Apex Retail Corporation', val: '$14,500', stage: 'Proposal Sent', badge: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                { name: 'Acuity Tech Group', val: '$9,200', stage: 'Negotiation', badge: 'bg-amber-50 text-amber-700 border-amber-100' },
                { name: 'Cloudify Systems LLC', val: '$22,000', stage: 'Contacted', badge: 'bg-blue-50 text-blue-700 border-blue-100' },
              ].map((prospect, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-700 truncate">{prospect.name}</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{prospect.val} Contract Offer</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded-md border ${prospect.badge}`}>
                    {prospect.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
