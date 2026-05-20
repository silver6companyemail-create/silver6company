import Image from 'next/image'
import Link from 'next/link'

export default async function ChooseByBrand() {
  let categories: any[] = []
  try {
    const res = await fetch('http://localhost:1000/api/categories', { next: { revalidate: 0 } })
    if (res.ok) categories = await res.json()
  } catch (err) {
    console.error('Failed to fetch categories', err)
  }

  if (categories.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose By Categories</h2>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No categories available yet.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose By Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat._id}
              href={`/category/${cat._id}`}
              className="flex items-center gap-4 bg-[#f5f6f8] p-4 rounded-2xl hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div
                className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: cat.bgColor || '#79b29c' }}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-full"
                    unoptimized
                  />
                ) : (
                  <span>{cat.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2db34a] transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Shop Now</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
