'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Edit, Trash2, Eye, X, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    // Modals State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [viewProduct, setViewProduct] = useState<any>(null)
    const [editProduct, setEditProduct] = useState<any>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Form State for adding/editing
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: 'Electronics', 
        status: 'Active', rating: 5, reviewCount: 0, image: '', isWeeklyPopular: false,
        isOnDeal: false, discountPercent: 0
    })

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/products')
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            toast.error('Failed to fetch products')
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/categories')
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            toast.error('Failed to fetch categories')
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        const url = editProduct ? `http://localhost:1000/api/products/${editProduct._id}` : 'http://localhost:1000/api/products'
        const method = editProduct ? 'PUT' : 'POST'

        const payload = {
            ...formData,
            price: parseFloat(formData.price as string) || 0,
            stock: parseInt(formData.stock as string) || 0,
            rating: parseFloat(formData.rating as unknown as string) || 5,
            reviewCount: parseInt(formData.reviewCount as unknown as string) || 0,
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                toast.success(editProduct ? 'Product updated' : 'Product added')
                fetchProducts()
                setIsAddOpen(false)
                setEditProduct(null)
            } else {
                toast.error('Failed to save product')
            }
        } catch (err) {
            toast.error('Server error')
        }
    }

    const handleDeleteProduct = async () => {
        if (!deleteConfirmId) return
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        try {
            const res = await fetch(`http://localhost:1000/api/products/${deleteConfirmId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                toast.success('Product deleted')
                fetchProducts()
            } else toast.error('Failed to delete')
        } catch (err) {
            toast.error('Server error')
        }
        setDeleteConfirmId(null)
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleImageUpload = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const toastId = toast.loading('Uploading image...');
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        try {
            const res = await fetch(`http://localhost:1000/api/upload`, { method: 'POST', body: formDataUpload });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: data.image }));
                toast.success('Image uploaded!', { id: toastId });
            } else throw new Error(data.message || 'Upload failed');
        } catch (err: any) { toast.error(`Upload error: ${err.message}`, { id: toastId }); }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <p className="text-gray-500 mt-0.5">Manage your product inventory and homepage display</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ 
                            name: '', description: '', price: '', stock: '', 
                            category: categories.length > 0 ? categories[0].name : 'Electronics', 
                            status: 'Active', rating: 5, reviewCount: 0, image: '', isWeeklyPopular: false,
                            isOnDeal: false, discountPercent: 0
                        })
                        setIsAddOpen(true)
                    }}
                    className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium">Weekly Popular</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                                                {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <Package className="w-5 h-5" />}
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{product.category}</td>
                                    <td className="p-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">{product.stock}</td>
                                    <td className="p-4 text-gray-600">
                                        {product.isWeeklyPopular ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setViewProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => {
                                                setFormData({
                                                    name: product.name, description: product.description, price: product.price.toString(),
                                                    stock: product.stock.toString(), category: product.category, status: product.status,
                                                    rating: product.rating, reviewCount: product.reviewCount, image: product.image || '',
                                                    isWeeklyPopular: product.isWeeklyPopular,
                                                    isOnDeal: product.isOnDeal || false,
                                                    discountPercent: product.discountPercent || 0
                                                } as any)
                                                setEditProduct(product)
                                            }} className="p-1.5 text-gray-400 hover:text-[#2db34a] hover:bg-green-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmId(product._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Combined Add/Edit Product Modal */}
            {(isAddOpen || editProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-auto">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{isAddOpen ? "Add Product" : "Edit Product"}</h2>
                            <button onClick={() => { setIsAddOpen(false); setEditProduct(null); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="e.g. Wireless Headphones" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" rows={3} placeholder="Product description..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]">
                                        {categories.length === 0 ? (
                                            <option value="">No categories available</option>
                                        ) : (
                                            categories.map(c => (
                                                <option key={c._id} value={c.name}>{c.name}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]">
                                        <option value="Active">Active</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
                                    <input type="number" min="0" value={formData.reviewCount} onChange={e => setFormData({ ...formData, reviewCount: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={formData.isWeeklyPopular} onChange={e => setFormData({ ...formData, isWeeklyPopular: e.target.checked })} className="w-4 h-4 text-[#2db34a]" />
                                        Show in "Weekly Popular" Section
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input type="checkbox" checked={(formData as any).isOnDeal} onChange={e => setFormData({ ...formData, isOnDeal: e.target.checked } as any)} className="w-4 h-4 text-red-500" />
                                        <span>Mark as <span className="text-red-500 font-bold">Deal</span> (show on Deals page)</span>
                                    </label>
                                    {(formData as any).isOnDeal && (
                                        <div className="flex items-center gap-3 pl-6">
                                            <label className="text-sm text-gray-600 whitespace-nowrap">Discount %</label>
                                            <input type="number" min="1" max="99" value={(formData as any).discountPercent || 0} onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) } as any)} className="w-24 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 text-sm" />
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Cloudinary)</label>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                    {formData.image && (
                                        <div className="mt-2 w-32 h-32 bg-gray-50 rounded-lg border overflow-hidden">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t">
                                <button type="button" onClick={() => { setIsAddOpen(false); setEditProduct(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                            <button onClick={() => setViewProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                                    {viewProduct.image ? <img src={viewProduct.image} className="w-full h-full object-cover" /> : <Package className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{viewProduct.name}</h3>
                                    <p className="text-sm text-gray-500">{viewProduct.category}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Price</p><p className="text-lg font-medium text-gray-900">${viewProduct.price.toFixed(2)}</p></div>
                                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Stock Level</p><p className="text-lg font-medium text-gray-900">{viewProduct.stock} units</p></div>
                                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Rating</p><p className="text-lg font-medium text-gray-900">{viewProduct.rating} / 5</p></div>
                                <div><p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Reviews</p><p className="text-lg font-medium text-gray-900">{viewProduct.reviewCount}</p></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{viewProduct.description}</p>
                            
                            {/* Reviews Management */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4">Customer Reviews ({viewProduct.reviews?.length || 0})</h4>
                                <div className="space-y-4 max-h-48 overflow-y-auto">
                                    {viewProduct.reviews && viewProduct.reviews.length > 0 ? (
                                        viewProduct.reviews.map((review: any) => (
                                            <div key={review._id} className="bg-gray-50 p-3 rounded-lg relative group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <span className="font-bold text-sm text-gray-900">{review.user}</span>
                                                        <span className="ml-2 text-xs text-gray-500">{review.rating} Stars</span>
                                                    </div>
                                                    <button 
                                                        onClick={async () => {
                                                            if(confirm('Delete this review?')) {
                                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                                const res = await fetch(`http://localhost:1000/api/products/${viewProduct._id}/reviews/${review._id}`, {
                                                                    method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                                                                });
                                                                if(res.ok) {
                                                                    toast.success('Review deleted');
                                                                    // Update local viewProduct state to reflect deletion
                                                                    setViewProduct({...viewProduct, reviews: viewProduct.reviews.filter((r:any) => r._id !== review._id)});
                                                                    fetchProducts();
                                                                }
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-700">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">No reviews yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 className="w-8 h-8" /></div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h2>
                        <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium flex-1">Cancel</button>
                            <button onClick={handleDeleteProduct} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium flex-1">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}