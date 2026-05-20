'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProductDetailsClient({ initialProduct }: { initialProduct: any }) {
  const [product, setProduct] = useState(initialProduct)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [user, setUser] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment) return toast.error('Please enter a comment')
    
    setIsSubmitting(true)
    try {
      const res = await fetch(`http://localhost:1000/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, user: user || 'Anonymous' })
      })

      if (res.ok) {
        toast.success('Review submitted successfully')
        setComment('')
        setUser('')
        setRating(5)
        // Refresh product data
        const refreshRes = await fetch(`http://localhost:1000/api/products/${product._id}`)
        if (refreshRes.ok) {
          setProduct(await refreshRes.json())
        }
      } else {
        toast.error('Failed to submit review')
      }
    } catch (err) {
      toast.error('Server error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Product Details Section */}
      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Images */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex flex-col gap-4 w-24">
            <div className="w-full aspect-square bg-gray-100 rounded-lg border-2 border-[#2db34a] overflow-hidden p-2">
               <Image src={product.image} alt={product.name} width={100} height={100} className="w-full h-full object-contain" unoptimized />
            </div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl flex items-center justify-center p-12 relative overflow-hidden">
            <Image src={product.image} alt={product.name} width={600} height={600} className="w-full h-auto object-contain" unoptimized />
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2">
          <div className="mb-2 text-sm text-[#2db34a] font-bold uppercase tracking-wider">{product.category}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">{product.reviewCount} Reviews</span>
          </div>

          <div className="text-4xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</div>

          <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-8 border-y border-gray-100 py-6">
            <div className="flex items-center border border-gray-200 rounded-full bg-white h-12 w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex justify-center text-gray-500 hover:text-black font-medium text-lg">-</button>
              <span className="flex-1 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex justify-center text-gray-500 hover:text-black font-medium text-lg">+</button>
            </div>
            <button className="flex-1 h-12 bg-[#2db34a] text-white font-bold rounded-full hover:bg-[#259b3f] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="w-12 h-12 border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg"><ShieldCheck className="w-5 h-5 text-[#2db34a]" /> Secure Transaction</div>
            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg"><Truck className="w-5 h-5 text-[#2db34a]" /> Free Delivery</div>
            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg"><RotateCcw className="w-5 h-5 text-[#2db34a]" /> 30-Day Returns</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Write a Review */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-2xl border border-gray-100 h-max">
            <h3 className="font-bold text-lg mb-6">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={user} 
                  onChange={e => setUser(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2db34a]/50" 
                  placeholder="Anonymous" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select 
                  value={rating} 
                  onChange={e => setRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2db34a]/50 bg-white"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea 
                  value={comment} 
                  onChange={e => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2db34a]/50 resize-none" 
                  rows={4}
                  placeholder="What did you like or dislike?"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* List Reviews */}
          <div className="w-full lg:w-2/3 space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {review.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{review.user}</div>
                        <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 pl-13 mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
