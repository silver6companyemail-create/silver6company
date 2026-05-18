'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, WalletCards, Coins, LaptopMinimal, PhoneForwarded, BadgeDollarSign, LayersPlus, ShoppingBag, Settings, LogOut, Package, Menu, X, ShieldCheck, Brush } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">AD</span>
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
