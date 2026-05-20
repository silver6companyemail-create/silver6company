import Logo from '@/components/common/Logo'
import { Briefcase, HelpCircle, Gift } from 'lucide-react'
import ScrollAnimation from '@/components/common/ScrollAnimation'

export default async function Footer() {
  let footer = {
    brandDescription: 'Silver 6 is a growing Nepali brand...',
    aboutUsLinks: [],
    socialMediaLinks: [],
    helpLinks: [],
    copyrightText: 'All Right Reserved By Silver 6 pvt .ltd'
  };
  let categories = [];

  try {
    const [footerRes, catRes] = await Promise.all([
      fetch('http://localhost:1000/api/footer', { next: { revalidate: 0 } }),
      fetch('http://localhost:1000/api/categories', { next: { revalidate: 0 } })
    ]);
    if (footerRes.ok) footer = await footerRes.json();
    if (catRes.ok) categories = await catRes.json();
  } catch (err) {
    console.error('Failed to load footer data', err);
  }

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200 mt-10 overflow-hidden">
      <ScrollAnimation delay={0.1} y={40} className="max-w-[1280px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 pr-8">
            <Logo />
            <p className="text-sm text-gray-500 mt-6 leading-relaxed">
              {footer.brandDescription}
            </p>
            <div className="mt-8">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Accepted Payments</h4>
              <div className="grid grid-cols-4 gap-2">
                {/* Placeholders for payment icons */}
                {['Stripe', 'VISA', 'Mastercard', 'Amazon', 'Klarna', 'PayPal', 'ApplePay', 'GPay'].map(p => (
                  <div key={p} className="h-8 border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-50">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">Categories</h4>
            <ul className="flex flex-col gap-3">
              {categories.slice(0, 10).map((cat: any) => (
                <li key={cat._id}><a href={`/category/${cat._id}`} className="text-sm text-gray-600 hover:text-[#2db34a]">{cat.name}</a></li>
              ))}
              {categories.length === 0 && <li className="text-sm text-gray-400">No categories</li>}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">About Us</h4>
            <ul className="flex flex-col gap-3">
              {footer.aboutUsLinks?.map((link: any, i: number) => (
                <li key={i}><a href={link.url} className="text-sm text-gray-600 hover:text-[#2db34a]">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">Social Media</h4>
            <ul className="flex flex-col gap-3">
              {footer.socialMediaLinks?.map((link: any, i: number) => (
                <li key={i}><a href={link.url} className="text-sm text-gray-600 hover:text-[#2db34a]">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">Help</h4>
            <ul className="flex flex-col gap-3">
              {footer.helpLinks?.map((link: any, i: number) => (
                <li key={i}><a href={link.url} className="text-sm text-gray-600 hover:text-[#2db34a]">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><Briefcase className="w-4 h-4 text-[#ec4899]" /> Browse Categories</a>
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><Gift className="w-4 h-4 text-[#ec4899]" /> Contact</a>
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><HelpCircle className="w-4 h-4 text-[#ec4899]" /> Help Center</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">Terms of Service</a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">Privacy & Policy</a>
          </div>
          <p className="text-sm text-gray-500">
            {footer.copyrightText}
          </p>
        </div>

      </ScrollAnimation>
    </footer>
  )
}
