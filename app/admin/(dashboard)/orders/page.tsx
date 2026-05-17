import { ShoppingBag } from 'lucide-react'

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <button className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors">
          Export CSV
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500 mt-1">When customers place orders, they will appear here.</p>
      </div>
    </div>
  )
}