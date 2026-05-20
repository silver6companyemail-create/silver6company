import ProductCard, { Product } from '@/components/common/ProductCard'
import ScrollAnimation from '@/components/common/ScrollAnimation'

// const bestDeals: Product[] = [
//   {
//     id: '1',
//     name: 'Table with air purifier, stained veneer/black',
//     description: 'Table with air purifier, stained veneer/black',
//     price: 239.00,
//     rating: 5,
//     reviewCount: 121,
//     image: 'https://placehold.co/400x400/transparent/ff6b6b?text=HomePod'
//   },
//   {
//     id: '2',
//     name: 'Instax Mini 9',
//     description: 'Selfie mode and selfie mirror, Macro mode',
//     price: 99.00,
//     rating: 4.5,
//     reviewCount: 121,
//     image: 'https://placehold.co/400x400/transparent/4d94ff?text=Camera'
//   },
//   {
//     id: '3',
//     name: 'Base Camp Duffel M',
//     description: 'Table with air purifier, stained veneer/black',
//     price: 159.00,
//     rating: 4.5,
//     reviewCount: 121,
//     image: 'https://placehold.co/400x400/transparent/ffcc00?text=Bag'
//   }
// ]

export default async function BestDeals() {
  let products = [];
  try {
    const res = await fetch('http://localhost:1000/api/products', { next: { revalidate: 0 } });
    if (res.ok) {
      const allProducts = await res.json();
      products = allProducts.filter((p: any) => !p.isWeeklyPopular);
    }
  } catch (err) {
    console.error('Failed to fetch best deals products', err);
  }

  if (products.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Products</h2>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No products available in this section.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Products</h2>
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
