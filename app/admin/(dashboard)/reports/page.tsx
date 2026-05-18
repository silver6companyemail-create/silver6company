'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Package, Tag, Percent, Truck, Download, Filter, Search, Calendar, ChevronDown } from 'lucide-react'

// --- Mock Data ---

const REPORT_TABS = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'lead', label: 'Lead Report', icon: Users },
    { id: 'expense', label: 'Expense Report', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'coupon', label: 'Coupon Report', icon: Tag },
    { id: 'offer', label: 'Offer Report', icon: Percent },
    { id: 'rider', label: 'Rider Performance Report', icon: Truck },
]

export default function Reports() {
    const [activeTab, setActiveTab] = useState('sales')

    // Dummy Chart Bars for visuals
    const dummyChartHeights = [40, 70, 45, 90, 65, 80, 55, 100, 85, 60, 75, 50]
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                    <p className="text-gray-500 mt-0.5">Generate, view, and export comprehensive business reports.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Last 30 Days</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    <button className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Main Layout: Sidebar Tabs + Content Area */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Vertical Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1">
                        {REPORT_TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left ${
                                    activeTab === tab.id 
                                        ? 'bg-green-50 text-[#2db34a]' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#2db34a]' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
                    
                    {/* --- SALES REPORT --- */}
                    {activeTab === 'sales' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Sales Report</h3>
                                <p className="text-sm text-gray-500">Overview of total revenue and sales trends.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">Rs. 8,450,000</p>
                                    <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +14.5% vs last month
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                    <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">1,245</p>
                                    <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +8.2% vs last month
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                    <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">Rs. 6,787</p>
                                </div>
                            </div>

                            {/* Chart Mock */}
                            <div className="h-64 mt-6 border-b border-l border-gray-200 flex items-end justify-between px-2 pb-2 pt-6 relative">
                                <div className="absolute top-0 left-2 text-xs text-gray-400">Revenue (Millions)</div>
                                {dummyChartHeights.map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                                        <div 
                                            className="w-1/2 bg-[#2db34a] rounded-t-sm hover:bg-[#24943c] transition-colors cursor-pointer" 
                                            style={{ height: `${h}%` }}
                                            title={`Rs. ${(h * 80000).toLocaleString()}`}
                                        ></div>
                                        <span className="text-xs text-gray-500">{months[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- LEAD REPORT --- */}
                    {activeTab === 'lead' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Lead Report</h3>
                                <p className="text-sm text-gray-500">Tracking customer acquisition and conversion rates.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Leads', value: '4,521', trend: '+12%' },
                                    { label: 'Contacted', value: '3,100', trend: '+5%' },
                                    { label: 'Converted', value: '845', trend: '+18%' },
                                    { label: 'Conversion Rate', value: '18.6%', trend: '+2.1%' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                                        <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-green-600 font-medium mt-1">{stat.trend}</p>
                                    </div>
                                ))}
                            </div>

                            <table className="w-full text-left mt-6 border-t border-gray-100">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Source</th>
                                        <th className="p-4 font-medium">Total Leads</th>
                                        <th className="p-4 font-medium">Converted</th>
                                        <th className="p-4 font-medium">Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Facebook Ads</td>
                                        <td className="p-4 text-gray-600">2,100</td>
                                        <td className="p-4 text-gray-600">450</td>
                                        <td className="p-4 text-green-600 font-bold">21.4%</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Organic Search</td>
                                        <td className="p-4 text-gray-600">1,500</td>
                                        <td className="p-4 text-gray-600">300</td>
                                        <td className="p-4 text-green-600 font-bold">20.0%</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Referrals</td>
                                        <td className="p-4 text-gray-600">921</td>
                                        <td className="p-4 text-gray-600">95</td>
                                        <td className="p-4 text-orange-600 font-bold">10.3%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- EXPENSE REPORT --- */}
                    {activeTab === 'expense' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Expense Report</h3>
                                <p className="text-sm text-gray-500">Breakdown of operational costs and outgoing cash flow.</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-red-600 font-medium uppercase tracking-wider">Total Expenses (YTD)</p>
                                    <h4 className="text-3xl font-bold text-red-700 mt-1">Rs. 3,250,000</h4>
                                </div>
                                <BarChart3 className="w-12 h-12 text-red-200" />
                            </div>
                            
                            <h4 className="font-bold text-gray-900 mt-8 mb-4">Top Expense Categories</h4>
                            <div className="space-y-4">
                                {[
                                    { cat: 'Inventory Purchases', amount: 'Rs. 1,500,000', pct: '46%' },
                                    { cat: 'Payroll & Salaries', amount: 'Rs. 850,000', pct: '26%' },
                                    { cat: 'Marketing Ads', amount: 'Rs. 400,000', pct: '12%' },
                                    { cat: 'Logistics & Fuel', amount: 'Rs. 300,000', pct: '9%' },
                                    { cat: 'Office Rent & Misc', amount: 'Rs. 200,000', pct: '7%' },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{item.cat}</span>
                                            <span className="font-bold text-gray-900">{item.amount}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-red-400 h-2 rounded-full" style={{ width: item.pct }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- INVENTORY REPORT --- */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Inventory Report</h3>
                                <p className="text-sm text-gray-500">Current stock valuation and low stock alerts.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                                    <p className="text-sm text-blue-600 font-medium">Total Inventory Value</p>
                                    <h4 className="text-2xl font-bold text-blue-900 mt-1">Rs. 5,420,000</h4>
                                </div>
                                <div className="p-5 rounded-xl bg-orange-50 border border-orange-100">
                                    <p className="text-sm text-orange-600 font-medium">Items Low on Stock</p>
                                    <h4 className="text-2xl font-bold text-orange-900 mt-1">14 items</h4>
                                </div>
                            </div>

                            <table className="w-full text-left mt-6">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Product Name</th>
                                        <th className="p-4 font-medium text-center">Current Stock</th>
                                        <th className="p-4 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Wireless Earbuds V2</td>
                                        <td className="p-4 text-center font-bold text-red-600">5</td>
                                        <td className="p-4 text-center"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Critical</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Smart Watch Pro</td>
                                        <td className="p-4 text-center font-bold text-orange-600">12</td>
                                        <td className="p-4 text-center"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">Low Stock</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-gray-900">Gaming Mouse RGB</td>
                                        <td className="p-4 text-center font-bold text-gray-600">45</td>
                                        <td className="p-4 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Healthy</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- RIDER PERFORMANCE REPORT --- */}
                    {activeTab === 'rider' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Rider Performance Report</h3>
                                <p className="text-sm text-gray-500">Track delivery rates, assigned orders, and completion status.</p>
                            </div>

                            {/* Search Rider */}
                            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-6">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="Search Rider Name (e.g. Bishal Ale Magar)" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-[#2db34a] focus:ring-[#2db34a]" />
                                </div>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Search</button>
                            </div>

                            {/* Mock Dashboard matching screenshot 3 */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                            <Truck className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Bishal Ale Magar</h4>
                                            <p className="text-sm text-gray-500">Samakhusi gangbusters ranibari</p>
                                            <p className="text-xs text-gray-500 mt-1">Role: Delivery Person | Contact: 9712600003</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Assigned</p>
                                            <p className="text-2xl font-bold text-gray-900">1379</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Delivered</p>
                                            <p className="text-2xl font-bold text-[#2db34a]">1125</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Delivery Rate</p>
                                            <p className="text-2xl font-bold text-blue-600">82%</p>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-sm">
                                    <thead className="bg-gray-100 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="p-3">SN</th>
                                            <th className="p-3">Order ID</th>
                                            <th className="p-3">Customer Name</th>
                                            <th className="p-3">Order Date</th>
                                            <th className="p-3">Total Amount</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-xs">
                                        {[
                                            { sn: 1, id: 'ORD-20260517-0305', name: 'Sangita Bhandari', date: '2026-05-17', amt: 'Rs. 2,300', status: 'Assigned' },
                                            { sn: 2, id: 'ORD-20260517-0303', name: 'Sabina Lama', date: '2026-05-17', amt: 'Rs. 4,100', status: 'Assigned' },
                                            { sn: 3, id: 'ORD-20260517-0299', name: 'Tez', date: '2026-05-17', amt: 'Rs. 2,100', status: 'Delivered' },
                                            { sn: 4, id: 'ORD-20260517-0286', name: 'Nirmala', date: '2026-05-17', amt: 'Rs. 1,100', status: 'Assigned' },
                                            { sn: 5, id: 'ORD-20260517-0259', name: 'Niryansh', date: '2026-05-17', amt: 'Rs. 1,100', status: 'Assigned' },
                                        ].map(row => (
                                            <tr key={row.sn} className="hover:bg-gray-50">
                                                <td className="p-3 text-gray-500">{row.sn}</td>
                                                <td className="p-3 font-medium text-blue-600">{row.id}</td>
                                                <td className="p-3 text-gray-900">{row.name}</td>
                                                <td className="p-3 text-gray-500">{row.date}</td>
                                                <td className="p-3 text-gray-900 font-medium">{row.amt}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- COUPONS / OFFERS REPORT --- */}
                    {(activeTab === 'coupon' || activeTab === 'offer') && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {activeTab === 'coupon' ? <Tag className="w-16 h-16 text-gray-200 mb-4" /> : <Percent className="w-16 h-16 text-gray-200 mb-4" />}
                            <h3 className="text-xl font-bold text-gray-900">{activeTab === 'coupon' ? 'Coupon Usage Report' : 'Promotional Offers Report'}</h3>
                            <p className="text-gray-500 mt-2 max-w-md">Detailed metrics on discount utilization, redemption rates, and impact on gross sales will appear here.</p>
                            <button className="mt-6 px-6 py-2 bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg font-medium">Generate Custom Report</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
