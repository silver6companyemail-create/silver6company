'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, FileText, Users, Plus, WalletCards, CreditCard, Download, Search, X, Truck, Upload, ImageIcon, Edit } from 'lucide-react'

// --- Mock Data ---
const metrics = {
    revenue: 125000,
    expenses: 82000,
    netProfit: 43000,
    cashOnHand: 56000,
    inflow: 130000,
    outflow: 85000
}

interface Bill {
    id: string
    vendor: string
    amount: number
    date: string
    status: 'Paid' | 'Pending'
    category: string
    hasReceipt: boolean
}

const initialBills: Bill[] = [
    { id: 'b1', vendor: 'Tech Supply Co.', amount: 4500, date: '2026-05-10', status: 'Paid', category: 'Inventory', hasReceipt: true },
    { id: 'b2', vendor: 'Office Space LLC', amount: 3200, date: '2026-05-01', status: 'Paid', category: 'Rent', hasReceipt: true },
    { id: 'b3', vendor: 'Marketing Agency', amount: 1500, date: '2026-05-20', status: 'Pending', category: 'Marketing', hasReceipt: false },
    { id: 'b4', vendor: 'Logistics Partner', amount: 2800, date: '2026-05-25', status: 'Pending', category: 'Shipping', hasReceipt: false },
]

interface Employee {
    id: string
    name: string
    role: string
    salary: number
    lastPaid: string
    status: string
}

const initialEmployees: Employee[] = [
    { id: 'e1', name: 'Alice Johnson', role: 'Content Head', salary: 5000, lastPaid: '2026-04-30', status: 'Paid' },
    { id: 'e2', name: 'Bob Smith', role: 'Sales Manager', salary: 4500, lastPaid: '2026-04-30', status: 'Paid' },
    { id: 'e3', name: 'Charlie Davis', role: 'Delivery Lead', salary: 3800, lastPaid: '2026-04-30', status: 'Paid' },
    { id: 'e4', name: 'Diana Prince', role: 'Customer Support', salary: 3200, lastPaid: '2026-04-30', status: 'Paid' },
]

interface RiderSettlement {
    id: string
    riderName: string
    date: string
    cashCollected: number
    expenses: number
    netSubmitted: number
    status: 'Verified' | 'Pending'
}

const initialSettlements: RiderSettlement[] = [
    { id: 'rs1', riderName: 'John Rider', date: '2026-05-16', cashCollected: 850, expenses: 50, netSubmitted: 800, status: 'Verified' },
    { id: 'rs2', riderName: 'Mike Speed', date: '2026-05-16', cashCollected: 1200, expenses: 100, netSubmitted: 1100, status: 'Pending' },
]

const profitLoss = {
    revenue: [
        { item: 'Product Sales', amount: 110000 },
        { item: 'Service Subscriptions', amount: 15000 }
    ],
    cogs: [
        { item: 'Cost of Products Sold', amount: 40000 },
        { item: 'Shipping & Fulfillment', amount: 12000 }
    ],
    expenses: [
        { item: 'Payroll & Salaries', amount: 16500 },
        { item: 'Rent & Utilities', amount: 4200 },
        { item: 'Marketing & Advertising', amount: 6000 },
        { item: 'Software & Tools', amount: 3300 }
    ]
}

export default function AdminAccounts() {
    const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'payroll' | 'riders' | 'pnl'>('overview')
    
    // Bills State
    const [bills, setBills] = useState<Bill[]>(initialBills)
    const [isBillModalOpen, setIsBillModalOpen] = useState(false)
    const [newBill, setNewBill] = useState({ vendor: '', amount: '', date: '', category: 'Inventory', status: 'Pending' as 'Pending' | 'Paid', receiptFile: null as File | null })

    // Employees State
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
    const [editSalaryAmount, setEditSalaryAmount] = useState('')

    // Rider Settlements State
    const [settlements, setSettlements] = useState<RiderSettlement[]>(initialSettlements)
    const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false)
    const [newSettlement, setNewSettlement] = useState({ riderName: '', date: '', cashCollected: '', expenses: '', status: 'Pending' as 'Pending' | 'Verified' })

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    }

    // --- Handlers ---
    const handleAddBill = (e: React.FormEvent) => {
        e.preventDefault()
        const bill: Bill = {
            id: `b${Date.now()}`,
            vendor: newBill.vendor,
            amount: parseFloat(newBill.amount) || 0,
            date: newBill.date,
            category: newBill.category,
            status: newBill.status,
            hasReceipt: !!newBill.receiptFile
        }
        setBills([bill, ...bills])
        setIsBillModalOpen(false)
        setNewBill({ vendor: '', amount: '', date: '', category: 'Inventory', status: 'Pending', receiptFile: null })
    }

    const handleSaveSalary = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editEmployee) return
        const amount = parseFloat(editSalaryAmount) || editEmployee.salary
        setEmployees(employees.map(emp => emp.id === editEmployee.id ? { ...emp, salary: amount } : emp))
        setEditEmployee(null)
    }

    const handleAddSettlement = (e: React.FormEvent) => {
        e.preventDefault()
        const cash = parseFloat(newSettlement.cashCollected) || 0
        const expenses = parseFloat(newSettlement.expenses) || 0
        const settlement: RiderSettlement = {
            id: `rs${Date.now()}`,
            riderName: newSettlement.riderName,
            date: newSettlement.date,
            cashCollected: cash,
            expenses: expenses,
            netSubmitted: cash - expenses,
            status: newSettlement.status
        }
        setSettlements([settlement, ...settlements])
        setIsSettlementModalOpen(false)
        setNewSettlement({ riderName: '', date: '', cashCollected: '', expenses: '', status: 'Pending' })
    }

    // Calculations
    const totalRevenue = profitLoss.revenue.reduce((acc, curr) => acc + curr.amount, 0)
    const totalCOGS = profitLoss.cogs.reduce((acc, curr) => acc + curr.amount, 0)
    const grossProfit = totalRevenue - totalCOGS
    const totalExpenses = profitLoss.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    const operatingProfit = grossProfit - totalExpenses

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Accounts & Finance</h2>
                    <p className="text-gray-500 mt-0.5">Manage cashflow, bills, employee salaries, and rider settlements.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button
                        onClick={() => setIsBillModalOpen(true)}
                        className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Enter Bill
                    </button>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <WalletCards className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Cash on Hand</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(metrics.cashOnHand)}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue (MTD)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(metrics.revenue)}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses (MTD)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(metrics.expenses)}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Net Profit</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(metrics.netProfit)}</h3>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-6 overflow-x-auto pb-1">
                    {[
                        { id: 'overview', label: 'Overview', icon: WalletCards },
                        { id: 'bills', label: 'Bills & Receipts', icon: FileText },
                        { id: 'payroll', label: 'Employees & Salaries', icon: Users },
                        { id: 'riders', label: 'Rider Daily Settlements', icon: Truck },
                        { id: 'pnl', label: 'Profit & Loss', icon: TrendingUp }
                    ].map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-[#2db34a] text-[#2db34a]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Contents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="border border-gray-100 rounded-xl p-5 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Cash Inflow & Outflow</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">Cash Inflow</span>
                                            <span className="font-bold text-green-600">{formatMoney(metrics.inflow)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">Cash Outflow</span>
                                            <span className="font-bold text-red-600">{formatMoney(metrics.outflow)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div className="bg-red-500 h-3 rounded-full" style={{ width: '55%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-6">
                                    Healthy cash flow. Inflow exceeds outflow by {formatMoney(metrics.inflow - metrics.outflow)}.
                                </p>
                            </div>

                            <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Bills</h3>
                                </div>
                                <div className="p-0 flex-1 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-gray-500 bg-white">
                                            <tr>
                                                <th className="p-4 font-medium border-b border-gray-100">Vendor</th>
                                                <th className="p-4 font-medium border-b border-gray-100 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {bills.slice(0, 4).map(b => (
                                                <tr key={b.id}>
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-900">{b.vendor}</div>
                                                        <div className="text-xs text-gray-500">{b.date}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="font-bold text-gray-900">{formatMoney(b.amount)}</div>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BILLS TAB */}
                {activeTab === 'bills' && (
                    <div>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search vendors or bills..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] text-sm" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-500 bg-white border-b border-gray-100 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Vendor</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Due/Paid Date</th>
                                        <th className="p-4 font-medium">Receipt</th>
                                        <th className="p-4 font-medium text-right">Amount</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {bills.map(b => (
                                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">{b.vendor}</td>
                                            <td className="p-4 text-gray-600">{b.category}</td>
                                            <td className="p-4 text-gray-600">{b.date}</td>
                                            <td className="p-4">
                                                {b.hasReceipt ? (
                                                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium cursor-pointer hover:underline">
                                                        <ImageIcon className="w-3.5 h-3.5" /> View
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No receipt</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900 text-right">{formatMoney(b.amount)}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {b.status === 'Pending' ? (
                                                    <button className="px-3 py-1 bg-[#2db34a] text-white text-xs font-medium rounded hover:bg-[#259b3f] transition-colors">
                                                        Pay Now
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Settled</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* EMPLOYEES & PAYROLL TAB */}
                {activeTab === 'payroll' && (
                    <div>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Employee List & Salaries</h3>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Run Mass Payroll
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-500 bg-white border-b border-gray-100 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Employee Name</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium text-right">Assigned Salary</th>
                                        <th className="p-4 font-medium">Last Paid</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {employees.map(e => (
                                        <tr key={e.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {e.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{e.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{e.role}</td>
                                            <td className="p-4 font-bold text-gray-900 text-right">{formatMoney(e.salary)}</td>
                                            <td className="p-4 text-gray-600">{e.lastPaid}</td>
                                            <td className="p-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => { setEditEmployee(e); setEditSalaryAmount(e.salary.toString()) }}
                                                    className="p-1.5 text-gray-400 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" 
                                                    title="Assign/Edit Salary"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* RIDER SETTLEMENTS TAB */}
                {activeTab === 'riders' && (
                    <div>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-900">Daily Rider Settlements</h3>
                                <p className="text-xs text-gray-500">Log cash collected and expenses submitted by riders.</p>
                            </div>
                            <button 
                                onClick={() => setIsSettlementModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Log Settlement
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-500 bg-white border-b border-gray-100 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Rider Name</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium text-right">Cash Collected</th>
                                        <th className="p-4 font-medium text-right text-red-500">Expenses Submitted</th>
                                        <th className="p-4 font-medium text-right text-green-600">Net Settled</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {settlements.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-gray-400" />
                                                {s.riderName}
                                            </td>
                                            <td className="p-4 text-gray-600">{s.date}</td>
                                            <td className="p-4 font-medium text-gray-900 text-right">{formatMoney(s.cashCollected)}</td>
                                            <td className="p-4 font-medium text-red-500 text-right">- {formatMoney(s.expenses)}</td>
                                            <td className="p-4 font-bold text-green-600 text-right">{formatMoney(s.netSubmitted)}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${s.status === 'Verified' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'}`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {settlements.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">No settlements logged yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PROFIT & LOSS TAB */}
                {activeTab === 'pnl' && (
                    <div className="p-6">
                        <div className="max-w-3xl mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 p-6 border-b border-gray-200 text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Profit and Loss Statement</h2>
                                <p className="text-gray-500 mt-1">For the period ending May 2026</p>
                            </div>
                            
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-gray-50/50"><td className="p-4 font-bold text-gray-900" colSpan={2}>Revenue</td></tr>
                                        {profitLoss.revenue.map((item, i) => (
                                            <tr key={i}>
                                                <td className="p-4 pl-8 text-gray-600">{item.item}</td>
                                                <td className="p-4 text-right text-gray-900">{formatMoney(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50/50 border-t-2 border-gray-200">
                                            <td className="p-4 font-bold text-gray-900">Total Revenue</td>
                                            <td className="p-4 font-bold text-gray-900 text-right">{formatMoney(totalRevenue)}</td>
                                        </tr>

                                        <tr><td className="p-4 font-bold text-gray-900 mt-4 block" colSpan={2}>Cost of Goods Sold</td></tr>
                                        {profitLoss.cogs.map((item, i) => (
                                            <tr key={i}>
                                                <td className="p-4 pl-8 text-gray-600">{item.item}</td>
                                                <td className="p-4 text-right text-gray-900">{formatMoney(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50/50 border-t-2 border-gray-200">
                                            <td className="p-4 font-bold text-gray-900">Total COGS</td>
                                            <td className="p-4 font-bold text-gray-900 text-right">{formatMoney(totalCOGS)}</td>
                                        </tr>
                                        <tr className="bg-blue-50 border-t-2 border-blue-200">
                                            <td className="p-4 font-bold text-blue-900">Gross Profit</td>
                                            <td className="p-4 font-bold text-blue-900 text-right">{formatMoney(grossProfit)}</td>
                                        </tr>

                                        <tr><td className="p-4 font-bold text-gray-900 mt-4 block" colSpan={2}>Operating Expenses</td></tr>
                                        {profitLoss.expenses.map((item, i) => (
                                            <tr key={i}>
                                                <td className="p-4 pl-8 text-gray-600">{item.item}</td>
                                                <td className="p-4 text-right text-gray-900">{formatMoney(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50/50 border-t-2 border-gray-200">
                                            <td className="p-4 font-bold text-gray-900">Total Operating Expenses</td>
                                            <td className="p-4 font-bold text-gray-900 text-right">{formatMoney(totalExpenses)}</td>
                                        </tr>
                                        
                                        <tr className="bg-green-50 border-t-2 border-green-300">
                                            <td className="p-5 text-lg font-bold text-green-900">Net Operating Income</td>
                                            <td className="p-5 text-lg font-bold text-green-900 text-right">{formatMoney(operatingProfit)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            
            {/* Bill Entry Modal */}
            {isBillModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Enter New Bill</h2>
                            <button onClick={() => setIsBillModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddBill} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Payee</label>
                                <input required type="text" value={newBill.vendor} onChange={e => setNewBill({ ...newBill, vendor: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" placeholder="e.g. AWS Services" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                    <input required type="number" step="0.01" min="0" value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" placeholder="450.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input required type="date" value={newBill.date} onChange={e => setNewBill({ ...newBill, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={newBill.category} onChange={e => setNewBill({ ...newBill, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        <option value="Software">Software</option>
                                        <option value="Inventory">Inventory</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={newBill.status} onChange={e => setNewBill({ ...newBill, status: e.target.value as 'Pending' | 'Paid' })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]">
                                        <option value="Pending">Pending (Unpaid)</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt / Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#2db34a] hover:text-[#24943c] focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input type="file" className="sr-only" onChange={e => setNewBill({ ...newBill, receiptFile: e.target.files?.[0] || null })} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                        {newBill.receiptFile && <p className="text-xs text-green-600 font-medium mt-2">File attached: {newBill.receiptFile.name}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsBillModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Save Bill</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign/Edit Salary Modal */}
            {editEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                {editEmployee.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{editEmployee.name}</h3>
                                <p className="text-xs text-gray-500">{editEmployee.role}</p>
                            </div>
                        </div>
                        <form onSubmit={handleSaveSalary} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Monthly Salary ($)</label>
                                <input 
                                    autoFocus
                                    required 
                                    type="number" 
                                    step="0.01" 
                                    min="0" 
                                    value={editSalaryAmount} 
                                    onChange={e => setEditSalaryAmount(e.target.value)} 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a]" 
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setEditEmployee(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white hover:bg-[#24943c] rounded-lg font-medium transition-colors text-sm">Save Salary</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Log Rider Settlement Modal */}
            {isSettlementModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Log Rider Settlement</h2>
                            <button onClick={() => setIsSettlementModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSettlement} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rider Name</label>
                                    <input required type="text" value={newSettlement.riderName} onChange={e => setNewSettlement({ ...newSettlement, riderName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input required type="date" value={newSettlement.date} onChange={e => setNewSettlement({ ...newSettlement, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cash Collected ($)</label>
                                    <input required type="number" step="0.01" min="0" value={newSettlement.cashCollected} onChange={e => setNewSettlement({ ...newSettlement, cashCollected: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="850.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expenses/Fuel ($)</label>
                                    <input required type="number" step="0.01" min="0" value={newSettlement.expenses} onChange={e => setNewSettlement({ ...newSettlement, expenses: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="50.00" />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-gray-700">Net Cash to Deposit:</span>
                                <span className="font-bold text-green-600 text-lg">
                                    {formatMoney((parseFloat(newSettlement.cashCollected) || 0) - (parseFloat(newSettlement.expenses) || 0))}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={newSettlement.status} onChange={e => setNewSettlement({ ...newSettlement, status: e.target.value as 'Pending' | 'Verified' })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500">
                                    <option value="Pending">Pending (Not Counted)</option>
                                    <option value="Verified">Verified (Cash Received)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsSettlementModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Log Settlement</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}