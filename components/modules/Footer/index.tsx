import Logo from '@/components/common/Logo'
import { popularCategories, socialMedia } from '@/data/navigation'
import { Briefcase, HelpCircle, Gift } from 'lucide-react'

const footerLinks = {
  Department: ['Fashion', 'Education Product', 'Frozen Food', 'Beverages', 'Organic Grocery', 'Office Supplies', 'Beauty Products', 'Books', 'Electronics & Gadget', 'Travel Accessories', 'Fitness', 'Sneakers', 'Toys', 'Furniture'],
  AboutUs: ['About Shopcart', 'Careers', 'News & Blog', 'Help', 'Press Center', 'Shop By Location', 'Shopcart Brands', 'Affiliate & Partners', 'Ideas & Guides'],
  Services: ['Gift Card', 'Mobile App', 'Shipping & Delivery', 'Order Pickup', 'Account Signup'],
  Help: ['Shopcart Help', 'Returns', 'Track Orders', 'Contact Us', 'Feedback', 'Security & Fraud']
}

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200 mt-10">
      <div className="max-w-[1280px] mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 pr-8">
            <Logo />
            <p className="text-sm text-gray-500 mt-6 leading-relaxed">
              Silver 6 is a growing Nepali brand committed to delivering quality, trust, and innovation through premium wellness and skincare products. With a strong focus on customer satisfaction, effectiveness, and everyday comfort, we create products designed to become a trusted part of people’s daily lives. From skincare serums to warm oils, every Silver 6 product is developed with care, modern standards, and a vision to represent confident and reliable Nepali entrepreneurship.
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
              {popularCategories.map(link => (
                <li key={link.id}><a href={`/category/${link.id}`} className="text-sm text-gray-600 hover:text-[#2db34a]">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">About Us</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.AboutUs.map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">Social Media</h4>
            <ul className="flex flex-col gap-3">
              {socialMedia.map(link => (
                <li key={link.id}><a href={`#`} className="text-sm text-gray-600 hover:text-[#2db34a]">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-6">Help</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Help.map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">{link}</a></li>
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
            All Right Reserved By <a href="#" className="text-[#2db34a] underline">Silver 6 pvt .ltd</a>
          </p>
        </div>

      </div>
    </footer>
  )
}
