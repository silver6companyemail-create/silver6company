import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#2db34a]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">$24,560</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">1,245</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">842</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">3.4%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Orders Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Order chart or table goes here</p>
          </div>
        </div>

        {/* Top Products Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Product list goes here</p>
          </div>
        </div>
      </div>
    </div>
  )
}