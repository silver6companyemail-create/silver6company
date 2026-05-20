import ProductCard, { Product } from '@/components/common/ProductCard'
import ScrollAnimation from '@/components/common/ScrollAnimation'

const weeklyPopular: Product[] = [
  {
    id: '4',
    name: 'Gaming Headset',
    description: 'Table with air purifier, stained veneer/black',
    price: 129.00,
    rating: 5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/4ade80?text=Headset'
  },
  {
    id: '5',
    name: 'Travel Duffle Bag',
    description: 'Selfie mode and selfie mirror, Macro mode',
    price: 149.00,
    rating: 4.5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/facc15?text=Duffle'
  },
  {
    id: '6',
    name: 'Smart Watch',
    description: 'Table with air purifier, stained veneer/black',
    price: 299.00,
    rating: 4.5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/f43f5e?text=Watch'
  }
]

export default async function WeeklyPopular() {
  let products = [];
  try {
    const res = await fetch('http://localhost:1000/api/products/weekly', { next: { revalidate: 0 } });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch weekly products', err);
  }

  if (products.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Weekly Popular Products</h2>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No products have been marked as weekly popular yet.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Weekly Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product: any, i: number) => (
            <ScrollAnimation key={product._id || product.id} delay={i * 0.15}>
              <ProductCard product={product} />
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
