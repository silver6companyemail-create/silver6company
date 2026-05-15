const brands = [
  { name: 'Staples',         logoColor: '#d32f2f' },
  { name: 'Sprouts',         logoColor: '#388e3c' },
  { name: 'Grocery outlet',  logoColor: '#c2185b' },
  { name: 'Mollie stones',   logoColor: '#000000' },
  { name: 'Sports Basement', logoColor: '#4caf50' },
  { name: 'Container Store', logoColor: '#1976d2' },
  { name: 'Target',          logoColor: '#d32f2f' },
  { name: 'Bevmo!',          logoColor: '#d32f2f' },
]

export default function ChooseByBrand() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose By Brand</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#f5f6f8] p-4 rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xs font-bold text-center leading-tight shadow-sm"
                style={{ backgroundColor: brand.logoColor }}
              >
                {/* Simulated Logo */}
                {brand.name.split(' ')[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{brand.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Delivery with in 24 hours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
