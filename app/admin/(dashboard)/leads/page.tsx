'use client'

import { useState } from 'react'
import { Check, Save, UserCog } from 'lucide-react'

type Role = 'Super Admin' | 'Content Head' | 'Content Staff' | 'Delivery' | 'Sales'
type Module = 'Dashboard' | 'Orders' | 'Products' | 'Customers' | 'Accounts' | 'Creative' | 'Sales' | 'Stock' | 'Schedules'

const ROLES: Role[] = ['Super Admin', 'Content Head', 'Content Staff', 'Delivery', 'Sales']
const MODULES: Module[] = ['Dashboard', 'Orders', 'Products', 'Customers', 'Accounts', 'Creative', 'Sales', 'Stock', 'Schedules']

const initialPermissions: Record<Role, Record<Module, boolean>> = {
  'Super Admin': { Dashboard: true, Orders: true, Products: true, Customers: true, Accounts: true, Creative: true, Sales: true, Stock: true, Schedules: true },
  'Content Head': { Dashboard: true, Orders: false, Products: true, Customers: false, Accounts: false, Creative: true, Sales: false, Stock: false, Schedules: true },
  'Content Staff': { Dashboard: true, Orders: false, Products: false, Customers: false, Accounts: false, Creative: true, Sales: false, Stock: false, Schedules: false },
  'Delivery': { Dashboard: true, Orders: true, Products: false, Customers: true, Accounts: false, Creative: false, Sales: false, Stock: true, Schedules: true },
  'Sales': { Dashboard: true, Orders: true, Products: true, Customers: true, Accounts: false, Creative: false, Sales: true, Stock: true, Schedules: true },
}

export default function LeadManagement() {
  const [activeRole, setActiveRole] = useState<Role>('Content Head')
  const [permissions, setPermissions] = useState(initialPermissions)

  const togglePermission = (module: Module) => {
    if (activeRole === 'Super Admin') return // Super Admin cannot be restricted

    setPermissions(prev => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [module]: !prev[activeRole][module]
      }
    }))
  }

  const handleSave = () => {
    alert(`Permissions successfully updated for ${activeRole}!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-500 mt-0.5">Manage roles and assign module access permissions.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Roles Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-gray-500" />
                Designations
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeRole === role
                    ? 'bg-green-50 text-[#2db34a]'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{activeRole} Permissions</h3>
                <p className="text-sm text-gray-500">Toggle the modules this role can access.</p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#2db34a] text-white rounded-lg text-sm font-medium hover:bg-[#24943c] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="p-5 flex-1">
              {activeRole === 'Super Admin' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                  <strong>Note:</strong> Super Admin has full access to all modules. These permissions cannot be restricted.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODULES.map(module => {
                  const hasAccess = permissions[activeRole][module]
                  const isDisabled = activeRole === 'Super Admin'

                  return (
                    <div
                      key={module}
                      onClick={() => !isDisabled && togglePermission(module)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'
                        } ${hasAccess
                          ? 'border-green-500 bg-green-50/30'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div>
                        <span className={`font-medium ${hasAccess ? 'text-gray-900' : 'text-gray-600'}`}>
                          {module} Module
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {hasAccess ? 'Can view and manage' : 'No access'}
                        </p>
                      </div>

                      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${hasAccess ? 'bg-[#2db34a] text-white' : 'bg-gray-100 text-transparent border border-gray-300'
                        }`}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
