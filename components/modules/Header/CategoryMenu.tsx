'use client'

import { useRef, useEffect } from 'react'
import {
  Armchair, ShoppingBag, Footprints,
  Headphones, Laptop, BookOpen, LucideIcon,
} from 'lucide-react'
import { popularCategories } from '@/data/navigation'
import type { Category } from '@/types/common'

const iconMap: Record<string, LucideIcon> = {
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

function CategoryItem({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? ShoppingBag
  return (
    <a
      href={`/category/${category.id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        style={{ backgroundColor: category.bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color: category.iconColor }} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2db34a] transition-colors">
          {category.name}
        </p>
        <p className="text-xs text-gray-400">{category.itemCount} Items Available</p>
      </div>
    </a>
  )
}

export default function CategoryMenu({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Popular Categories
        </p>
      </div>
      <div className="px-2 pb-2">
        {popularCategories.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
