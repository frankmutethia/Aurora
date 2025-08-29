import * as React from 'react'
import { getCurrentUser, logout } from '../../lib/auth'
import type { Profile } from '../../lib/types'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeSection, 
  onSectionChange 
}) => {
  const [user, setUser] = React.useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  React.useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superAdmin')) {
      window.location.href = '/login'
      return
    }
    setUser(currentUser)
  }, [])

  // Collapse sidebar on small screens for responsiveness
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
  }, [])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={onSectionChange}
        user={user}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <AdminTopBar 
          user={user} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
