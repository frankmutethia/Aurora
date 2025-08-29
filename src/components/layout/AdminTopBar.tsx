import * as React from 'react'
import { logout } from '../../lib/auth'
import type { Profile } from '../../lib/types'

interface AdminTopBarProps {
  user: Profile | null
  onToggleSidebar: () => void
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ user, onToggleSidebar }) => {
  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  if (!user) return null

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <span className="text-xl">☰</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <span className="text-sky-700 font-medium text-sm">
                {user.first_name?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-700">{user.first_name} {user.last_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTopBar
