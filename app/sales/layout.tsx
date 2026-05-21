'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  User as UserIcon, 
  Sparkles,
  TrendingUp,
  DollarSign,
  Briefcase,
  Target,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string>('Sales Representative')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<string>('')
  
  // Dropdown States
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)
  const notifyRef = useRef<HTMLDivElement>(null)

  // Fetch or update user settings
  const loadUserInfo = async () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        setUserName(userInfo.name || 'Sales Rep')
        setUserEmail(userInfo.email || '')
        
        // Fetch real-time avatar from database
        if (userInfo.token) {
          const res = await fetch('http://localhost:1000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          })
          if (res.ok) {
            const data = await res.json()
            if (data.avatar) {
              setUserAvatar(data.avatar)
            } else {
              setUserAvatar('')
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse userInfo from localStorage', e)
    }
  }

  useEffect(() => {
    loadUserInfo()

    // Listen for storage events (e.g. when Name or Avatar is updated in settings)
    window.addEventListener('storage', loadUserInfo)
    return () => {
      window.removeEventListener('storage', loadUserInfo)
    }
  }, [])

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const isActive = (href: string) => {
    if (href === '/sales') {
      return pathname === '/sales';
    }
    return pathname.startsWith(href);
  }

  // Route Title Mapping
  const getPageTitle = (path: string) => {
    if (path === '/sales') return 'Sales Workspace Hub'
    if (path.startsWith('/sales/leads')) return 'CRM Lead Pipeline'
    if (path.startsWith('/sales/products')) return 'Pitch Deck & Catalogue'
    if (path.startsWith('/sales/schedules')) return 'Meeting Planner & Syncs'
    if (path.startsWith('/sales/settings')) return 'Agent Account Settings'
    return 'Sales Suite Overview'
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-35 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 text-slate-800 flex flex-col fixed h-full z-45 transition-all duration-300 ease-in-out md:translate-x-0 shadow-lg shadow-slate-100/50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white/40">
          <Link href="/sales" className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200/50">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-900 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">Sales Hub</span>
          </Link>
          <button
            className="md:hidden text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Panel */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-sm text-emerald-600 overflow-hidden shrink-0 shadow-sm">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-800 truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{userEmail || 'N/A'}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/50 text-emerald-600 text-[8px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                Account Executive
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { href: '/sales', label: 'Workspace Hub', icon: LayoutDashboard },
            { href: '/sales/leads', label: 'CRM Leads', icon: Target },
            { href: '/sales/products', label: 'Pitch Catalog', icon: ShoppingBag },
            { href: '/sales/schedules', label: 'Meeting Planner', icon: Calendar },
            { href: '/sales/settings', label: 'Agent Settings', icon: Settings },
          ].map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02] transform' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 hover:translate-x-1'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout at Bottom */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-550 hover:text-red-700 hover:bg-red-50/50 rounded-xl font-bold transition-all text-sm text-left border border-transparent hover:border-red-150/45"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout Hub
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Dynamic Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm">
          {/* Mobile Menu Button & Dynamic Title */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight transition-all">
              {getPageTitle(pathname)}
            </h1>
          </div>

          {/* Right Side: Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification bell and dropdown */}
            <div className="relative" ref={notifyRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative ${
                  isNotificationsOpen ? 'text-emerald-600 bg-emerald-50' : ''
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-pulse"></span>
              </button>

              {/* Notifications Menu */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-gray-150 shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="font-bold text-xs text-gray-900">Notifications</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">CRM Alerts</span>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-800 font-bold">New High-Value Lead Assigned</p>
                        <p className="text-[10px] text-gray-400">Enterprise Pitch Deck Request • 5 mins ago</p>
                      </div>
                    </div>
                    <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-800 font-bold">Sync Meeting Scheduled</p>
                        <p className="text-[10px] text-gray-400">Zoom Call with Acuity Group • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-800 font-bold">Revenue Target 85% Achieved</p>
                        <p className="text-[10px] text-gray-400">Sales Dashboard Sync • 4 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50/30 text-center">
                    <Link href="/sales/leads" onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-emerald-600 hover:underline">
                      View CRM Pipeline
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="h-6 w-px bg-gray-200"></span>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-xs text-emerald-600 overflow-hidden shadow-sm">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl border border-gray-150 shadow-xl py-2.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Header User info */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-sm text-emerald-600 overflow-hidden">
                      {userAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        userName.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{userName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{userEmail || 'N/A'}</p>
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1">
                        Sales Representative
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-1 space-y-0.5">
                    <Link 
                      href="/sales/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>My Profile & Settings</span>
                    </Link>
                    <Link 
                      href="/sales/leads" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>CRM Dashboard</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
