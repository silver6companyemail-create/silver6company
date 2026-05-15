import ProductCard, { Product } from '@/components/common/ProductCard'

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

export default function WeeklyPopular() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Weekly Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {weeklyPopular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
