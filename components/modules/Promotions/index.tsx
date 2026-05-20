import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

import ReviewCard from './ReviewCard'

export default async function Promotions() {
  let reviews = [];
  try {
    const res = await fetch('http://localhost:1000/api/reviews', { next: { revalidate: 0 } });
    if (res.ok) {
      reviews = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch reviews', err);
  }

  if (reviews.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No customer reviews available yet.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {reviews.map((review: any, i: number) => (
            <ScrollAnimation key={review._id || i} delay={i * 0.15}>
              <ReviewCard review={review} />
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
