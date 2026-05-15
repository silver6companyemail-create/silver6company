import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

const promos = [
  {
    save: '$100',
    color: '#d4a373',
    bgColor: '#f3e8dc',
    image: 'https://placehold.co/300x300/transparent/d4a373?text=Furniture'
  },
  {
    save: '$29',
    color: '#bc4749',
    bgColor: '#f9e1e1',
    image: 'https://placehold.co/300x300/transparent/bc4749?text=Books'
  },
  {
    save: '$67',
    color: '#a68a64',
    bgColor: '#efe6dd',
    image: 'https://placehold.co/300x300/transparent/a68a64?text=Shirts'
  },
  {
    save: '$59',
    color: '#386641',
    bgColor: '#d8f3dc',
    image: 'https://placehold.co/300x300/transparent/386641?text=Backpack'
  }
]

export default function Promotions() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Up To 70% Off</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {promos.map((promo, i) => (
            <ScrollAnimation key={i} delay={i * 0.15}>
              <div className="flex flex-col h-full rounded-2xl overflow-hidden group cursor-pointer" style={{ backgroundColor: promo.bgColor }}>
                <div className="p-6 pb-2">
                  <span className="text-sm font-bold text-gray-900 block mb-1">Save</span>
                  <span className="text-4xl font-black block mb-4" style={{ color: promo.color }}>
                    {promo.save}
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed max-w-[160px]">
                    Explore Our Furniture & Home Furnishing Range
                  </p>
                </div>
                <div className="relative w-full h-48 mt-auto transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={promo.image}
                    alt={`Save ${promo.save}`}
                    fill
                    className="object-cover object-bottom"
                    unoptimized
                  />
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
