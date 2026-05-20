import Link from 'next/link'
import Image from 'next/image'
import { Package, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function WhatsNewPage() {
  let products: any[] = []
  try {
    const res = await fetch('http://localhost:1000/api/products', { next: { revalidate: 60 } })
    if (res.ok) products = await res.json()
  } catch {}

  // Latest 20 products by createdAt descending (already sorted from API)
  const newProducts = products.slice(0, 20)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Fresh Arrivals</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">What's New</h1>
          <p className="text-purple-100 text-lg">Discover the latest products added to our store</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {newProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No products added yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Latest Arrivals <span className="text-gray-400 font-normal text-base">({newProducts.length})</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newProducts.map((product, i) => (
                <Link key={product._id} href={`/product/${product._id}`} className="flex flex-col group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="relative bg-[#f5f6f8] aspect-square flex items-center justify-center p-5 overflow-hidden">
                    {i < 4 && (
                      <span className="absolute top-3 left-3 z-10 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-lg">NEW</span>
                    )}
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" unoptimized />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-purple-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{product.description}</p>
                    <p className="font-bold text-gray-900 mt-2">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
