'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Loader2, 
  Bell, 
  Moon, 
  Sun, 
  Truck, 
  Lock, 
  ChevronRight, 
  Check, 
  Save,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// Types
interface VehicleDetails {
  vehicleType: string
  plateNumber: string
  licenseNumber: string
}

interface UserSettings {
  theme: 'light' | 'dark'
  emailNotifications: boolean
  smsNotifications: boolean
}

interface ProfileData {
  _id: string
  name: string
  email: string
  role: string
  phone: string
  joinedDate: string
  avatar: string
  bio: string
  gender: string
  address: string
  vehicleDetails: VehicleDetails
  settings: UserSettings
}

export default function AdminSettings() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicle' | 'notifications' | 'security' | 'theme'>('profile')
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Profile data state
  const [profile, setProfile] = useState<ProfileData>({
    _id: '',
    name: '',
    email: '',
    role: '',
    phone: '',
    joinedDate: '',
    avatar: '',
    bio: '',
    gender: '',
    address: '',
    vehicleDetails: { vehicleType: '', plateNumber: '', licenseNumber: '' },
    settings: { theme: 'light', emailNotifications: true, smsNotifications: true }
  })

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth token getter
  const getToken = () => {
    try {
      const userInfo = localStorage.getItem('userInfo')
      return userInfo ? JSON.parse(userInfo).token : ''
    } catch {
      return ''
    }
  }

  // Fetch profile on mount
  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:1000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setProfile({
          ...data,
          vehicleDetails: data.vehicleDetails || { vehicleType: '', plateNumber: '', licenseNumber: '' },
          settings: data.settings || { theme: 'light', emailNotifications: true, smsNotifications: true }
        })
      } else {
        toast.error(data.message || 'Failed to load profile details')
      }
    } catch (err) {
      console.error(err)
      toast.error('Unable to connect to the backend server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // File Upload to Cloudinary
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File limit 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error('File size exceeds the 3MB limit.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('http://localhost:1000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setProfile(prev => ({ ...prev, avatar: data.image }))
        toast.success('Avatar uploaded successfully! Click save to apply.')
      } else {
        toast.error(data.message || 'Failed to upload image')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error uploading avatar.')
    } finally {
      setUploading(false)
    }
  }

  // Update Profile Form Submit
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('http://localhost:1000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          avatar: profile.avatar,
          bio: profile.bio,
          gender: profile.gender,
          address: profile.address,
          vehicleDetails: profile.vehicleDetails,
          settings: profile.settings
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Profile and settings updated successfully!')
        setProfile(prev => ({
          ...prev,
          ...data
        }))

        // Keep local storage info updated for the sidebar/navbar
        const localUserStr = localStorage.getItem('userInfo')
        if (localUserStr) {
          const localUser = JSON.parse(localUserStr)
          localUser.name = profile.name
          localStorage.setItem('userInfo', JSON.stringify(localUser))
          // Trigger storage event so standard admin layout handles it
          window.dispatchEvent(new Event('storage'))
        }
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while updating settings')
    } finally {
      setSaving(false)
    }
  }

  // Update Password
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter the password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:1000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.message || 'Failed to change password')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error updating password.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#2db34a] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Retrieving your profile configurations...</p>
      </div>
    )
  }

  const isRider = profile.role.toLowerCase() === 'rider'

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your personal information, credentials, and preferences.</p>
      </div>

      {/* Main Settings Body */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side Sub-Navigation */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-gray-150 p-3 shadow-sm space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-green-50 text-[#2db34a]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4" />
              <span>Personal Details</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'profile' ? 'translate-x-0.5' : ''}`} />
          </button>

          {isRider && (
            <button 
              onClick={() => setActiveTab('vehicle')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'vehicle' 
                  ? 'bg-green-50 text-[#2db34a]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Vehicle Credentials</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'vehicle' ? 'translate-x-0.5' : ''}`} />
            </button>
          )}

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'notifications' 
                ? 'bg-green-50 text-[#2db34a]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'notifications' ? 'translate-x-0.5' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'theme' 
                ? 'bg-green-50 text-[#2db34a]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4" />
              <span>Theme Preferences</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'theme' ? 'translate-x-0.5' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'security' 
                ? 'bg-green-50 text-[#2db34a]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === 'security' ? 'translate-x-0.5' : ''}`} />
          </button>
        </aside>

        {/* Right Side Main Form Area */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden min-h-[500px]">
          {/* Tab 1: Personal Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="p-6 md:p-8 space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                <p className="text-gray-500 text-xs mt-1">Provide detailed contact information and a brief bio.</p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white ring-4 ring-green-100 bg-gray-100 flex items-center justify-center text-3xl font-extrabold text-[#2db34a] shadow-sm">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-[#2db34a] animate-spin" />
                    ) : profile.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1.5 -right-1.5 bg-[#2db34a] hover:bg-green-600 disabled:bg-gray-400 text-white p-2 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-105"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg">Profile Avatar</h3>
                  <p className="text-gray-400 text-xs max-w-xs">Supports JPG, PNG, GIF. Max file size: 3MB.</p>
                  {uploading && <p className="text-[#2db34a] text-xs font-bold animate-pulse">Uploading, please wait...</p>}
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      disabled
                      value={profile.email}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-150 bg-gray-50 text-gray-400 rounded-xl cursor-not-allowed font-medium text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Locked
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="e.g. +1 555-0199"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select 
                    value={profile.gender}
                    onChange={e => setProfile({...profile, gender: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="City, State, Zip, Country"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Biography</label>
                  <textarea 
                    rows={4}
                    value={profile.bio}
                    onChange={e => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Status Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border border-gray-100 rounded-xl gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-xs font-semibold">Joined Platform:</span>
                  <span className="text-gray-700 text-xs font-bold">
                    {profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-xs font-semibold">Role Tier:</span>
                  <span className="bg-green-100 text-green-800 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md tracking-wider">
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2db34a] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Vehicle Credentials (Rider Only) */}
          {activeTab === 'vehicle' && isRider && (
            <form onSubmit={handleProfileUpdate} className="p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Vehicle Credentials</h2>
                <p className="text-gray-500 text-xs mt-1">Manage operational transportation details for delivery systems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Type</label>
                  <select 
                    value={profile.vehicleDetails.vehicleType}
                    onChange={e => setProfile({
                      ...profile, 
                      vehicleDetails: { ...profile.vehicleDetails, vehicleType: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all bg-white"
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Motorcycle">Motorcycle / Scooter</option>
                    <option value="Bicycle">Bicycle / E-Bike</option>
                    <option value="Car">Car</option>
                    <option value="Van">Delivery Van</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plate Number</label>
                  <input 
                    type="text" 
                    value={profile.vehicleDetails.plateNumber}
                    onChange={e => setProfile({
                      ...profile, 
                      vehicleDetails: { ...profile.vehicleDetails, plateNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                    placeholder="e.g. AB-1234"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Driving License Number</label>
                  <input 
                    type="text" 
                    value={profile.vehicleDetails.licenseNumber}
                    onChange={e => setProfile({
                      ...profile, 
                      vehicleDetails: { ...profile.vehicleDetails, licenseNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                    placeholder="e.g. DL-987654321"
                  />
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>⚠️ Important Operations Policy</span>
                </p>
                <p className="leading-relaxed">
                  Delivery personnel must provide accurate vehicle information. Falsification of plate numbers or license credentials will trigger automated suspension.
                </p>
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2db34a] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleProfileUpdate} className="p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-500 text-xs mt-1">Configure channels for order summaries, task reports, and security logs.</p>
              </div>

              <div className="space-y-4">
                {/* Switch Item 1 */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-gray-800">Email Notifications</p>
                    <p className="text-xs text-gray-400 max-w-md">Receive invoices, settlement files, task updates, and security logs on your email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={profile.settings.emailNotifications}
                      onChange={e => setProfile({
                        ...profile,
                        settings: { ...profile.settings, emailNotifications: e.target.checked }
                      })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2db34a]"></div>
                  </label>
                </div>

                {/* Switch Item 2 */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-gray-800">SMS Alerts</p>
                    <p className="text-xs text-gray-400 max-w-md">Get instant dispatch orders and instant payment status updates on your cellular line.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={profile.settings.smsNotifications}
                      onChange={e => setProfile({
                        ...profile,
                        settings: { ...profile.settings, smsNotifications: e.target.checked }
                      })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2db34a]"></div>
                  </label>
                </div>
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2db34a] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 4: Theme Preferences */}
          {activeTab === 'theme' && (
            <form onSubmit={handleProfileUpdate} className="p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Theme Preferences</h2>
                <p className="text-gray-500 text-xs mt-1">Select the dashboard interface lighting theme that suits your eyes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <div 
                  onClick={() => setProfile({
                    ...profile,
                    settings: { ...profile.settings, theme: 'light' }
                  })}
                  className={`cursor-pointer border rounded-2xl p-5 flex flex-col gap-4 relative transition-all duration-200 ${
                    profile.settings.theme === 'light' 
                      ? 'border-[#2db34a] bg-green-50/10 ring-2 ring-green-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  {profile.settings.theme === 'light' && (
                    <div className="absolute top-4 right-4 bg-[#2db34a] text-white p-1 rounded-full shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Light Mode</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Highly contrastive text with clean white panels.</p>
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div 
                  onClick={() => setProfile({
                    ...profile,
                    settings: { ...profile.settings, theme: 'dark' }
                  })}
                  className={`cursor-pointer border rounded-2xl p-5 flex flex-col gap-4 relative transition-all duration-200 ${
                    profile.settings.theme === 'dark' 
                      ? 'border-[#2db34a] bg-green-50/10 ring-2 ring-green-100 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  {profile.settings.theme === 'dark' && (
                    <div className="absolute top-4 right-4 bg-[#2db34a] text-white p-1 rounded-full shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Dark Mode</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Sleek dark panel controls perfect for night operations.</p>
                  </div>
                </div>
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2db34a] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 5: Security */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
                <p className="text-gray-500 text-xs mt-1">Renew your system access token by configuring a new password.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPass ? 'text' : 'password'} 
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? 'text' : 'password'} 
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPass ? 'text' : 'password'} 
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2db34a] focus:ring-1 focus:ring-[#2db34a] font-medium text-sm transition-all"
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Footer Action */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}