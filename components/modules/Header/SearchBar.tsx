'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <div className="relative flex items-center w-full max-w-xs">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-9 bg-gray-100 border border-transparent rounded-full text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#2db34a] focus:bg-white transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
