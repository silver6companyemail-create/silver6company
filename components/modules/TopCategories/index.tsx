import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { id: 'furniture', name: 'Furniture', bgColor: '#79b29c' },
  { id: 'handbag',   name: 'Hand Bag',  bgColor: '#f2ad5b' },
  { id: 'books',     name: 'Books',     bgColor: '#aa4238' },
  { id: 'tech',      name: 'Tech',      bgColor: '#4cb771' },
  { id: 'sneakers',  name: 'Sneakers',  bgColor: '#f0a2ad' },
  { id: 'travel',    name: 'Travel',    bgColor: '#eeb85b' },
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
          {categories.map((cat) => (
            <Link
              key={cat.id}
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
          ))}
        </div>
      </div>
    </section>
  )
}

