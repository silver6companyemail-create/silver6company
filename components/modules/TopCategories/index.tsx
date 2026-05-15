import Link from 'next/link'
import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

const categories = [
  { id: 'oil', name: 'Oil', bgColor: '#79b29c' },
  { id: 'serum', name: 'Serum', bgColor: '#f2ad5b' },
  { id: 'kit', name: 'Kit', bgColor: '#aa4238' },
  { id: 'tea', name: 'Tea', bgColor: '#4cb771' },
  { id: 'shampoo', name: 'Shampoo', bgColor: '#f0a2ad' },
  { id: 'travel', name: 'Travel', bgColor: '#eeb85b' },
]

export default function TopCategories() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop Our Top Categories</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <ScrollAnimation key={cat.id} delay={i * 0.1}>
              <Link
                href={`/category/${cat.id}`}
              className="relative flex flex-col items-center justify-between h-[260px] rounded-2xl overflow-hidden group transition-transform hover:-translate-y-1"
              style={{ backgroundColor: cat.bgColor }}
            >
              <div className="w-full text-center pt-6 z-10">
                <span className="text-lg font-bold text-white drop-shadow-sm">
                  {cat.name}
                </span>
              </div>

              <div className="relative w-full h-40 mt-auto flex items-end justify-center">
                {/* Placeholder for the lifestyle product image */}
                <Image
                  src={`https://placehold.co/400x400/transparent/ffffff?text=${cat.name}`}
                  alt={cat.name}
                  fill
                  className="object-contain object-bottom p-4 opacity-80 group-hover:opacity-100 transition-opacity"
                  unoptimized
                />
              </div>
            </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

