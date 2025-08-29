import * as React from 'react'
import type { Profile } from '../../lib/types'

interface AdminSidebarProps {
  isOpen: boolean
  activeSection: string
  onSectionChange: (section: string) => void
  user: Profile | null
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  activeSection, 
  onSectionChange, 
  user 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'fleet', label: 'Fleet Management', icon: '🚗' },
    ...(user?.role === 'superAdmin' ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ]

  return (
    <div className={`bg-slate-900 text-white h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        {/* Logo */}
        <button
          onClick={() => onSectionChange('dashboard')}
          className="flex items-center gap-3 mb-4 w-full hover:opacity-80 transition-opacity"
        >
          <img 
            src="/images/logo.jpg" 
            alt="Aurora Motors Logo" 
            className={`rounded-lg object-cover ${isOpen ? 'w-12 h-12' : 'w-8 h-8'}`}
          />
          {isOpen && (
            <span className="text-white font-semibold text-lg">Smart Car Rentals</span>
          )}
        </button>
        
        {/* User Info */}
        {isOpen && user && (
          <div className="text-center mb-6 pb-4 border-b border-slate-700">
            <div className="text-sm font-medium text-white">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-xs text-slate-400 mt-1 capitalize">
              {user.role}
            </div>
          </div>
        )}
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800 transition-colors ${
              activeSection === item.id ? 'bg-slate-800 border-r-2 border-sky-500' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar
