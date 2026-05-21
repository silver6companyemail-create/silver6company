'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Copy,
  DollarSign,
  Star,
  CheckCircle,
  Briefcase,
  Layers,
  ChevronDown,
  Calculator,
  PlusCircle,
  Sparkles,
  Loader2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  rating: number
  discountPercent?: number
  image?: string
  stock: number
}

interface Category {
  _id: string
  name: string
}

export default function PitchCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activePitchId, setActivePitchId] = useState<string | null>(null)
  
  // Quote Calculator States
  const [calcQuantity, setCalcQuantity] = useState<number>(1)
  const [calcDiscount, setCalcDiscount] = useState<number>(10) // 10% loyalty discount

  // Fallback Mock data in case DB has no products/categories
  const fallbackCategories = [
    { _id: 'c1', name: 'Premium Video Packs' },
    { _id: 'c2', name: 'Social Reels Suite' },
    { _id: 'c3', name: 'Corporate Branding' },
    { _id: 'c4', name: 'SaaS Onboarding' }
  ]

  const fallbackProducts: Product[] = [
    {
      _id: 'p1',
      name: 'Executive Commercial Campaign',
      description: 'Stunning 4K studio commercials for premium businesses looking to scale. Includes complete storyboard scripting, graphic overlay transitions, professional narration, and social cuts.',
      price: 4500,
      category: 'Premium Video Packs',
      rating: 4.9,
      discountPercent: 15,
      stock: 12,
      image: ''
    },
    {
      _id: 'p2',
      name: 'Viral TikTok/Reels Growth Bundle',
      description: 'A comprehensive bundle of 15 short-form videos edited in high-retention styles (dynamic captions, micro-zooms, trending sound designs) to skyrocket organic audience growth.',
      price: 1800,
      category: 'Social Reels Suite',
      rating: 5.0,
      discountPercent: 10,
      stock: 45,
      image: ''
    },
    {
      _id: 'p3',
      name: 'Enterprise SaaS Interactive Tour',
      description: 'Professional video explainer guiding prospective clients step-by-step through a SaaS platform interface. Keeps churn rates extremely low and conversion velocities high.',
      price: 2900,
      category: 'SaaS Onboarding',
      rating: 4.8,
      stock: 8,
      image: ''
    },
    {
      _id: 'p4',
      name: 'Full Corporate Brand Reidentity',
      description: 'Elegant custom logos, animated intros, presentation decks, and style sheets crafted by our lead creative designers to present a cohesive brand message.',
      price: 3200,
      category: 'Corporate Branding',
      rating: 4.7,
      discountPercent: 20,
      stock: 15,
      image: ''
    }
  ]

  // Load Inventory from Database with Safe Fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch Categories
        const catRes = await fetch('http://localhost:1000/api/categories')
        let catData = []
        if (catRes.ok) {
          catData = await catRes.json()
        }

        // Fetch Products
        const prodRes = await fetch('http://localhost:1000/api/products')
        let prodData = []
        if (prodRes.ok) {
          prodData = await prodRes.json()
        }

        // Apply fallback if empty
        if (catData.length === 0) catData = fallbackCategories
        if (prodData.length === 0) prodData = fallbackProducts

        setCategories(catData)
        setProducts(prodData)
      } catch (err) {
        console.error("Failed fetching live inventory. Using mockup fallback.", err)
        setCategories(fallbackCategories)
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Generate Email Pitch Script Template
  const handleCopyPitch = (product: Product) => {
    const discountedPrice = product.discountPercent 
      ? product.price - (product.price * product.discountPercent / 100)
      : product.price;

    const emailBody = `Subject: Tailored Creative Campaign - ${product.name} 🚀

Hi [Client Name],

I was reviewing your brand's digital presence and saw an incredible opportunity to scale your audience engagement.

We've recently rolled out our "${product.name}" package, specifically tailored for enterprise accounts. Here's a brief summary of what this includes:

• ${product.description}
• Professional Studio Grade Rendering
• High Conversion Script Outline

Standard Investment: $${product.price.toLocaleString()}
${product.discountPercent ? `Limited Deal Discount: ${product.discountPercent}% Off!\nSpecial Quote: $${discountedPrice.toLocaleString()}` : `Special Quote: $${product.price.toLocaleString()}`}

Would you be open to a quick 10-minute Zoom sync next Tuesday at 2:00 PM to review some storyboards?

Best regards,
[Your Name]
Account Executive | Sales Department`

    navigator.clipboard.writeText(emailBody)
    toast.success("Sales Pitch Copied to Clipboard!")
  }

  // Create lead from Quote Calculator
  const handleCreateLeadFromQuote = (product: Product, total: number) => {
    const storedLeads = localStorage.getItem('salesLeads')
    let currentLeads = []
    if (storedLeads) {
      try {
        currentLeads = JSON.parse(storedLeads)
      } catch (e) {
        currentLeads = []
      }
    }

    const newLead = {
      id: Date.now().toString(),
      name: `Prospect [${product.name}]`,
      email: 'prospect@change-me.com',
      phone: '+1 (555) 000-0000',
      value: total.toFixed(0),
      product: `${calcQuantity}x ${product.name}`,
      status: 'Proposal Sent' as const,
      campaign: 'Catalog Quote Tool',
      createdAt: new Date().toISOString().split('T')[0]
    }

    const updated = [newLead, ...currentLeads]
    localStorage.setItem('salesLeads', JSON.stringify(updated))
    toast.success("Quote added directly to CRM Leads!")
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Filtering Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search pitch assets or pricing tiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm pl-11 pr-4 py-2.5 rounded-xl transition-shadow text-slate-800 font-medium placeholder-slate-400"
          />
        </div>

        {/* Category Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Inventory
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="p-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-350 shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-extrabold text-slate-800 text-sm">No products found</h4>
            <p className="text-xs text-slate-400">There are no pitching assets matching your selected search query or category tag.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredProducts.map(product => {
            const isPitchActive = activePitchId === product._id
            const finalPrice = product.discountPercent 
              ? product.price - (product.price * product.discountPercent / 100)
              : product.price;

            // Computed quote
            const calculatedTotal = (finalPrice * calcQuantity) * (1 - calcDiscount / 100);

            return (
              <div 
                key={product._id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Product Meta */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8.5px] font-extrabold uppercase tracking-widest">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                      <span>{product.rating.toFixed(1)} Rating</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-800">{product.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{product.description}</p>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="flex items-center gap-3.5 pt-1.5">
                    <div className="text-xl font-extrabold text-slate-800 flex items-center">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      {finalPrice.toLocaleString()}
                    </div>
                    {product.discountPercent && (
                      <>
                        <div className="text-xs text-slate-400 line-through font-bold">
                          ${product.price.toLocaleString()}
                        </div>
                        <span className="bg-red-50 border border-red-150/40 text-red-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {product.discountPercent}% Off Deal
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold ml-auto">Stock: {product.stock} items</span>
                  </div>
                </div>

                {/* Pitch Panel & Quote Calculator */}
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyPitch(product)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-500" />
                      Copy Pitch Outline
                    </button>
                    <button
                      onClick={() => {
                        setActivePitchId(isPitchActive ? null : product._id)
                      }}
                      className={`flex items-center gap-1 text-xs font-bold px-3 rounded-xl border transition-all ${
                        isPitchActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      <Calculator className="w-4 h-4 shrink-0" />
                      {isPitchActive ? 'Hide Calculator' : 'Quote Tool'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPitchActive ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Accordion Pitch and Quote Calculations */}
                  {isPitchActive && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-600">Enterprise Quote Generator</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Order Quantity</label>
                          <input 
                            type="number"
                            min="1"
                            value={calcQuantity}
                            onChange={(e) => setCalcQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-bold px-3 py-1.5 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Loyalty Promo Disc. (%)</label>
                          <input 
                            type="number"
                            min="0"
                            max="90"
                            value={calcDiscount}
                            onChange={(e) => setCalcDiscount(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-full bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-bold px-3 py-1.5 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Computed Price */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-150 shadow-sm">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Projected Deal Total</p>
                          <p className="text-xs text-slate-500 font-bold">{calcQuantity}x Pack Campaign (-{calcDiscount}% Loyalty)</p>
                        </div>
                        <div className="text-base font-extrabold text-slate-800 flex items-center">
                          <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                          {calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCreateLeadFromQuote(product, calculatedTotal)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-extrabold py-2 px-3 rounded-xl shadow-sm hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <PlusCircle className="w-4 h-4 shrink-0" />
                        Add directly to CRM Leads
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
