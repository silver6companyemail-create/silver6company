'use client'

import { useState, useEffect } from 'react'
import { LayoutTemplate, MessageSquare, HelpCircle, FileText, Mail, Plus, Trash2, Edit, ImageIcon, Save, Grid, X, Truck } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LandingControls() {
    const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'services' | 'footer' | 'testimonials' | 'faqs' | 'contacts' | 'blogs' | 'banners' | 'ads' | 'delivery'>('hero')

    // Categories State
    const [categories, setCategories] = useState<any[]>([])
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [editCategory, setEditCategory] = useState<any>(null)
    const [categoryForm, setCategoryForm] = useState({ name: '', bgColor: '#79b29c', image: '' })

    // Hero State
    const [heroForm, setHeroForm] = useState({
        badge: '', title: '', description: '',
        button1Text: '', button1Link: '', button2Text: '', button2Link: '',
        stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '',
        image: ''
    })

    const fetchHero = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/hero')
            if (res.ok) {
                const data = await res.json()
                if (data) setHeroForm(data)
            }
        } catch (error) {
            toast.error('Failed to load hero section')
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/categories')
            const data = await res.json()
            if (res.ok) setCategories(data)
        } catch (error) {
            toast.error('Failed to load categories')
        }
    }

    const [reviews, setReviews] = useState<any[]>([])
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviewForm, setReviewForm] = useState({ name: '', description: '', thumbnail: '', youtubeLink: '' })

    const fetchReviews = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/reviews')
            const data = await res.json()
            if (res.ok) setReviews(data)
        } catch (error) {
            toast.error('Failed to load reviews')
        }
    }

    const [services, setServices] = useState<any[]>([])
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
    const [serviceForm, setServiceForm] = useState({ title: '', description: '', image: '', bgColor: '#f5f6f8', imageBgColor: '#eeb8cd' })

    const fetchServices = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/services')
            if (res.ok) setServices(await res.json())
        } catch (error) { toast.error('Failed to load services') }
    }

    const [footerForm, setFooterForm] = useState({
        brandDescription: '', copyrightText: '',
        aboutUsLinks: [] as {label: string, url: string}[],
        socialMediaLinks: [] as {label: string, url: string}[],
        helpLinks: [] as {label: string, url: string}[]
    })

    const fetchFooter = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/footer')
            if (res.ok) setFooterForm(await res.json())
        } catch (error) { toast.error('Failed to load footer') }
    }

    // Ads State
    const [ads, setAds] = useState<any[]>([])
    const [adForm, setAdForm] = useState({ title: '', link: '', image: '', isActive: true })
    const [isAdModalOpen, setIsAdModalOpen] = useState(false)

    const fetchAds = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
            const res = await fetch('http://localhost:1000/api/ads', { headers: { 'Authorization': `Bearer ${token}` } })
            if (res.ok) setAds(await res.json())
        } catch (error) { toast.error('Failed to load ads') }
    }

    const handleAdImageUpload = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const toastId = toast.loading('Uploading image...');
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch('http://localhost:1000/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (res.ok) { setAdForm(prev => ({ ...prev, image: data.image })); toast.success('Uploaded!', { id: toastId }); }
            else throw new Error(data.message);
        } catch (err: any) { toast.error(`Upload error: ${err.message}`, { id: toastId }); }
    }

    const handleSaveAd = async () => {
        if (!adForm.image) return toast.error('Please upload an image');
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        try {
            const res = await fetch('http://localhost:1000/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(adForm)
            });
            if (res.ok) { toast.success('Ad created!'); setIsAdModalOpen(false); setAdForm({ title: '', link: '', image: '', isActive: true }); fetchAds(); }
            else toast.error('Failed to create ad');
        } catch (err) { toast.error('Server error'); }
    }

    const handleDeleteAd = async (id: string) => {
        if (!confirm('Delete this ad?')) return;
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        try {
            const res = await fetch(`http://localhost:1000/api/ads/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) { toast.success('Ad deleted'); fetchAds(); }
            else toast.error('Failed to delete ad');
        } catch (err) { toast.error('Server error'); }
    }

    const handleToggleAd = async (id: string, isActive: boolean) => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        try {
            const res = await fetch(`http://localhost:1000/api/ads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive })
            });
            if (res.ok) { toast.success(isActive ? 'Ad activated' : 'Ad deactivated'); fetchAds(); }
        } catch (err) { toast.error('Server error'); }
    }

    // Delivery Settings State
    const [deliveryForm, setDeliveryForm] = useState({
        heroTitle: '', heroSubtitle: '',
        highlight1Title: '', highlight1Desc: '',
        highlight2Title: '', highlight2Desc: '',
        highlight3Title: '', highlight3Desc: '',
        freeDeliveryNote: '',
        contactPhone: '', contactEmail: '', contactHours: '',
        zones: [] as { zone: string; time: string; charge: string }[],
        faqs: [] as { question: string; answer: string }[],
    })

    const fetchDelivery = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/delivery-info')
            if (res.ok) {
                const data = await res.json()
                setDeliveryForm({
                    heroTitle: data.heroTitle || '',
                    heroSubtitle: data.heroSubtitle || '',
                    highlight1Title: data.highlight1Title || '',
                    highlight1Desc: data.highlight1Desc || '',
                    highlight2Title: data.highlight2Title || '',
                    highlight2Desc: data.highlight2Desc || '',
                    highlight3Title: data.highlight3Title || '',
                    highlight3Desc: data.highlight3Desc || '',
                    freeDeliveryNote: data.freeDeliveryNote || '',
                    contactPhone: data.contactPhone || '',
                    contactEmail: data.contactEmail || '',
                    contactHours: data.contactHours || '',
                    zones: data.zones || [],
                    faqs: data.faqs || [],
                })
            }
        } catch (err) { toast.error('Failed to load delivery info') }
    }

    const handleSaveDelivery = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
        try {
            const res = await fetch('http://localhost:1000/api/delivery-info', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(deliveryForm)
            })
            if (res.ok) toast.success('Delivery info saved!')
            else toast.error('Failed to save')
        } catch (err) { toast.error('Server error') }
    }

    useEffect(() => {
        fetchHero()
        fetchCategories()
        fetchReviews()
        fetchServices()
        fetchFooter()
        fetchAds()
        fetchDelivery()
    }, [])

    // Mock Data States
    const [banners, setBanners] = useState([
        { id: 1, title: 'Summer Sale', image: 'summer-banner.jpg', link: '/category/summer', status: 'Active' },
        { id: 2, title: 'New Arrivals', image: 'new-arr.png', link: '/new', status: 'Draft' },
    ])

    const [faqs, setFaqs] = useState([
        { id: 1, question: 'How long does delivery take?', answer: 'Inside valley: 24hrs. Outside: 3-5 days.' },
        { id: 2, question: 'Do you offer refunds?', answer: 'Yes, within 7 days of purchase for unused items.' },
    ])

    const [contacts, setContacts] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', message: 'I need help with bulk ordering.', date: '2026-05-17', status: 'Unread' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Are you looking for vendors?', date: '2026-05-16', status: 'Read' },
    ])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Landing Page Controls</h2>
                    <p className="text-gray-500 mt-0.5">Manage banners, FAQs, blogs, testimonials, and customer queries.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex overflow-x-auto">
                <nav className="flex space-x-2">
                    {[
                        { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
                        { id: 'categories', label: 'Top Categories', icon: Grid },
                        { id: 'ads', label: 'Popup Ads', icon: ImageIcon },
                        { id: 'blogs', label: 'Blogs', icon: FileText },
                        { id: 'services', label: 'Services', icon: HelpCircle },
                        { id: 'delivery', label: 'Delivery Page', icon: Truck },
                        { id: 'testimonials', label: 'Video Reviews', icon: MessageSquare },
                        { id: 'footer', label: 'Footer Settings', icon: LayoutTemplate },
                        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                        { id: 'contacts', label: 'Contact & Queries', icon: Mail },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-[#2db34a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Contents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6">
                
                {/* --- POPUP ADS --- */}
                {activeTab === 'ads' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Popup Ads Manager</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Upload an image poster that appears as a popup when visitors land on the homepage.</p>
                            </div>
                            <button onClick={() => { setAdForm({ title: '', link: '', image: '', isActive: true }); setIsAdModalOpen(true); }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Plus className="w-4 h-4" /> New Ad
                            </button>
                        </div>

                        {ads.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p>No popup ads yet. Click "New Ad" to upload one.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ads.map((ad: any) => (
                                    <div key={ad._id} className="rounded-xl border border-gray-100 overflow-hidden shadow-sm group relative">
                                        <div className="relative aspect-[3/4] bg-gray-100">
                                            <img src={ad.image} alt={ad.title || 'Ad'} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                                <button onClick={() => handleDeleteAd(ad._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${ad.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                                {ad.isActive ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="font-semibold text-gray-900 truncate">{ad.title || 'Untitled Ad'}</p>
                                            {ad.link && <p className="text-xs text-gray-400 truncate mt-0.5">{ad.link}</p>}
                                            <div className="mt-3 flex items-center gap-2">
                                                <button onClick={() => handleToggleAd(ad._id, !ad.isActive)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${ad.isActive ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}>
                                                    {ad.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button onClick={() => handleDeleteAd(ad._id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Ad Modal */}
                        {isAdModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                                    <div className="flex justify-between items-center p-5 border-b"><h2 className="text-lg font-bold">New Popup Ad</h2><button onClick={() => setIsAdModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title (optional)</label>
                                            <input type="text" value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="e.g. Summer Sale 20% Off" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Click Link (optional)</label>
                                            <input type="text" value={adForm.link} onChange={e => setAdForm({...adForm, link: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="https://yoursite.com/deals" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image / Poster *</label>
                                            <input type="file" accept="image/*" onChange={handleAdImageUpload} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                            {adForm.image && (
                                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 max-h-48">
                                                    <img src={adForm.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="adActive" checked={adForm.isActive} onChange={e => setAdForm({...adForm, isActive: e.target.checked})} className="w-4 h-4" />
                                            <label htmlFor="adActive" className="text-sm font-medium text-gray-700">Set as Active (will show on homepage immediately)</label>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-5 border-t">
                                        <button onClick={() => setIsAdModalOpen(false)} className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                                        <button onClick={handleSaveAd} className="flex-1 px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f]">Create Ad</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- DELIVERY PAGE SETTINGS --- */}
                {activeTab === 'delivery' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delivery Page Settings</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Control all content on the /delivery page — hero, highlights, zones, FAQs, and contact info.</p>
                            </div>
                            <button onClick={handleSaveDelivery} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save All Changes
                            </button>
                        </div>

                        {/* Hero */}
                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                            <h4 className="font-bold text-blue-800 flex items-center gap-2"><Truck className="w-4 h-4" /> Page Hero</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                                    <input type="text" value={deliveryForm.heroTitle} onChange={e => setDeliveryForm({...deliveryForm, heroTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white" placeholder="e.g. Delivery Information" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                                    <input type="text" value={deliveryForm.heroSubtitle} onChange={e => setDeliveryForm({...deliveryForm, heroSubtitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white" placeholder="e.g. We deliver across Nepal..." />
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
                            <h4 className="font-bold text-gray-800">3 Highlight Cards</h4>
                            {[1, 2, 3].map(n => (
                                <div key={n} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Highlight {n} Title</label>
                                        <input type="text" value={(deliveryForm as any)[`highlight${n}Title`]} onChange={e => setDeliveryForm({...deliveryForm, [`highlight${n}Title`]: e.target.value} as any)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Highlight {n} Description</label>
                                        <input type="text" value={(deliveryForm as any)[`highlight${n}Desc`]} onChange={e => setDeliveryForm({...deliveryForm, [`highlight${n}Desc`]: e.target.value} as any)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Zones */}
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800">Delivery Zones</h4>
                                <button type="button" onClick={() => setDeliveryForm({...deliveryForm, zones: [...deliveryForm.zones, { zone: '', time: '', charge: '' }]})} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#2db34a] text-white rounded-lg hover:bg-[#259b3f]">
                                    <Plus className="w-3.5 h-3.5" /> Add Zone
                                </button>
                            </div>
                            {deliveryForm.zones.length === 0 && <p className="text-xs text-gray-400 italic">No zones yet.</p>}
                            <div className="space-y-2">
                                {deliveryForm.zones.map((z, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center pb-3 border-b border-gray-100 sm:pb-0 sm:border-0">
                                        <input type="text" value={z.zone} onChange={e => { const u = [...deliveryForm.zones]; u[idx] = {...u[idx], zone: e.target.value}; setDeliveryForm({...deliveryForm, zones: u}); }} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" placeholder="Zone name" />
                                        <input type="text" value={z.time} onChange={e => { const u = [...deliveryForm.zones]; u[idx] = {...u[idx], time: e.target.value}; setDeliveryForm({...deliveryForm, zones: u}); }} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" placeholder="e.g. 24 Hours" />
                                        <div className="flex gap-2">
                                            <input type="text" value={z.charge} onChange={e => { const u = [...deliveryForm.zones]; u[idx] = {...u[idx], charge: e.target.value}; setDeliveryForm({...deliveryForm, zones: u}); }} className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" placeholder="e.g. Rs. 100" />
                                            <button type="button" onClick={() => { const u = [...deliveryForm.zones]; u.splice(idx, 1); setDeliveryForm({...deliveryForm, zones: u}); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery Note</label>
                                <input type="text" value={deliveryForm.freeDeliveryNote} onChange={e => setDeliveryForm({...deliveryForm, freeDeliveryNote: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" placeholder="e.g. Free delivery on orders above Rs. 2,000..." />
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800">FAQs</h4>
                                <button type="button" onClick={() => setDeliveryForm({...deliveryForm, faqs: [...deliveryForm.faqs, { question: '', answer: '' }]})} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#2db34a] text-white rounded-lg hover:bg-[#259b3f]">
                                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                                </button>
                            </div>
                            {deliveryForm.faqs.length === 0 && <p className="text-xs text-gray-400 italic">No FAQs yet.</p>}
                            <div className="space-y-3">
                                {deliveryForm.faqs.map((faq, idx) => (
                                    <div key={idx} className="space-y-2 pb-3 border-b border-gray-200 last:border-0">
                                        <div className="flex gap-2">
                                            <input type="text" value={faq.question} onChange={e => { const u = [...deliveryForm.faqs]; u[idx] = {...u[idx], question: e.target.value}; setDeliveryForm({...deliveryForm, faqs: u}); }} className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white font-medium" placeholder="Question" />
                                            <button type="button" onClick={() => { const u = [...deliveryForm.faqs]; u.splice(idx, 1); setDeliveryForm({...deliveryForm, faqs: u}); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <textarea value={faq.answer} onChange={e => { const u = [...deliveryForm.faqs]; u[idx] = {...u[idx], answer: e.target.value}; setDeliveryForm({...deliveryForm, faqs: u}); }} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white" rows={2} placeholder="Answer" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="p-5 bg-green-50 border border-green-100 rounded-xl space-y-3">
                            <h4 className="font-bold text-green-800">Contact / CTA Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="text" value={deliveryForm.contactPhone} onChange={e => setDeliveryForm({...deliveryForm, contactPhone: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 bg-white" placeholder="+977 9820151085" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="text" value={deliveryForm.contactEmail} onChange={e => setDeliveryForm({...deliveryForm, contactEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 bg-white" placeholder="support@silver6.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Hours</label>
                                    <input type="text" value={deliveryForm.contactHours} onChange={e => setDeliveryForm({...deliveryForm, contactHours: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 bg-white" placeholder="9 AM – 6 PM, Sun–Fri" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- HERO SECTION --- */}
                {activeTab === 'hero' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Hero Section Management</h3>
                            <button onClick={async () => {
                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                try {
                                    const res = await fetch('http://localhost:1000/api/hero', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify(heroForm)
                                    });
                                    if (res.ok) toast.success('Hero section updated');
                                    else toast.error('Failed to update hero section');
                                } catch (err) { toast.error('Server error'); }
                            }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label><input type="text" value={heroForm.badge} onChange={e => setHeroForm({...heroForm, badge: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label><textarea value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" rows={3} /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={heroForm.description} onChange={e => setHeroForm({...heroForm, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" rows={3} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Button 1 Text</label><input type="text" value={heroForm.button1Text} onChange={e => setHeroForm({...heroForm, button1Text: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Button 1 Link</label><input type="text" value={heroForm.button1Link} onChange={e => setHeroForm({...heroForm, button1Link: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Button 2 Text</label><input type="text" value={heroForm.button2Text} onChange={e => setHeroForm({...heroForm, button2Text: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Button 2 Link</label><input type="text" value={heroForm.button2Link} onChange={e => setHeroForm({...heroForm, button2Link: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Value</label><input type="text" value={heroForm.stat1Value} onChange={e => setHeroForm({...heroForm, stat1Value: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Label</label><input type="text" value={heroForm.stat1Label} onChange={e => setHeroForm({...heroForm, stat1Label: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Value</label><input type="text" value={heroForm.stat2Value} onChange={e => setHeroForm({...heroForm, stat2Value: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Label</label><input type="text" value={heroForm.stat2Label} onChange={e => setHeroForm({...heroForm, stat2Label: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 3 Value</label><input type="text" value={heroForm.stat3Value} onChange={e => setHeroForm({...heroForm, stat3Value: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stat 3 Label</label><input type="text" value={heroForm.stat3Label} onChange={e => setHeroForm({...heroForm, stat3Label: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image (Cloudinary)</label>
                                    <input type="file" accept="image/*" onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const toastId = toast.loading('Uploading image...');
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await fetch(`http://localhost:1000/api/upload`, { method: 'POST', body: formData });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    setHeroForm({ ...heroForm, image: data.image });
                                                    toast.success('Image uploaded!', { id: toastId });
                                                } else throw new Error(data.message || 'Upload failed');
                                            } catch (err: any) { toast.error(`Upload error: ${err.message}`, { id: toastId }); }
                                        }
                                    }} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] text-sm" />
                                    {heroForm.image && (
                                        <div className="mt-2 w-full h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2 overflow-hidden">
                                            <img src={heroForm.image} alt="Hero" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- CATEGORIES --- */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Top Categories Management</h3>
                            <button onClick={() => { setEditCategory(null); setCategoryForm({ name: '', bgColor: '#79b29c', image: '' }); setIsCategoryModalOpen(true); }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Category
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories.map(cat => (
                                <div key={cat._id} className="relative flex flex-col items-center justify-center h-32 rounded-xl group overflow-hidden shadow-sm hover:-translate-y-1 transition-transform" style={{ backgroundColor: cat.bgColor }}>
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    ) : null}
                                    <span className="font-bold text-white z-10 drop-shadow-sm">{cat.name}</span>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button onClick={() => { setEditCategory(cat); setCategoryForm({ name: cat.name, bgColor: cat.bgColor, image: cat.image || '' }); setIsCategoryModalOpen(true); }} className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                                        <button onClick={async () => {
                                            if (confirm('Delete this category?')) {
                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                const res = await fetch(`http://localhost:1000/api/categories/${cat._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                                                if (res.ok) { toast.success('Category deleted'); fetchCategories(); }
                                            }
                                        }} className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No categories found. Click 'Add Category' to create one.
                                </div>
                            )}
                        </div>

                        {/* Category Modal */}
                        {isCategoryModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
                                        <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="e.g. Oil" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={categoryForm.bgColor} onChange={e => setCategoryForm({ ...categoryForm, bgColor: e.target.value })} className="w-12 h-10 border-0 rounded cursor-pointer p-0 bg-transparent" />
                                                <input type="text" value={categoryForm.bgColor} onChange={e => setCategoryForm({ ...categoryForm, bgColor: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] font-mono text-sm uppercase" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image (Cloudinary)</label>
                                            <input type="file" accept="image/*" onChange={async e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const toastId = toast.loading('Uploading image...');
                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    try {
                                                        const res = await fetch(`http://localhost:1000/api/upload`, {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        const data = await res.json();
                                                        if (res.ok) {
                                                            setCategoryForm({ ...categoryForm, image: data.image });
                                                            toast.success('Image uploaded!', { id: toastId });
                                                        } else {
                                                            throw new Error(data.message || 'Upload failed');
                                                        }
                                                    } catch (err: any) {
                                                        toast.error(`Upload error: ${err.message}`, { id: toastId });
                                                    }
                                                }
                                            }} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] text-sm" />
                                            {categoryForm.image && (
                                                <div className="mt-2 w-full h-32 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                    <img src={categoryForm.image} alt="Preview" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 flex justify-end gap-3">
                                            <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                            <button onClick={async () => {
                                                if (!categoryForm.name) return toast.error('Name is required');
                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                const url = editCategory ? `http://localhost:1000/api/categories/${editCategory._id}` : 'http://localhost:1000/api/categories';
                                                const method = editCategory ? 'PUT' : 'POST';
                                                
                                                try {
                                                    const res = await fetch(url, {
                                                        method,
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                        body: JSON.stringify(categoryForm)
                                                    });
                                                    if (res.ok) {
                                                        toast.success(editCategory ? 'Category updated' : 'Category created');
                                                        setIsCategoryModalOpen(false);
                                                        fetchCategories();
                                                    } else {
                                                        const errData = await res.json();
                                                        toast.error(errData.message || 'Failed to save category');
                                                    }
                                                } catch (err) {
                                                    toast.error('Server error');
                                                }
                                            }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Category</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- BANNERS --- */}
                {activeTab === 'banners' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Ads Banners Management</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Banner
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {banners.map(banner => (
                                <div key={banner.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm group">
                                    <div className="h-32 bg-gray-100 flex flex-col items-center justify-center text-gray-400 relative">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs">{banner.image}</span>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900">{banner.title}</h4>
                                        <p className="text-xs text-blue-500 truncate mt-1">Link: {banner.link}</p>
                                        <div className="mt-3">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {banner.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- FAQS --- */}
                {activeTab === 'faqs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-3">
                            {faqs.map(faq => (
                                <div key={faq.id} className="p-4 border border-gray-200 rounded-xl flex justify-between gap-4 hover:border-blue-300 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Q: {faq.question}</h4>
                                        <p className="text-gray-600 text-sm mt-1">A: {faq.answer}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                        <button className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIDEO REVIEWS --- */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Video Reviews</h3>
                            <button onClick={() => { setReviewForm({ name: '', description: '', thumbnail: '', youtubeLink: '' }); setIsReviewModalOpen(true); }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Review
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map(review => (
                                <div key={review._id} className="border border-gray-200 rounded-xl overflow-hidden flex bg-white shadow-sm">
                                    <div className="w-1/3 bg-gray-100 relative aspect-video md:aspect-auto">
                                        <img src={review.thumbnail} className="absolute inset-0 w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 truncate pr-2">{review.name}</h4>
                                                <button onClick={async () => {
                                                    if (confirm('Delete this review?')) {
                                                        const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                        const res = await fetch(`http://localhost:1000/api/reviews/${review._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                                                        if (res.ok) { toast.success('Review deleted'); fetchReviews(); }
                                                    }
                                                }} className="text-gray-400 hover:text-red-600 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">{review.description}</p>
                                        </div>
                                        <a href={review.youtubeLink} target="_blank" className="text-xs text-blue-600 hover:underline mt-2 inline-block truncate">{review.youtubeLink}</a>
                                    </div>
                                </div>
                            ))}
                            {reviews.length === 0 && (
                                <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No reviews found. Click 'Add Review' to create one.
                                </div>
                            )}
                        </div>

                        {/* Review Modal */}
                        {isReviewModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900">Add Video Review</h2>
                                        <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                            <input type="text" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Description</label>
                                            <textarea value={reviewForm.description} onChange={e => setReviewForm({ ...reviewForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
                                            <input type="url" value={reviewForm.youtubeLink} onChange={e => setReviewForm({ ...reviewForm, youtubeLink: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="https://youtube.com/watch?v=..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail (Cloudinary)</label>
                                            <input type="file" accept="image/*" onChange={async e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const toastId = toast.loading('Uploading thumbnail...');
                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    try {
                                                        const res = await fetch(`http://localhost:1000/api/upload`, { method: 'POST', body: formData });
                                                        const data = await res.json();
                                                        if (res.ok) {
                                                            setReviewForm({ ...reviewForm, thumbnail: data.image });
                                                            toast.success('Thumbnail uploaded!', { id: toastId });
                                                        } else throw new Error(data.message || 'Upload failed');
                                                    } catch (err: any) { toast.error(`Upload error: ${err.message}`, { id: toastId }); }
                                                }
                                            }} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a] text-sm" />
                                            {reviewForm.thumbnail && (
                                                <div className="mt-2 w-full h-32 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                    <img src={reviewForm.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 flex justify-end gap-3">
                                            <button onClick={() => setIsReviewModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                            <button onClick={async () => {
                                                if (!reviewForm.name || !reviewForm.thumbnail || !reviewForm.youtubeLink) return toast.error('Please fill all required fields');
                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                try {
                                                    const res = await fetch('http://localhost:1000/api/reviews', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                        body: JSON.stringify(reviewForm)
                                                    });
                                                    if (res.ok) {
                                                        toast.success('Review added');
                                                        setIsReviewModalOpen(false);
                                                        fetchReviews();
                                                    } else {
                                                        toast.error('Failed to add review');
                                                    }
                                                } catch (err) { toast.error('Server error'); }
                                            }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Review</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- CONTACTS --- */}
                {activeTab === 'contacts' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Contact & Queries</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                    <tr>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Name & Email</th>
                                        <th className="p-4 font-medium">Message</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contacts.map(contact => (
                                        <tr key={contact.id} className="hover:bg-gray-50/50">
                                            <td className="p-4 text-gray-600">{contact.date}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">{contact.name}</div>
                                                <div className="text-gray-500 text-xs">{contact.email}</div>
                                            </td>
                                            <td className="p-4 text-gray-600 max-w-xs truncate">{contact.message}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${contact.status === 'Unread' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {contact.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-blue-600 hover:underline text-xs font-bold">Reply</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- BLOGS --- */}
                {activeTab === 'blogs' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="w-16 h-16 text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Blog Manager</h3>
                        <p className="text-gray-500 mt-2 max-w-md">The blog management system is currently being integrated. Check back later to write and publish articles directly from here.</p>
                        <button className="mt-6 px-6 py-2 bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg font-medium">Create Post (Coming Soon)</button>
                    </div>
                )}

                {/* --- SERVICES --- */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Services Section</h3>
                            <button onClick={() => { setServiceForm({ title: '', description: '', image: '', bgColor: '#f5f6f8', imageBgColor: '#eeb8cd' }); setIsServiceModalOpen(true); }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Service
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.map(svc => (
                                <div key={svc._id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col relative group" style={{backgroundColor: svc.bgColor}}>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 whitespace-pre-line">{svc.title}</h4>
                                        <p className="text-xs text-gray-600 mt-2 whitespace-pre-line">{svc.description}</p>
                                    </div>
                                    <div className="h-32 mt-auto relative" style={{backgroundColor: svc.imageBgColor}}>
                                        <img src={svc.image} className="w-full h-full object-cover object-bottom" />
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={async () => {
                                            if (confirm('Delete this service?')) {
                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                const res = await fetch(`http://localhost:1000/api/services/${svc._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                                                if (res.ok) { toast.success('Deleted'); fetchServices(); }
                                            }
                                        }} className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                            {services.length === 0 && (
                                <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No services added.
                                </div>
                            )}
                        </div>

                        {isServiceModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900">Add Service</h2>
                                        <button onClick={() => setIsServiceModalOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (use \n for line breaks)</label><input type="text" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (use \n for line breaks)</label><textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" rows={2} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Card BG</label><input type="color" value={serviceForm.bgColor} onChange={e => setServiceForm({ ...serviceForm, bgColor: e.target.value })} className="w-full h-10 border rounded-lg" /></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image BG</label><input type="color" value={serviceForm.imageBgColor} onChange={e => setServiceForm({ ...serviceForm, imageBgColor: e.target.value })} className="w-full h-10 border rounded-lg" /></div>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Image (Cloudinary)</label><input type="file" accept="image/*" onChange={async e => {
                                            const file = e.target.files?.[0]; if (file) {
                                                const formData = new FormData(); formData.append('image', file);
                                                const res = await fetch(`http://localhost:1000/api/upload`, { method: 'POST', body: formData });
                                                const data = await res.json();
                                                if (res.ok) setServiceForm({ ...serviceForm, image: data.image });
                                            }
                                        }} className="w-full text-sm" /></div>
                                        <div className="pt-4 flex justify-end gap-3">
                                            <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
                                            <button onClick={async () => {
                                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                                const res = await fetch('http://localhost:1000/api/services', {
                                                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                    body: JSON.stringify(serviceForm)
                                                });
                                                if (res.ok) { toast.success('Added'); setIsServiceModalOpen(false); fetchServices(); }
                                            }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- FOOTER --- */}
                {activeTab === 'footer' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Footer Settings</h3>
                            <button onClick={async () => {
                                const token = JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
                                const res = await fetch('http://localhost:1000/api/footer', {
                                    method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify(footerForm)
                                });
                                if (res.ok) toast.success('Footer updated');
                            }} className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#259b3f] flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Footer
                            </button>
                        </div>
                        <div className="space-y-6">
                            {/* Brand Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Description</label>
                                <textarea value={footerForm.brandDescription} onChange={e => setFooterForm({...footerForm, brandDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" rows={4} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                                <input type="text" value={footerForm.copyrightText} onChange={e => setFooterForm({...footerForm, copyrightText: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                            </div>

                            {/* Link Sections */}
                            {([
                                { key: 'aboutUsLinks', label: 'About Us Links' },
                                { key: 'socialMediaLinks', label: 'Social Media Links' },
                                { key: 'helpLinks', label: 'Help Links' },
                            ] as { key: 'aboutUsLinks' | 'socialMediaLinks' | 'helpLinks', label: string }[]).map(({ key, label }) => (
                                <div key={key} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-sm text-gray-800">{label}</h4>
                                        <button
                                            type="button"
                                            onClick={() => setFooterForm({ ...footerForm, [key]: [...(footerForm[key] || []), { label: '', url: '' }] })}
                                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#2db34a] text-white rounded-lg hover:bg-[#259b3f] transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Link
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(footerForm[key] || []).length === 0 && (
                                            <p className="text-xs text-gray-400 italic">No links added yet.</p>
                                        )}
                                        {(footerForm[key] || []).map((link: {label: string, url: string}, idx: number) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={e => {
                                                        const updated = [...footerForm[key]];
                                                        updated[idx] = { ...updated[idx], label: e.target.value };
                                                        setFooterForm({ ...footerForm, [key]: updated });
                                                    }}
                                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white"
                                                    placeholder="Label (e.g. Facebook)"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={e => {
                                                        const updated = [...footerForm[key]];
                                                        updated[idx] = { ...updated[idx], url: e.target.value };
                                                        setFooterForm({ ...footerForm, [key]: updated });
                                                    }}
                                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2db34a] bg-white"
                                                    placeholder="URL (e.g. https://fb.com/...)"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...footerForm[key]];
                                                        updated.splice(idx, 1);
                                                        setFooterForm({ ...footerForm, [key]: updated });
                                                    }}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
