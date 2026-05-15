import ProductCard, { Product } from '@/components/common/ProductCard'

const bestDeals: Product[] = [
  {
    id: '1',
    name: 'HomePod mini',
    description: 'Table with air purifier, stained veneer/black',
    price: 239.00,
    rating: 5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/ff6b6b?text=HomePod'
  },
  {
    id: '2',
    name: 'Instax Mini 9',
    description: 'Selfie mode and selfie mirror, Macro mode',
    price: 99.00,
    rating: 4.5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/4d94ff?text=Camera'
  },
  {
    id: '3',
    name: 'Base Camp Duffel M',
    description: 'Table with air purifier, stained veneer/black',
    price: 159.00,
    rating: 4.5,
    reviewCount: 121,
    image: 'https://placehold.co/400x400/transparent/ffcc00?text=Bag'
  }
]

export default function BestDeals() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Todays Best Deals For You!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bestDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
