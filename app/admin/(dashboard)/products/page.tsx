'use client'

import { useState } from 'react'
import { Package, Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react'

// --- Mock Data & Types ---
interface Product {
    id: string
    name: string
    price: number
    stock: number
    category: string
    status: 'Active' | 'Out of Stock' | 'Draft'
}

const initialProducts: Product[] = [
    { id: 'p1', name: 'HomePod mini', price: 99.00, stock: 45, category: 'Electronics', status: 'Active' },
    { id: 'p2', name: 'Instax Mini 9', price: 59.99, stock: 12, category: 'Photography', status: 'Active' },
    { id: 'p3', name: 'Base Camp Duffel M', price: 159.00, stock: 0, category: 'Travel', status: 'Out of Stock' },
]

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [searchQuery, setSearchQuery] = useState('')

    // Modals State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [viewProduct, setViewProduct] = useState<Product | null>(null)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Form State for adding
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Electronics' })

    // --- Handlers ---
    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault()
        const product: Product = {
            id: `p${Date.now()}`,
            name: newProduct.name,
            price: parseFloat(newProduct.price) || 0,
            stock: parseInt(newProduct.stock) || 0,
            category: newProduct.category,
            status: parseInt(newProduct.stock) > 0 ? 'Active' : 'Out of Stock'
        }
        setProducts([product, ...products])
        setIsAddOpen(false)
        setNewProduct({ name: '', price: '', stock: '', category: 'Electronics' })
    }

    const handleEditProductSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editProduct) return
        const updated = {
            ...editProduct,
            status: editProduct.stock > 0 ? 'Active' as const : 'Out of Stock' as const
        }
        setProducts(products.map(p => p.id === editProduct.id ? updated : p))
        setEditProduct(null)
    }

    const handleDeleteProduct = () => {
        if (!deleteConfirmId) return
        setProducts(products.filter(p => p.id !== deleteConfirmId))
        setDeleteConfirmId(null)
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <p className="text-gray-500 mt-0.5">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] transition-all"
                        />
                    </div>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-medium">Product Name</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{product.category}</td>
                                    <td className="p-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">{product.stock}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-50 text-green-700' :
                                                product.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-red-50 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-green-500' :
                                                    product.status === 'Draft' ? 'bg-gray-500' :
                                                        'bg-red-500'
                                                }`} />
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setViewProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditProduct(product)} className="p-1.5 text-gray-400 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteConfirmId(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-8 h-8 text-gray-300 mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No products found</p>
                                            <p className="text-sm">Try adjusting your search or add a new product.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Add Product Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" placeholder="e.g. Wireless Headphones" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input required type="number" step="0.01" min="0" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" placeholder="99.99" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input required type="number" min="0" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" placeholder="50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]">
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Travel">Travel</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Product Modal */}
            {viewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                            <button onClick={() => setViewProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{viewProduct.name}</h3>
                                    <p className="text-sm text-gray-500">{viewProduct.category}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Price</p>
                                    <p className="text-lg font-medium text-gray-900">${viewProduct.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Stock Level</p>
                                    <p className="text-lg font-medium text-gray-900">{viewProduct.stock} units</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${viewProduct.status === 'Active' ? 'bg-green-50 text-green-700' :
                                            viewProduct.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                                'bg-red-50 text-red-700'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${viewProduct.status === 'Active' ? 'bg-green-500' :
                                                viewProduct.status === 'Draft' ? 'bg-gray-500' :
                                                    'bg-red-500'
                                            }`} />
                                        {viewProduct.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Product ID</p>
                                    <p className="text-sm font-medium text-gray-900 font-mono">{viewProduct.id}</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button onClick={() => setViewProduct(null)} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                            <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditProductSave} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input required type="text" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input required type="number" step="0.01" min="0" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input required type="number" min="0" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]">
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Travel">Travel</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditProduct(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex-1">
                                Cancel
                            </button>
                            <button onClick={handleDeleteProduct} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors flex-1">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}