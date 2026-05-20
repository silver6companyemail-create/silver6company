import Image from 'next/image'
import heroImg from '@/app/assets/warmoil4.png'
import ScrollAnimation from '@/components/common/ScrollAnimation'

export default async function HeroSection() {
  let hero = {
    badge: '🛍️ Silver6 online store',
    title: 'One And Only Solution\nOf Your Joints And Body Pain',
    description: 'Shoppings is a bit of a relaxing hobby for me, which is sometimes troubling for the bank balance.',
    button1Text: 'Learn More', button1Link: '/products',
    button2Text: 'View Deals', button2Link: '/deals',
    stat1Value: '10+', stat1Label: 'Products',
    stat2Value: '50000+', stat2Label: 'Customers',
    stat3Value: '24h', stat3Label: 'Delivery',
    image: ''
  };

  try {
    const res = await fetch('http://localhost:1000/api/hero', { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (data) hero = { ...hero, ...data };
    }
  } catch (error) {
    console.error('Failed to fetch hero section data:', error);
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #c8dde8 0%, #b5cfd9 45%, #c4aa84 100%)',
        minHeight: '480px',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16 w-full">

          {/* Left: Text Content */}
          <ScrollAnimation delay={0.1} className="flex flex-col gap-6 z-10">
            <span className="inline-block w-fit px-3 py-1 rounded-full bg-white/30 text-[#1e4d2b] text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              {hero.badge}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-[#1a3d25] leading-tight whitespace-pre-line">
              {hero.title}
            </h1>

            <p className="text-[#2d5a3d] text-base leading-relaxed max-w-sm">
              {hero.description}
            </p>

            <div className="flex items-center gap-4">
              <a
                href={hero.button1Link}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#1e4d2b] text-white text-sm font-semibold rounded-full hover:bg-[#163820] active:scale-95 transition-all duration-200 shadow-lg shadow-green-900/20"
              >
                {hero.button1Text}
              </a>
              <a
                href={hero.button2Link}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/40 backdrop-blur-sm text-[#1e4d2b] text-sm font-semibold rounded-full hover:bg-white/60 transition-all duration-200 border border-white/60"
              >
                {hero.button2Text}
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { value: hero.stat1Value, label: hero.stat1Label },
                { value: hero.stat2Value, label: hero.stat2Label },
                { value: hero.stat3Value, label: hero.stat3Label },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-xl font-bold text-[#1a3d25]">{stat.value}</p>
                  <p className="text-xs text-[#2d5a3d]">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          {/* Right: Hero Product Image */}
          <ScrollAnimation delay={0.3} y={50} className="relative flex items-end justify-center md:justify-end h-80 md:h-[420px]">
            <Image
              src={hero.image || heroImg}
              alt="Hero Image"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              priority
              unoptimized={!!hero.image}
            />
          </ScrollAnimation>
        </div>
      </div>
      {/* Decorative blob */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2db34a 0%, transparent 70%)' }}
      />
    </section>
  )
}
