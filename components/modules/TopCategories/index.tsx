import Link from 'next/link'
import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

export default async function TopCategories() {
  let categories = []
  
  try {
    const res = await fetch('http://localhost:1000/api/categories', { next: { revalidate: 0 } })
    if (res.ok) {
      categories = await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }

  // Fallback to defaults if backend is empty or fails
  if (!categories || categories.length === 0) {
    categories = [
      { _id: '1', slug: 'oil', name: 'Oil', bgColor: '#79b29c' },
      { _id: '2', slug: 'serum', name: 'Serum', bgColor: '#f2ad5b' },
      { _id: '3', slug: 'kit', name: 'Kit', bgColor: '#aa4238' },
      { _id: '4', slug: 'tea', name: 'Tea', bgColor: '#4cb771' },
      { _id: '5', slug: 'shampoo', name: 'Shampoo', bgColor: '#f0a2ad' },
      { _id: '6', slug: 'travel', name: 'Travel', bgColor: '#eeb85b' },
    ]
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop Our Top Categories</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: any, i: number) => (
            <ScrollAnimation key={cat._id} delay={i * 0.1}>
              <Link
                href={`/category/${cat.slug}`}
              className="relative flex flex-col items-center justify-center h-[260px] rounded-2xl overflow-hidden group transition-transform hover:-translate-y-1 shadow-sm"
              style={{ backgroundColor: cat.bgColor }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={`https://placehold.co/400x400/transparent/ffffff?text=${cat.name}`}
                    alt={cat.name}
                    fill
                    className="object-contain p-8 opacity-20"
                    unoptimized
                  />
                )}
              </div>

              <div className="relative z-10 text-center px-4">
                <span className="text-2xl font-bold text-white drop-shadow-md tracking-wide">
                  {cat.name}
                </span>
              </div>
            </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
