'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  WalletCards, 
  Coins, 
  LaptopMinimal, 
  PhoneForwarded, 
  BadgeDollarSign, 
  LayersPlus, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  ShieldCheck, 
  Brush, 
  Truck,
  Bell,
  PlusCircle,
  ChevronDown,
  User as UserIcon,
  Plus,
  Compass
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userName, setUserName] = useState<string>('User')
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
        setUserRole(userInfo.role ? userInfo.role.toLowerCase() : '')
        setUserName(userInfo.name || 'User')
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

  const isActive = (href: string) => pathname === href

  // Route Title Mapping
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/admin':
        return 'Dashboard'
      case '/admin/customers':
        return 'User Management'
      case '/admin/leads':
        return 'Lead Management'
      case '/admin/salesdepart':
        return 'Sales Department'
      case '/admin/orders':
        return 'Order Management'
      case '/admin/products':
        return 'Product Catalog'
      case '/admin/vendors':
        return 'Vendor Directory'
      case '/admin/creativedepart':
        return 'Creative Department'
      case '/admin/accounts':
        return 'Expense & Accounts'
      case '/admin/stockdepart':
        return 'Inventory & Stock'
      case '/admin/schedules':
        return 'Task Schedules'
      case '/admin/coupons':
        return 'Coupons & Offers'
      case '/admin/delivery-charges':
        return 'Delivery Logistics'
      case '/admin/reports':
        return 'System Reports'
      case '/admin/landing-controls':
        return 'Landing Page Controls'
      case '/admin/settings':
        return 'Account Settings'
      default:
        return 'Overview'
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    window.location.href = '/login'
  }

  // --- Header Component (Reusable across layouts) ---
  const renderTopNavbar = () => {
    return (
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm">
        {/* Left Side: Mobile Menu Button & Dynamic Title */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight transition-all">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right Side: Shortcuts & Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Shortcut 1: Quick Add Product (Admin/Editor only) */}
          {userRole !== 'rider' && (
            <Link
              href="/admin/products"
              className="p-2 text-gray-500 hover:text-[#2db34a] hover:bg-gray-50 rounded-full transition-all hidden sm:block"
              title="Add Product Catalog"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
          )}

          {/* Shortcut 2: Tasks Board */}
          <Link
            href="/admin/schedules"
            className="p-2 text-gray-500 hover:text-[#2db34a] hover:bg-gray-50 rounded-full transition-all hidden sm:block"
            title="Task Schedules"
          >
            <Calendar className="w-5 h-5" />
          </Link>

          {/* Notification bell and dropdown */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 text-gray-500 hover:text-[#2db34a] hover:bg-gray-50 rounded-full transition-all relative ${
                isNotificationsOpen ? 'text-[#2db34a] bg-gray-50' : ''
              }`}
            >
              <Bell className="w-5 h-5" />
              {/* Notification count dot */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-pulse"></span>
            </button>

            {/* Notifications Menu */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-gray-150 shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <span className="font-bold text-xs text-gray-900">Notifications</span>
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">New Alerts</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-800 font-bold">New Lead Registered</p>
                      <p className="text-[10px] text-gray-400">Marketing campaign: 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#2db34a] shrink-0"></div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-800 font-bold">Order #1245 Dispatched</p>
                      <p className="text-[10px] text-gray-400">Delivery pipeline: 1 hour ago</p>
                    </div>
                  </div>
                  <div className="p-3.5 hover:bg-gray-50/50 transition-colors flex gap-3 cursor-pointer">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-800 font-bold">Cloudinary API Connected</p>
                      <p className="text-[10px] text-gray-400">System core: 3 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50/30 text-center">
                  <Link href="/admin/schedules" onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-[#2db34a] hover:underline">
                    View System Task Log
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
              <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center font-bold text-xs text-[#2db34a] overflow-hidden shadow-sm">
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
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-bold text-sm text-[#2db34a] overflow-hidden">
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
                    <span className="inline-block bg-purple-50 text-purple-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1">
                      {userRole}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-1 space-y-0.5">
                  <Link 
                    href="/admin/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>My Profile & Settings</span>
                  </Link>
                  <Link 
                    href="/admin/schedules" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Active Tasks Board</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
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
    )
  }

  // Rider Dashboard Layout
  if (userRole === 'rider') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Rider Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-35 transition-transform duration-300 ease-in-out hidden md:flex">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-[#2db34a]">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              Rider Portal
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 bg-green-50/30">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Logged In As</p>
            <p className="text-sm font-bold text-gray-800 mt-1 truncate">{userName}</p>
            <p className="text-[10px] text-green-600 font-bold mt-0.5">Delivery Agent</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
              { href: '/admin/orders', label: 'My Orders', icon: ShoppingBag },
              { href: '/admin/settings', label: 'Profile Settings', icon: Settings },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive(item.href) ? 'bg-green-50 text-[#2db34a] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content wrapper */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0 pb-16 md:pb-0">
          {/* Rider Mobile Header */}
          <header className="h-16 bg-[#2db34a] text-white sticky top-0 z-40 flex items-center justify-between px-4 md:hidden shadow-sm">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Truck className="w-5 h-5 text-white" />
              <span>Rider Portal</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </header>

          {/* Top Header for Rider on Desktop */}
          {renderTopNavbar()}

          {/* Page Content */}
          <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>

        {/* Rider Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-150 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 flex items-center justify-around px-2 md:hidden">
          {[
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/orders', label: 'My Orders', icon: ShoppingBag },
            { href: '/admin/settings', label: 'Profile', icon: Settings },
          ].map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold transition-all ${
                  active ? 'text-[#2db34a]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 ${active ? 'scale-110 text-[#2db34a]' : ''}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // Standard Admin Layout
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
        className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-45 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-[#2db34a] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">S6</span>
            </div>
            Admin Panel
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/customers" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/customers') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Users className="w-5 h-5" />
            User Management
          </Link>
          <Link href="/admin/leads" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/leads') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <ShieldCheck className="w-5 h-5" />
            Lead Management
          </Link>
          <Link href="/admin/salesdepart" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/salesdepart') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <PhoneForwarded className="w-5 h-5" />
            Sales Department
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/orders') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <ShoppingBag className="w-5 h-5" />
            Order Management
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/products') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Package className="w-5 h-5" />
            Product
          </Link>
          <Link href="/admin/vendors" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/vendors') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Users className="w-5 h-5" />
            Vendor
          </Link>
          <Link href="/admin/creativedepart" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/creativedepart') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Brush className="w-5 h-5" />
            Creative Department
          </Link>

          <Link href="/admin/accounts" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/accounts') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <WalletCards className="w-5 h-5" />
            Expense / Accounts
          </Link>
          <Link href="/admin/stockdepart" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/stockdepart') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <LayersPlus className="w-5 h-5" />
            Inventory
          </Link>
          <Link href="/admin/schedules" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/schedules') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Calendar className="w-5 h-5" />
            Task Management
          </Link>
          <Link href="/admin/coupons" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/coupons') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <BadgeDollarSign className="w-5 h-5" />
            Coupons and Offers
          </Link>
          <Link href="/admin/delivery-charges" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/delivery-charges') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Coins className="w-5 h-5" />
            Delivery Charges
          </Link>
          <Link href="/admin/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/reports') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard className="w-5 h-5" />
            Reports
          </Link>
          <Link href="/admin/landing-controls" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/landing-controls') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Settings className="w-5 h-5" />
            Landing Page Controls
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/settings') ? 'bg-green-50 text-[#2db34a]' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Dynamic Top Navbar */}
        {renderTopNavbar()}

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
