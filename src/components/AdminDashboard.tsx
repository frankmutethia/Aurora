import * as React from 'react'
import { getCurrentUser, logout } from '../lib/auth'
import { DEMO_CARS, DEMO_BOOKINGS, DEMO_USERS, getAvailableCars, getCarsDueForService, getPendingPayments, getActiveBookings } from '../lib/demo-data'
import type { DashboardStats, Profile } from '../lib/types'
import CarManagement from './CarManagement'

// Sidebar component
const AdminSidebar = ({ isOpen, activeSection, onSectionChange }: { 
  isOpen: boolean; 
  activeSection: string; 
  onSectionChange: (section: string) => void 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'fleet', label: 'Fleet Management', icon: '🚗' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ]

  return (
    <div className={`bg-slate-900 text-white h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          {isOpen && <span className="font-semibold">Aurora Admin</span>}
        </div>
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

// Top navigation bar
const AdminTopBar = ({ user, onToggleSidebar }: { user: Profile; onToggleSidebar: () => void }) => {
  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

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

// Stat card component
const StatCard = ({ title, value, subtitle, color = 'sky' }: { title: string; value: string | number; subtitle?: string; color?: string }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
    <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
    <div className="text-sm font-medium text-slate-700">{title}</div>
    {subtitle && <div className={`text-xs text-${color}-700 mt-1`}>{subtitle}</div>}
  </div>
)

// Status badge component
const StatusBadge = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    available: 'bg-green-100 text-green-800',
    booked: 'bg-yellow-100 text-yellow-800',
    in_use: 'bg-blue-100 text-blue-800',
    under_maintenance: 'bg-red-100 text-red-800',
    payment_pending: 'bg-orange-100 text-orange-800',
    invoice_sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  )
}

const AdminDashboard = () => {
  const [user, setUser] = React.useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [activeSection, setActiveSection] = React.useState('dashboard')

  React.useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  if (!user) {
    return <div className="p-8">Loading...</div>
  }

  const stats: DashboardStats = {
    total_cars: DEMO_CARS.length,
    available_cars: getAvailableCars().length,
    active_bookings: getActiveBookings().length,
    pending_payments: getPendingPayments().length,
    total_users: DEMO_USERS.length,
    monthly_revenue: 588,
    cars_due_service: getCarsDueForService().length,
    service_threshold_km: 5000
  }

  const pendingBookings = DEMO_BOOKINGS.filter(b => b.status === 'pending')
  const carsDueService = getCarsDueForService()

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard title="Total Cars" value={stats.total_cars} color="sky" />
              <StatCard title="Available Cars" value={stats.available_cars} color="green" />
              <StatCard title="Active Bookings" value={stats.active_bookings} color="blue" />
              <StatCard title="Pending Payments" value={stats.pending_payments} color="orange" />
              <StatCard title="Due for Service" value={stats.cars_due_service} color="red" />
              <StatCard title="Monthly Revenue" value={`$${stats.monthly_revenue}`} color="purple" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Actions */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
                <div className="space-y-3">
                  {pendingBookings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-yellow-900">{pendingBookings.length} pending bookings</div>
                          <div className="text-sm text-yellow-700">Require admin approval</div>
                        </div>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                          Review
                        </button>
                      </div>
                    </div>
                  )}
                  {getPendingPayments().length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-orange-900">{getPendingPayments().length} pending payments</div>
                          <div className="text-sm text-orange-700">Invoices to be sent</div>
                        </div>
                        <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                          Process
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {DEMO_BOOKINGS.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="text-sm font-medium">Booking #{booking.id}</div>
                        <div className="text-xs text-slate-500">{new Date(booking.created_at).toLocaleDateString()}</div>
                      </div>
                      <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'bookings':
        return (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">All Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Booking ID</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Car</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Dates</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Payment</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {DEMO_BOOKINGS.map((booking) => {
                    const car = DEMO_CARS.find(c => c.id === booking.car_id)
                    const user = DEMO_USERS.find(u => u.id === booking.user_id)
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">#{booking.id}</td>
                        <td className="px-6 py-4">{user ? `${user.first_name} ${user.last_name}` : 'Unknown'}</td>
                        <td className="px-6 py-4">{car ? `${car.year} ${car.make} ${car.model}` : `Car ${booking.car_id}`}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs">
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.payment_status}>{booking.payment_status}</StatusBadge>
                        </td>
                        <td className="px-6 py-4">${booking.total_cost.toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'fleet':
        return <CarManagement />

      case 'users':
        return (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Phone</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Role</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Loyalty Points</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {DEMO_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.loyalty_points}</td>
                      <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className="space-y-6">
            {/* Service Alerts */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Service Alerts</h3>
              {carsDueService.length === 0 ? (
                <div className="text-green-600">All cars are up to date with service requirements.</div>
              ) : (
                <div className="space-y-3">
                  {carsDueService.map((car) => (
                    <div key={car.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-red-900">{car.year} {car.make} {car.model}</div>
                          <div className="text-sm text-red-700">License: {car.license_plate}</div>
                          <div className="text-xs text-red-600">
                            Overdue by {(car.current_odometer - car.last_service_odometer - car.service_threshold_km).toLocaleString()} km
                          </div>
                        </div>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                          Schedule Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Maintenance Schedule */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Maintenance Schedule</h3>
              <div className="text-sm text-gray-600">
                Standard service interval: {stats.service_threshold_km.toLocaleString()} km
              </div>
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Reports & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Revenue Summary</h4>
                <div className="text-2xl font-bold text-green-600">${stats.monthly_revenue}</div>
                <div className="text-sm text-gray-500">This month</div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Fleet Utilization</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((stats.active_bookings / stats.total_cars) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Cars in use</div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard