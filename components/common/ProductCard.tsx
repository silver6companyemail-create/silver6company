import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  reviewCount: number
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col group">
      {/* Image Area */}
      <div className="relative bg-[#f5f6f8] rounded-2xl aspect-square mb-4 overflow-hidden flex items-center justify-center p-6">
        <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all z-10">
          <Heart className="w-4 h-4" />
        </button>
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Details Area */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-gray-900 truncate pr-2">{product.name}</h3>
        <span className="font-bold text-gray-900 whitespace-nowrap">{formatPrice(product.price)}</span>
      </div>
      <p className="text-xs text-gray-500 mb-2 truncate">{product.description}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        <div className="flex text-[#2db34a]">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
      </div>

      {/* Add to Cart Button */}
      <button className="w-max px-5 py-2 border-2 border-gray-900 text-gray-900 rounded-full text-xs font-bold hover:bg-gray-900 hover:text-white transition-colors">
        Add to Cart
      </button>
    </div>
  )
}
