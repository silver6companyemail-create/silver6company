'use client'

import { useState, useEffect } from 'react'
import {
  Target,
  Plus,
  Search,
  SlidersHorizontal,
  DollarSign,
  Mail,
  Phone,
  Briefcase,
  ChevronRight,
  TrendingUp,
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  value: string
  product: string
  status: 'New Idea' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Closed Won (Converted)' | 'Closed Lost'
  campaign: string
  createdAt: string
}

export default function LeadsCRM() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    value: '',
    product: '',
    status: 'New Idea' as Lead['status'],
    campaign: ''
  })

  // Initial Mock Data
  const defaultLeads: Lead[] = [
    { id: '1', name: 'Apex Retail Corporation', email: 'acquisitions@apexretail.com', phone: '+1 (555) 938-2049', value: '14500', product: 'Premium Ad Campaign', status: 'Proposal Sent', campaign: 'Q2 Retail Push', createdAt: '2026-05-18' },
    { id: '2', name: 'Acuity Tech Group', email: 'partners@acuity.tech', phone: '+1 (555) 438-9281', value: '9200', product: 'Corporate Intro Video', status: 'Negotiation', campaign: 'Tech Series 2026', createdAt: '2026-05-19' },
    { id: '3', name: 'Cloudify Systems LLC', email: 'marketing@cloudify.io', phone: '+1 (555) 129-3849', value: '22000', product: 'Product Explainer Animation', status: 'Contacted', campaign: 'Cloud Rollout', createdAt: '2026-05-20' },
    { id: '4', name: 'E-com Brand Builders', email: 'sales@ecombrands.co', phone: '+1 (555) 726-3840', value: '5500', product: 'Product Showcase Reels', status: 'Closed Won (Converted)', campaign: 'Reels Bundle Spec', createdAt: '2026-05-15' },
    { id: '5', name: 'SaaS Suite Inc.', email: 'billing@saassuite.net', phone: '+1 (555) 902-3847', value: '12000', product: 'Enterprise Hub Onboarding Video', status: 'New Idea', campaign: 'SaaS Launch Pack', createdAt: '2026-05-21' }
  ]

  // Load and cache leads in localStorage
  useEffect(() => {
    const cached = localStorage.getItem('salesLeads')
    if (cached) {
      try {
        setLeads(JSON.parse(cached))
      } catch (e) {
        setLeads(defaultLeads)
      }
    } else {
      setLeads(defaultLeads)
      localStorage.setItem('salesLeads', JSON.stringify(defaultLeads))
    }
  }, [])

  const saveLeads = (updated: Lead[]) => {
    setLeads(updated)
    localStorage.setItem('salesLeads', JSON.stringify(updated))
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.value) {
      toast.error("Please enter a valid client name and contract value")
      return
    }

    const newLead: Lead = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      value: formData.value,
      product: formData.product || 'Standard Creative Plan',
      status: formData.status,
      campaign: formData.campaign || 'Direct Pitch Campaign',
      createdAt: new Date().toISOString().split('T')[0]
    }

    const updated = [newLead, ...leads]
    saveLeads(updated)
    setIsAddOpen(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      value: '',
      product: '',
      status: 'New Idea',
      campaign: ''
    })
    toast.success("Lead registered successfully in CRM!")
  }

  // Transition Lead Status
  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    saveLeads(updated)
    toast.success(`Lead moved to ${newStatus}`)
  }

  // Remove Lead from CRM
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this lead?")) {
      const updated = leads.filter(l => l.id !== id)
      saveLeads(updated)
      toast.success("Lead removed from pipeline")
    }
  }

  // Filters and Searching logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Style helpers for pipeline badges
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Closed Won (Converted)': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Closed Lost': return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'Negotiation': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Proposal Sent': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Contacted': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search leads, pitch products, or campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm pl-11 pr-4 py-2.5 rounded-xl transition-shadow text-slate-800 font-medium placeholder-slate-400"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-650 focus:outline-none cursor-pointer"
            >
              <option value="All">All Funnel Stages</option>
              <option value="New Idea">New Ideas</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won (Converted)">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 flex items-center gap-2 transition-transform duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Log New Deal
          </button>
        </div>

      </div>

      {/* Leads CRM Table / Cards View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-350 shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-extrabold text-slate-800 text-sm">CRM pipeline is empty</h4>
              <p className="text-xs text-slate-400">There are no leads matching your current filters. Add a new prospect to begin tracking.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">
                  <th className="px-6 py-4">Client / Company Name</th>
                  <th className="px-6 py-4">Est. Contract Value</th>
                  <th className="px-6 py-4">Pitch Plan</th>
                  <th className="px-6 py-4">Funnel Stage</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Name & Date */}
                    <td className="px-6 py-4.5">
                      <div className="space-y-1 max-w-[200px]">
                        <p className="font-extrabold text-slate-800 truncate">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200/50 uppercase tracking-wider">{lead.campaign}</span>
                          <span>Logged: {lead.createdAt}</span>
                        </div>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center text-slate-900 font-extrabold text-sm">
                        <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                        {parseFloat(lead.value).toLocaleString()}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4.5 font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{lead.product}</span>
                      </div>
                    </td>

                    {/* Funnel Status Selector */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                          className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-md border focus:outline-none cursor-pointer hover:shadow-sm transition-shadow ${getStatusBadge(lead.status)}`}
                        >
                          <option value="New Idea">New Idea</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Closed Won (Converted)">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4.5">
                      <div className="space-y-1 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {lead.phone}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => {
                            if (lead.status !== 'Closed Won (Converted)') {
                              handleStatusChange(lead.id, 'Closed Won (Converted)')
                            } else {
                              toast("Lead already converted!", { icon: '🤝' })
                            }
                          }}
                          title="Mark Converted"
                          className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          title="Remove Lead"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add New Lead Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                <span className="font-extrabold text-sm text-slate-800">Add Prospective CRM Client</span>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name / Business Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Apex Retail Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email"
                    placeholder="client@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                  <input 
                    type="text"
                    placeholder="+1 (555) 938-2049"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deal Value (USD)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 14500"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Pitch Product</label>
                  <input 
                    type="text"
                    placeholder="e.g. Corporate Ad Bundle"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Funnel Stage</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as Lead['status']})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="New Idea">New Idea</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won (Converted)">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign Origin</label>
                  <input 
                    type="text"
                    placeholder="e.g. Q2 Retail Push"
                    value={formData.campaign}
                    onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs px-3.5 py-2.5 rounded-xl transition-shadow text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold px-5 py-2 rounded-xl shadow-md shadow-emerald-500/15 transition-all"
                >
                  Save Lead
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
