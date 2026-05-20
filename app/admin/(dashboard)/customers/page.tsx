'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, X, Key } from 'lucide-react'
import { toast } from 'react-hot-toast'

// --- Types ---
type Role = 'Admin' | 'Editor' | 'user' | string
type Status = 'Active' | 'Inactive' | 'Pending' | string

interface User {
    _id: string
    name: string
    email: string
    role: Role
    status: Status
    phone?: string
    joinedDate?: string
}

export default function AdminCustomers() {
    const [activeTab, setActiveTab] = useState<'admins' | 'customers'>('admins')

    // State for Lists
    const [admins, setAdmins] = useState<User[]>([])
    const [customers, setCustomers] = useState<User[]>([])

    // Modals State
    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
    const [viewCustomer, setViewCustomer] = useState<User | null>(null)
    const [editCustomer, setEditCustomer] = useState<User | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
    const [newPassword, setNewPassword] = useState('')

    // Form State for adding user
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'user' as Role })

    const getToken = () => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : '';
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:1000/api/users', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (res.ok) {
                const adminList = data.filter((u: User) => u.role !== 'user' && u.role !== 'Customer');
                const customerList = data.filter((u: User) => u.role === 'user' || u.role === 'Customer');
                setAdmins(adminList);
                setCustomers(customerList);
            } else {
                toast.error(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            toast.error('Could not connect to server');
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- Handlers ---
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:1000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(newAdmin)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('User created successfully');
                fetchUsers();
                setIsAddAdminOpen(false);
                setNewAdmin({ name: '', email: '', password: '', role: 'user' });
            } else {
                toast.error(data.message || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Server error');
        }
    }

    const handleEditCustomerSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editCustomer) return
        try {
            const res = await fetch(`http://localhost:1000/api/users/${editCustomer._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(editCustomer)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('User updated successfully');
                fetchUsers();
                setEditCustomer(null);
            } else {
                toast.error(data.message || 'Failed to update user');
            }
        } catch (error) {
            toast.error('Server error');
        }
    }

    const handleDeleteCustomer = async () => {
        if (!deleteConfirmId) return
        try {
            const res = await fetch(`http://localhost:1000/api/users/${deleteConfirmId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
                setDeleteConfirmId(null);
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('Server error');
        }
    }

    const handleResetPassword = async () => {
        if (!resetPasswordUser || !newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        try {
            const res = await fetch(`http://localhost:1000/api/users/${resetPasswordUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                toast.success('Password updated successfully');
                setResetPasswordUser(null);
                setNewPassword('');
            } else {
                toast.error('Failed to update password');
            }
        } catch (error) {
            toast.error('Server error');
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your administrative team and customer accounts.</p>
                </div>
                <button
                    onClick={() => setIsAddAdminOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2db34a] text-white rounded-lg hover:bg-[#259b3f] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'admins'
                            ? 'border-[#2db34a] text-[#2db34a]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Administrative Team
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'customers'
                            ? 'border-[#2db34a] text-[#2db34a]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Normal Users (Customers)
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'admins' ? 'admins' : 'customers'}...`}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] transition-all"
                        />
                    </div>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Phone</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(activeTab === 'admins' ? admins : customers).map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>

                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.phone || 'N/A'}</td>

                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' :
                                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                                                'bg-orange-50 text-orange-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' :
                                                user.status === 'Inactive' ? 'bg-gray-500' :
                                                    'bg-orange-500'
                                                }`} />
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setResetPasswordUser(user)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setViewCustomer(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditCustomer(user)} className="p-1.5 text-gray-400 hover:text-[#2db34a] hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteConfirmId(user._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(activeTab === 'admins' ? admins : customers).length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No users found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Add User Modal */}
            {isAddAdminOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
                            <button onClick={() => setIsAddAdminOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required type="text" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input required type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value as Role })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]">
                                    <option value="Admin">Admin (Full Access)</option>
                                    <option value="Editor">Editor (Limited Access)</option>
                                    <option value="user">Normal User (Customer)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddAdminOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#2db34a] text-white rounded-lg font-medium hover:bg-[#259b3f] transition-colors">Add User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Customer Modal */}
            {viewCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                            <button onClick={() => setViewCustomer(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-2xl font-bold">
                                    {viewCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{viewCustomer.name}</h3>
                                    <p className="text-sm text-gray-500">{viewCustomer.role}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{viewCustomer.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{viewCustomer.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                                    <p className="text-sm font-medium text-gray-900">{viewCustomer.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Joined Date</p>
                                    <p className="text-sm font-medium text-gray-900">{viewCustomer.joinedDate ? new Date(viewCustomer.joinedDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button onClick={() => setViewCustomer(null)} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Customer Modal */}
            {editCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                            <button onClick={() => setEditCustomer(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditCustomerSave} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required type="text" value={editCustomer.name} onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" value={editCustomer.email} onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" value={editCustomer.phone || ''} onChange={e => setEditCustomer({ ...editCustomer, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={editCustomer.role} onChange={e => setEditCustomer({ ...editCustomer, role: e.target.value as Role })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]">
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="user">User (Customer)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={editCustomer.status} onChange={e => setEditCustomer({ ...editCustomer, status: e.target.value as Status })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditCustomer(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
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
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex-1">
                                Cancel
                            </button>
                            <button onClick={handleDeleteCustomer} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors flex-1">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetPasswordUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                            <Key className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
                        <p className="text-gray-500 mb-4 text-sm">
                            Set a new password for <strong>{resetPasswordUser.email}</strong>.
                        </p>
                        <div className="text-left mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2db34a]"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => {
                                setResetPasswordUser(null);
                                setNewPassword('');
                            }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex-1">
                                Cancel
                            </button>
                            <button onClick={handleResetPassword} className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg font-medium transition-colors flex-1">
                                Set Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}