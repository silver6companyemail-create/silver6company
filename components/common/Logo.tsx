import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 select-none', className)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2db34a]">
        <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold text-gray-900 tracking-tight">Silver 6</span>
    </Link>
  )
}
