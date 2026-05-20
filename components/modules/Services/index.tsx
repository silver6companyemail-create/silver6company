import Image from 'next/image'
import ScrollAnimation from '@/components/common/ScrollAnimation'

export default async function Services() {
  let services = [];
  try {
    const res = await fetch('http://localhost:1000/api/services', { next: { revalidate: 0 } });
    if (res.ok) {
      services = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch services', err);
  }

  if (services.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Services To Help You Shop</h2>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No services configured.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Services To Help You Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc: any, i: number) => (
            <ScrollAnimation key={svc._id || i} delay={i * 0.2}>
              <div className="flex flex-col h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: svc.bgColor || '#f5f6f8' }}>
                <div className="p-8 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 whitespace-pre-line leading-tight">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                    {svc.description}
                  </p>
                </div>
                <div 
                  className="relative w-full h-[220px] mt-auto transform group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundColor: svc.imageBgColor || '#eeb8cd' }}
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
