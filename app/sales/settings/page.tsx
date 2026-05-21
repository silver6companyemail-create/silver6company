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
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SalesSettings() {
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
            type="button"
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
                    <p className="text-[10px] text-gray-400">Supports PNG, JPG, or GIF formats. Rendered via secure Cloudinary storage.</p>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-650">Account Representative Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-650">Registered Corporate Email</label>
                    <input 
                      type="email" 
                      disabled
                      value={email}
                      className="w-full bg-gray-100 border border-gray-200 focus:outline-none text-xs px-3.5 py-2.5 rounded-xl text-gray-400 font-bold cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-650">Personal Contact Number</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 938-2049"
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-650">Gender Identity</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="">Choose Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Decline to State</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-650">Workspace Pitch Bio Summary</label>
                    <textarea 
                      placeholder="Brief bio to display to incoming CRM clients during proposals..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs p-3.5 rounded-xl font-semibold h-24 resize-none"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-650">Residential / Office Mailing Address</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enterprise St. 22B, Suite 400"
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base">Alert & Feed Preferences</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Control how and when you receive lead updates and scheduler alarms.</p>
                </div>

                <div className="divide-y divide-gray-100 bg-gray-50/50 rounded-2xl border border-gray-200/60 p-5 space-y-4">
                  <div className="flex items-center justify-between py-2 first:pt-0">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-gray-800 text-xs">Email Lead Assigned notifications</p>
                      <p className="text-[10px] text-gray-400">Receive immediate email alerts when a warm lead enters your funnel.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2.5 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-gray-800 text-xs">SMS Meeting Scheduler Reminders</p>
                      <p className="text-[10px] text-gray-400">Receive SMS notifications 10 minutes prior to scheduled zoom sync calls.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'security' && (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base">Security & Password Configurations</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Keep your account secure by maintaining strong, non-reused login credentials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1 relative col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-655">Current Account Password</label>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-655">Choose New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-655">Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs px-3.5 py-2.5 rounded-xl font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Form Save Button Footer */}
          <div className="px-6 py-4.5 bg-gray-50 border-t border-gray-150 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Configurations persist live via Mongoose
            </span>
            <button
              type="submit"
              disabled={updating}
              className="bg-slate-900 hover:bg-slate-850 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Settings...
                </>
              ) : (
                'Save Settings Config'
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  )
}
