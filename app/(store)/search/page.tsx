'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) { setLoading(false); return }
    setLoading(true)
    fetch('http://localhost:1000/api/products')
      .then(r => r.json())
      .then(data => {
        const results = data.filter((p: any) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
        )
        setProducts(results)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        {q && <p className="text-gray-500 mt-1">Showing results for <span className="font-semibold text-gray-900">"{q}"</span></p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-400">Try searching with different keywords</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2.5 bg-[#2db34a] text-white rounded-full font-medium hover:bg-[#259b3f] transition-colors">Back to Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`} className="flex flex-col group">
              <div className="relative bg-[#f5f6f8] rounded-2xl aspect-square mb-3 overflow-hidden flex items-center justify-center p-5">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" unoptimized />
                ) : (
                  <Package className="w-12 h-12 text-gray-300" />
                )}
                {product.category && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/80 backdrop-blur-sm text-xs font-bold text-gray-700 rounded-lg">{product.category}</span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#2db34a] transition-colors">{product.name}</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">{product.description}</p>
              <p className="font-bold text-gray-900 mt-2">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2db34a] border-t-transparent rounded-full"></div></div>}>
      <SearchResults />
    </Suspense>
  )
}
