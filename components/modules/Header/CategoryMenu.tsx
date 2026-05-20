'use client'

import { useRef, useEffect, useState } from 'react'
import {
  Armchair, ShoppingBag, Footprints,
  Headphones, Laptop, BookOpen, LucideIcon,
} from 'lucide-react'
import { popularCategories } from '@/data/navigation'
import type { Category } from '@/types/common'

const iconMap: Record<string, LucideIcon> =
{
  Armchair,
  ShoppingBag,
  Footprints,
  Headphones,
  Laptop,
  BookOpen,
}

interface Props {
  onClose: () => void
}

function CategoryItem({ category }: { category: any }) {
  const Icon = ShoppingBag // We can fallback to ShoppingBag for dynamic ones if icon mapping is not in DB
  return (
    <a
      href={`/category/${category._id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        style={{ backgroundColor: category.bgColor || '#eef2ff' }}
      >
        <Icon className="w-5 h-5" style={{ color: '#6366f1' }} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2db34a] transition-colors">
          {category.name}
        </p>
        <p className="text-xs text-gray-400">View Category</p>
      </div>
    </a>
  )
}

export default function CategoryMenu({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  useEffect(() => {
    fetch('http://localhost:1000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Popular Categories
        </p>
      </div>
      <div className="px-2 pb-2 max-h-[400px] overflow-y-auto">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <CategoryItem key={cat._id} category={cat} />
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No categories available.
          </div>
        )}
      </div>
    </div>
  )
}
