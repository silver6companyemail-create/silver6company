import { Package, Plus } from 'lucide-react'

export default function AdminProducts() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <p className="text-gray-500 mt-0.5">Manage your product inventory</p>
                </div>
                <button className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                <p className="text-gray-500 mt-1">Add your first product to get started</p>
            </div>
        </div>
    )
}