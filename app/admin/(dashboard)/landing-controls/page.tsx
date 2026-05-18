'use client'

import { useState } from 'react'
import { LayoutTemplate, MessageSquare, HelpCircle, FileText, Mail, Plus, Trash2, Edit, ImageIcon, Save } from 'lucide-react'

export default function LandingControls() {
    const [activeTab, setActiveTab] = useState<'banners' | 'blogs' | 'testimonials' | 'faqs' | 'contacts'>('banners')

    // Mock Data States
    const [banners, setBanners] = useState([
        { id: 1, title: 'Summer Sale', image: 'summer-banner.jpg', link: '/category/summer', status: 'Active' },
        { id: 2, title: 'New Arrivals', image: 'new-arr.png', link: '/new', status: 'Draft' },
    ])

    const [faqs, setFaqs] = useState([
        { id: 1, question: 'How long does delivery take?', answer: 'Inside valley: 24hrs. Outside: 3-5 days.' },
        { id: 2, question: 'Do you offer refunds?', answer: 'Yes, within 7 days of purchase for unused items.' },
    ])

    const [testimonials, setTestimonials] = useState([
        { id: 1, name: 'Sarsawoti', text: 'Amazing service and very fast delivery.', rating: 5 },
        { id: 2, name: 'Sudip', text: 'Products exactly as described!', rating: 4 },
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
                        { id: 'banners', label: 'Ads Banners', icon: LayoutTemplate },
                        { id: 'blogs', label: 'Blogs', icon: FileText },
                        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
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

                {/* --- TESTIMONIALS --- */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Customer Testimonials</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Testimonial
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {testimonials.map(test => (
                                <div key={test.id} className="p-4 border border-gray-200 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1 text-yellow-400">
                                            {[...Array(test.rating)].map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic text-sm mb-3">"{test.text}"</p>
                                    <p className="font-bold text-gray-900 text-sm">- {test.name}</p>
                                </div>
                            ))}
                        </div>
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
            </div>
        </div>
    )
}
