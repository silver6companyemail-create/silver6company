'use client'

import { useState } from 'react'
import { Video, Image as ImageIcon, Clapperboard, Calendar, Filter, Plus, Upload, CheckCircle2, Clock, MoreVertical, PlayCircle, BarChart3, FileVideo, HardDrive, Download, X } from 'lucide-react'

// --- Mock Data ---
interface Asset {
    id: string
    title: string
    type: 'Video' | 'Graphic'
    editor: string
    date: string // YYYY-MM-DD
    status: 'Published' | 'Approved' | 'In Review' | 'Draft'
    duration?: string
}

const initialAssets: Asset[] = [
    { id: 'a1', title: 'Summer Collection Promo', type: 'Video', editor: 'Alex R.', date: new Date().toISOString().split('T')[0], status: 'In Review', duration: '0:45' },
    { id: 'a2', title: 'IG Story Templates', type: 'Graphic', editor: 'Sam T.', date: new Date().toISOString().split('T')[0], status: 'Approved' },
    { id: 'a3', title: 'Product Demo: Smart Watch', type: 'Video', editor: 'Alex R.', date: '2026-05-14', status: 'Published', duration: '1:30' },
    { id: 'a4', title: 'Facebook Ad Variations', type: 'Video', editor: 'Jamie L.', date: '2026-05-10', status: 'Draft', duration: '0:15' },
    { id: 'a5', title: 'Website Hero Banner', type: 'Graphic', editor: 'Sam T.', date: '2026-05-02', status: 'Published' },
    { id: 'a6', title: 'Behind The Scenes Vlog', type: 'Video', editor: 'Alex R.', date: '2026-04-28', status: 'Published', duration: '5:20' },
]

const performanceReports = [
    { editor: 'Alex R.', role: 'Lead Video Editor', videosCompleted: 14, graphicsCompleted: 0, avgTurnaround: '1.5 days' },
    { editor: 'Sam T.', role: 'Graphic Designer', videosCompleted: 2, graphicsCompleted: 35, avgTurnaround: '4 hours' },
    { editor: 'Jamie L.', role: 'Motion Editor', videosCompleted: 8, graphicsCompleted: 5, avgTurnaround: '2 days' },
]

export default function CreativeDepart() {
    const [activeTab, setActiveTab] = useState<'library' | 'reports'>('library')
    const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all')
    const [assets, setAssets] = useState<Asset[]>(initialAssets)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    
    // Upload Form State
    const [newAsset, setNewAsset] = useState({ title: '', type: 'Video', editor: '', status: 'Draft' as any, duration: '' })

    // Filtering Logic
    const today = new Date()
    const filterAssets = () => {
        if (timeFilter === 'all') return assets

        return assets.filter(asset => {
            const assetDate = new Date(asset.date)
            const diffTime = Math.abs(today.getTime() - assetDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (timeFilter === 'daily') return diffDays <= 1
            if (timeFilter === 'weekly') return diffDays <= 7
            if (timeFilter === 'monthly') return diffDays <= 30
            return true
        })
    }

    const filteredAssets = filterAssets()

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const asset: Asset = {
            id: `a${Date.now()}`,
            title: newAsset.title,
            type: newAsset.type as 'Video' | 'Graphic',
            editor: newAsset.editor,
            date: new Date().toISOString().split('T')[0], // Today
            status: newAsset.status,
            duration: newAsset.type === 'Video' ? newAsset.duration : undefined
        }
        setAssets([asset, ...assets])
        setIsUploadModalOpen(false)
        setNewAsset({ title: '', type: 'Video', editor: '', status: 'Draft', duration: '' })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Creative Department</h2>
                    <p className="text-gray-500 mt-0.5">Manage video edits, design assets, and track team performance.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload Asset
                </button>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                        <FileVideo className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Videos Edited (MTD)</p>
                        <h3 className="text-2xl font-bold text-gray-900">24</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Graphics (MTD)</p>
                        <h3 className="text-2xl font-bold text-gray-900">40</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {assets.filter(a => a.status === 'In Review').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Storage Used</p>
                        <h3 className="text-2xl font-bold text-gray-900">4.2 TB</h3>
                    </div>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === 'library'
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Clapperboard className="w-4 h-4" />
                        Asset Library
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === 'reports'
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Performance Reports
                    </button>
                </nav>

                {activeTab === 'library' && (
                    <div className="flex items-center gap-2 pr-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as any)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#2db34a] focus:border-[#2db34a] block w-full p-2 outline-none"
                        >
                            <option value="all">All Time</option>
                            <option value="daily">Today (Daily)</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                
                {/* LIBRARY TAB */}
                {activeTab === 'library' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAssets.map(asset => (
                            <div key={asset.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                {/* Thumbnail Area */}
                                <div className="aspect-video bg-gray-100 relative flex items-center justify-center border-b border-gray-100 overflow-hidden">
                                    {asset.type === 'Video' ? (
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            <PlayCircle className="w-12 h-12 text-white opacity-80 shadow-sm rounded-full bg-black/20" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            <ImageIcon className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                    {/* Duration Badge */}
                                    {asset.type === 'Video' && asset.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {asset.duration}
                                        </div>
                                    )}
                                </div>
                                {/* Card Body */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1" title={asset.title}>{asset.title}</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                        {asset.type === 'Video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                                        <span>{asset.type}</span>
                                        <span>•</span>
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{asset.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {asset.editor.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{asset.editor}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            asset.status === 'Published' ? 'bg-green-100 text-green-700' :
                                            asset.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                            asset.status === 'In Review' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {asset.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {filteredAssets.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-300">
                                <Clapperboard className="w-12 h-12 text-gray-300 mb-3" />
                                <h3 className="text-lg font-bold text-gray-900">No assets found</h3>
                                <p className="text-gray-500 mt-1 max-w-sm">There are no edited videos or graphics matching your selected timeframe.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* REPORTS TAB */}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Creative Team Throughput</h3>
                                <p className="text-sm text-gray-500">Monthly breakdown of delivered assets by editor.</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download Report
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-y border-gray-100 text-sm text-gray-500">
                                    <tr>
                                        <th className="p-4 font-medium">Team Member</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium text-center">Videos Completed</th>
                                        <th className="p-4 font-medium text-center">Graphics Completed</th>
                                        <th className="p-4 font-medium">Avg. Turnaround</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {performanceReports.map((report, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#2db34a]/10 text-[#2db34a] flex items-center justify-center font-bold">
                                                        {report.editor.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{report.editor}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{report.role}</td>
                                            <td className="p-4 text-center">
                                                <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-bold">
                                                    {report.videosCompleted}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold">
                                                    {report.graphicsCompleted}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-900 font-medium">{report.avgTurnaround}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Upload New Asset</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Title</label>
                                <input required type="text" value={newAsset.title} onChange={e => setNewAsset({ ...newAsset, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" placeholder="e.g. Winter Promo Video" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                                    <select value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        <option value="Video">Video</option>
                                        <option value="Graphic">Graphic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Editor Name</label>
                                    <input required type="text" value={newAsset.editor} onChange={e => setNewAsset({ ...newAsset, editor: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" placeholder="Your Name" />
                                </div>
                            </div>
                            {newAsset.type === 'Video' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (MM:SS)</label>
                                    <input type="text" value={newAsset.duration} onChange={e => setNewAsset({ ...newAsset, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" placeholder="0:45" />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                                <select value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                    <option value="Draft">Draft / Editing</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#2db34a] hover:text-[#24943c] focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">MP4, MOV, PNG up to 500MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Upload Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}