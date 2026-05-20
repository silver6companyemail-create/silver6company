import ProductDetailsClient from './ProductDetailsClient'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const res = await fetch(`http://localhost:1000/api/products/${resolvedParams.id}`, { next: { revalidate: 0 } });
    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error('Failed to fetch product');
    }
    const product = await res.json();
    return <ProductDetailsClient initialProduct={product} />
  } catch (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-500">We couldn't load the product details right now.</p>
      </div>
    )
  }
}
