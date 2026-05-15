import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

const services = [
  {
    title: 'Frequently Asked\nQuestions',
    desc: 'Updates on safe Shopping in\nour Stores',
    bgColor: '#f5f6f8',
    imageBgColor: '#eeb8cd',
    image: 'https://placehold.co/400x300/transparent/aa4238?text=Family'
  },
  {
    title: 'Online Payment\nProcess',
    desc: 'Updates on safe Shopping in\nour Stores',
    bgColor: '#f5f6f8',
    imageBgColor: '#8edbb2',
    image: 'https://placehold.co/400x300/transparent/386641?text=Phone+Payment'
  },
  {
    title: 'Home Delivery\nOptions',
    desc: 'Updates on safe Shopping in\nour Stores',
    bgColor: '#f5f6f8',
    imageBgColor: '#eed88d',
    image: 'https://placehold.co/400x300/transparent/d4a373?text=Delivery+Guy'
  }
]

export default function Services() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Services To Help You Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <ScrollAnimation key={i} delay={i * 0.2}>
              <div className="flex flex-col h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-[#f5f6f8]">
                <div className="p-8 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 whitespace-pre-line leading-tight">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div 
                  className="relative w-full h-[220px] mt-auto transform group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundColor: svc.imageBgColor }}
                >
                  <Image
                    src={svc.image}
                    alt={svc.title.replace('\n', ' ')}
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
