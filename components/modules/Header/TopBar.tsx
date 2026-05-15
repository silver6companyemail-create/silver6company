'use client'

import { useState } from 'react'
import { Phone, ChevronDown, MapPin } from 'lucide-react'

const languages = ['Eng', 'বাং', 'عر', 'اردو']
const locations = ['USA', 'India', 'Dhaka', 'UK']

export default function TopBar() {
  const [lang, setLang] = useState('Eng')
  const [loc, setLoc] = useState('Location')
  const [langOpen, setLangOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)

  return (
    <div className="w-full bg-[#1e4d2b]">
      <div className="max-w-[1280px] mx-auto px-6 h-9 flex items-center justify-between">

        {/* Left: Phone */}
        <a href="tel:+001234567880" className="flex items-center gap-1.5 text-xs text-green-200 hover:text-white transition-colors">
          <Phone className="w-3 h-3" />
          <span>+9779820151085</span>
        </a>

        {/* Center: Promo */}
        <p className="hidden md:block text-xs text-green-100 font-medium">
          Silver 6 कम्पनीका सामानमा गुणस्तर&nbsp;
          <span className="text-white">|</span>&nbsp;
          <a href="/deals" className="text-white font-semibold hover:underline">Shop Now</a>
        </p>

        {/* Right: Lang + Location */}
        <div className="flex items-center gap-3">
          {/* Language */}
          <div className="relative">
            <button onClick={() => { setLangOpen(o => !o); setLocOpen(false) }}
              className="flex items-center gap-1 text-xs text-green-200 hover:text-white transition-colors">
              <span>{lang}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 w-24 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                {languages.map(l => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-50 ${lang === l ? 'text-[#2db34a] font-semibold' : 'text-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-green-700">|</span>

          {/* Location */}
          <div className="relative">
            <button onClick={() => { setLocOpen(o => !o); setLangOpen(false) }}
              className="flex items-center gap-1 text-xs text-green-200 hover:text-white transition-colors">
              <MapPin className="w-3 h-3" />
              <span>{loc}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${locOpen ? 'rotate-180' : ''}`} />
            </button>
            {locOpen && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                {locations.map(l => (
                  <button key={l} onClick={() => { setLoc(l); setLocOpen(false) }}
                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-50 ${loc === l ? 'text-[#2db34a] font-semibold' : 'text-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

