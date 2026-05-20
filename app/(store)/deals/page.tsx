import Link from 'next/link'
import Image from 'next/image'
import { Package, Tag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function DealsPage() {
  let products: any[] = []
  try {
    const res = await fetch('http://localhost:1000/api/products/deals', { next: { revalidate: 0 } })
    if (res.ok) products = await res.json()
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2db34a] to-[#1a7a32] text-white py-16 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Today's Deals</h1>
          <p className="text-green-100 text-lg">Save big on top products — updated daily!</p>
          {products.length > 0 && (
            <div className="mt-4 inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">
              {products.length} active deal{products.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No deals available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const discount = product.discountPercent || 10
              const originalPrice = product.price / (1 - discount / 100)
              return (
                <Link key={product._id} href={`/product/${product._id}`} className="flex flex-col group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="relative bg-[#f5f6f8] aspect-square flex items-center justify-center p-5 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" unoptimized />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#2db34a] transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(Number(originalPrice.toFixed(2)))}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

