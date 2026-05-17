'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { LayoutGrid, ChevronDown, User, ShoppingCart, Menu, X } from 'lucide-react'
import Logo from '@/components/common/Logo'
import SearchBar from './SearchBar'
import CategoryMenu from './CategoryMenu'
import { navLinks } from '@/data/navigation'


export default function Navbar() {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeCategoryMenu = useCallback(() => setCategoryOpen(false), [])

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <Logo className="flex-shrink-0" />

        {/* Category Button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setCategoryOpen((o) => !o)}
            className="flex items-center gap-2 h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Category</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
          </button>
          {categoryOpen && <CategoryMenu onClose={closeCategoryMenu} />}
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* Account */}
        <Link href="/login" className="hidden md:flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-all duration-150">
          <User className="w-4 h-4" />
          Login
        </Link>

        {/* Cart */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-[#2db34a] text-white text-[10px] font-bold rounded-full">
            0
          </span>
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
          <SearchBar />
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
