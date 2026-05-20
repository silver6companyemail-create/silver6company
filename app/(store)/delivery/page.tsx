import { Truck, Clock, MapPin, Phone, PackageCheck, RefreshCw, ShieldCheck, ChevronRight } from 'lucide-react'

export default async function DeliveryPage() {
  let info: any = null
  try {
    const res = await fetch('http://localhost:1000/api/delivery-info', { next: { revalidate: 0 } })
    if (res.ok) info = await res.json()
  } catch {}

  const zones = info?.zones || []
  const faqs = info?.faqs || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Truck className="w-4 h-4" />
            <span className="text-sm font-semibold">Fast &amp; Reliable</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{info?.heroTitle || 'Delivery Information'}</h1>
          <p className="text-blue-100 text-lg">{info?.heroSubtitle || 'We deliver across Nepal — quickly and safely.'}</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-16 space-y-16">
        {/* Key highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: info?.highlight1Title || '24-Hour Delivery', desc: info?.highlight1Desc || 'Inside Kathmandu Valley on business days', color: 'text-blue-500 bg-blue-50' },
            { icon: PackageCheck, title: info?.highlight2Title || 'Secure Packaging', desc: info?.highlight2Desc || 'Every order is carefully packed to avoid damage', color: 'text-green-500 bg-green-50' },
            { icon: RefreshCw, title: info?.highlight3Title || '7-Day Returns', desc: info?.highlight3Desc || 'Hassle-free return policy on unused products', color: 'text-purple-500 bg-purple-50' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Zones */}
        {zones.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#2db34a]" /> Delivery Zones
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Zone</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Estimated Time</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Delivery Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {zones.map((zone: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">{zone.zone}</td>
                      <td className="p-4 text-[#2db34a] font-semibold">{zone.time}</td>
                      <td className="p-4 text-gray-600">{zone.charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {info?.freeDeliveryNote && (
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {info.freeDeliveryNote}
              </p>
            )}
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <details key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-semibold text-gray-900 list-none">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="bg-gradient-to-r from-[#2db34a] to-[#1a7a32] text-white rounded-2xl p-8 text-center">
          <Phone className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Need Help with Your Order?</h3>
          <p className="text-green-100 mb-6">{info?.contactHours || 'Our team is available 9 AM – 6 PM, Sunday to Friday'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${info?.contactPhone || '+9779820151085'}`} className="inline-block bg-white text-[#2db34a] font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors">
              Call: {info?.contactPhone || '+977 9820151085'}
            </a>
            <a href={`mailto:${info?.contactEmail || 'support@silver6.com'}`} className="inline-block bg-white/20 text-white font-bold px-6 py-3 rounded-full hover:bg-white/30 transition-colors">
              Email: {info?.contactEmail || 'support@silver6.com'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
