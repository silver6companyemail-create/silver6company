import Logo from '@/components/common/Logo'
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
              Amat minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
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
            <h4 className="text-sm font-bold text-gray-900 mb-6">Department</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Department.map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">{link}</a></li>
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
            <h4 className="text-sm font-bold text-gray-900 mb-6">Services</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Services.map(link => (
                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">{link}</a></li>
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
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><Briefcase className="w-4 h-4 text-[#ec4899]"/> Become Seller</a>
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><Gift className="w-4 h-4 text-[#ec4899]"/> Gift Cards</a>
            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2db34a]"><HelpCircle className="w-4 h-4 text-[#ec4899]"/> Help Center</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">Terms of Service</a>
            <a href="#" className="text-sm text-gray-600 hover:text-[#2db34a]">Privacy & Policy</a>
          </div>
          <p className="text-sm text-gray-500">
            All Right reserved by Musemind <a href="#" className="text-[#2db34a] underline">ui/ux design</a> agency | 2022
          </p>
        </div>

      </div>
    </footer>
  )
}
