'use client'

import { useState, useEffect } from 'react'
import { 
    User, 
    Bell, 
    Lock, 
    Upload, 
    Loader2, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    FileText,
    Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function EditorSettings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Form inputs state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')
    const [bio, setBio] = useState('')
    const [gender, setGender] = useState('')
    const [address, setAddress] = useState('')
    
    // Notifications State
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)

    // Password Update State
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const loadProfile = async () => {
        try {
            setLoading(true)
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const res = await fetch('http://localhost:1000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setName(data.name || '')
                setEmail(data.email || '')
                setRole(data.role || '')
                setPhone(data.phone || '')
                setAvatar(data.avatar || '')
                setBio(data.bio || '')
                setGender(data.gender || '')
                setAddress(data.address || '')
                
                if (data.settings) {
                    setEmailNotifications(data.settings.emailNotifications !== false)
                    setSmsNotifications(!!data.settings.smsNotifications)
                }
            }
        } catch (e) {
            console.error("Error loading profile settings", e)
            toast.error("Failed to load settings details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    // Cloudinary Avatar Image Upload Handler
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploadingImage(true)
            const formData = new FormData()
            formData.append('image', file)

            const res = await fetch('http://localhost:1000/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (res.ok && data.image) {
                setAvatar(data.image)
                toast.success("Avatar image uploaded successfully")
            } else {
                toast.error(data.message || "Failed to upload image")
            }
        } catch (error) {
            console.error("Avatar upload failed", error)
            toast.error("Avatar image upload failed")
        } finally {
            setUploadingImage(false)
        }
    }

    // Submit settings modification
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setUpdating(true)
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) return;
            const userInfo = JSON.parse(userInfoStr)

            const updatePayload: any = {
                name,
                phone,
                avatar,
                bio,
                gender,
                address,
                settings: {
                    theme: 'light',
                    emailNotifications,
                    smsNotifications
                }
            }

            // Sync password if user is inside security tab or fields are filled
            if (activeTab === 'security') {
                if (!currentPassword || !newPassword) {
                    toast.error("Please fill in current and new password fields")
                    setUpdating(false)
                    return
                }
                if (newPassword !== confirmNewPassword) {
                    toast.error("New passwords do not match")
                    setUpdating(false)
                    return
                }
                updatePayload.password = newPassword;
                updatePayload.currentPassword = currentPassword;
            }

            const res = await fetch('http://localhost:1000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(updatePayload)
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Account settings updated successfully")
                
                // Update local storage name if modified
                userInfo.name = data.name;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // Trigger a global storage event to update the sidebar dynamically
                window.dispatchEvent(new Event('storage'))

                // Reset passwords if updated
                setCurrentPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            } else {
                toast.error(data.message || "Failed to update profile settings")
            }
        } catch (error) {
            console.error("Save profile settings error", error)
            toast.error("An error occurred")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            {/* Nav tabs */}
            <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl border shadow-sm gap-2">
                {[
                    { id: 'profile', label: 'My Personal Profile', icon: User },
                    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
                    { id: 'security', label: 'Security & Password', icon: Lock }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2.5 px-5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === tab.id 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="w-4 h-4 shrink-0" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="h-96 bg-white rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <span className="text-xs text-gray-400 font-bold">Retrieving profile configurations...</span>
                </div>
            ) : (
                <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
                    {/* Tab contents */}
                    <div className="p-6 md:p-8 space-y-6">
                        
                        {/* --- PROFILE TAB --- */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h3 className="font-extrabold text-gray-950 text-base">Personal Profile Settings</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Customize your personal bio, contact channels, and workspace photo.</p>
                                </div>

                                {/* Avatar Upload Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                                    <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center font-bold text-xl text-emerald-600 overflow-hidden relative shrink-0">
                                        {avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            name.substring(0, 2).toUpperCase()
                                        )}
                                        {uploadingImage && (
                                            <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs hover:bg-emerald-100 cursor-pointer transition-all flex items-center gap-2 border border-emerald-150 shadow-sm w-fit">
                                            <Upload className="w-4 h-4" />
                                            Upload Profile Picture
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleAvatarUpload} 
                                                className="hidden" 
                                            />
                                        </label>
                                        <p className="text-[10px] text-gray-400 font-bold">Square images, PNG or JPG up to 10MB.</p>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address (Read-only)</label>
                                        <input disabled type="email" value={email} className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-400 rounded-xl focus:outline-none text-sm cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Contact Phone</label>
                                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" placeholder="e.g. +977-9800000000" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Gender Identification</label>
                                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm">
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Current Workplace / Home Address</label>
                                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" placeholder="e.g. Kathmandu, Nepal" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Specialist Bio / Creative Description</label>
                                    <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none" placeholder="Share details about your editing styles, programs of choice (e.g. Premiere Pro, After Effects)..." />
                                </div>
                            </div>
                        )}

                        {/* --- NOTIFICATIONS TAB --- */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h3 className="font-extrabold text-gray-950 text-base">Alert & Notification Toggles</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Control which channels send system reports and schedule alerts.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                                        <div>
                                            <span className="block font-bold text-gray-900 text-sm">Email Newsletters & Schedule Sync Alerts</span>
                                            <span className="text-xs text-gray-400 font-medium">Sends an alert when a task is updated or marked review by admins.</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={emailNotifications} 
                                                onChange={e => setEmailNotifications(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                                        <div>
                                            <span className="block font-bold text-gray-900 text-sm">SMS Direct Task Reminders</span>
                                            <span className="text-xs text-gray-400 font-medium">Sends cellular texts for task priorities and instant feedback.</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={smsNotifications} 
                                                onChange={e => setSmsNotifications(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- SECURITY TAB --- */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h3 className="font-extrabold text-gray-950 text-base">Modify Hub Security Password</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Keep your creative specialist account secure with a strong password.</p>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Current Account Password</label>
                                        <div className="relative">
                                            <input 
                                                required 
                                                type={showPassword ? 'text' : 'password'} 
                                                value={currentPassword} 
                                                onChange={e => setCurrentPassword(e.target.value)} 
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">New Secure Password</label>
                                        <input 
                                            required 
                                            type="password" 
                                            value={newPassword} 
                                            onChange={e => setNewPassword(e.target.value)} 
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                            placeholder="••••••••" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Confirm New Secure Password</label>
                                        <input 
                                            required 
                                            type="password" 
                                            value={confirmNewPassword} 
                                            onChange={e => setConfirmNewPassword(e.target.value)} 
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm" 
                                            placeholder="••••••••" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Save actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={updating}
                            className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-600 rounded-xl transition-all text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                                    <span>Syncing configs...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
