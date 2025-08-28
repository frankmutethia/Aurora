import * as React from 'react'
import { getCurrentUser, logout } from '../lib/auth'
import type { Profile } from '../lib/types'

// Import the extracted admin pages
import DashboardPage from '../pages/DashboardPage'
import BookingsPage from '../pages/BookingsPage'
import FleetPage from '../pages/FleetPage'
import UsersPage from '../pages/UsersPage'
import DriversPage from '../pages/DriversPage'
import PaymentsPage from '../pages/PaymentsPage'
import MaintenancePage from '../pages/MaintenancePage'
import ReportsPage from '../pages/ReportsPage'

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
    { id: 'drivers', label: 'Driver Profiles', icon: '🪪' },
    { id: 'payments', label: 'Payments', icon: '💳' },
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
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [showBookingModal, setShowBookingModal] = React.useState(false)
  const [selectedDriverId, setSelectedDriverId] = React.useState<number | null>(null)
  // Bookings filters
  const [bookingSearch, setBookingSearch] = React.useState('')
  const [bookingStatus, setBookingStatus] = React.useState('')
  const [bookingPayment, setBookingPayment] = React.useState('')
  const [bookingDateRange, setBookingDateRange] = React.useState('')

  React.useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  // Collapse sidebar on small screens for responsiveness
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
  }, [])

  // Compute filtered bookings; when filters are empty ("All"), show everything including completed/returned
  const filteredBookings = React.useMemo(() => {
    let list = [...DEMO_BOOKINGS]
    // Status
    if (bookingStatus) list = list.filter(b => b.status === bookingStatus)
    // Payment
    if (bookingPayment) list = list.filter(b => b.payment_status === bookingPayment)
    // Date range (based on start_date)
    if (bookingDateRange) {
      const now = new Date()
      let from: Date | null = null
      if (bookingDateRange === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      } else if (bookingDateRange === 'week') {
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      } else if (bookingDateRange === 'month') {
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else if (bookingDateRange === 'quarter') {
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      }
      if (from) {
        list = list.filter(b => new Date(b.start_date) >= from)
      }
    }
    // Search text across booking id, user name/email, car title
    const q = bookingSearch.trim().toLowerCase()
    if (q) {
      list = list.filter(b => {
        const idMatch = String(b.id).includes(q)
        const user = DEMO_USERS.find(u => u.id === b.user_id)
        const userMatch = user ? (
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
        ) : false
        const car = DEMO_CARS.find(c => c.id === b.car_id)
        const carMatch = car ? (
          `${car.year} ${car.make} ${car.model}`.toLowerCase().includes(q) ||
          car.license_plate.toLowerCase().includes(q)
        ) : false
        return idMatch || userMatch || carMatch
      })
    }
    return list
  }, [bookingSearch, bookingStatus, bookingPayment, bookingDateRange])

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingModal(true)
  }

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    // In a real app, this would update the booking in the database
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`)
    console.log('Booking status updated successfully')
  }

  const handlePaymentUpdate = (bookingId: number, newPaymentStatus: string) => {
    // In a real app, this would update the payment status in the database
    console.log(`Updating booking ${bookingId} payment to: ${newPaymentStatus}`)
    console.log('Payment status updated successfully')
  }

  const handleSendInvoice = (booking: Booking) => {
    handlePaymentUpdate(booking.id, 'invoice_sent')
    toast(`Invoice created and sent for booking #${booking.id}`)
  }

  const handleCancelBooking = (booking: Booking) => {
    handleStatusUpdate(booking.id, 'cancelled')
    toast(`Booking #${booking.id} has been cancelled`)
  }

  const openDriverProfile = (userId: number) => {
    setSelectedDriverId(userId)
    setActiveSection('driver_profile')
  }

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
        return <DashboardPage />
      case 'bookings':
        return <BookingsPage />
      case 'fleet':
        return <FleetPage />
      case 'users':
        return <UsersPage />
      case 'drivers':
        return <DriversPage />
      case 'payments':
        return <PaymentsPage />
      case 'maintenance':
        return <MaintenancePage />
      case 'reports':
        return <ReportsPage />
      default:
        return <DashboardPage />
    }
  }
        return (
          <div className="space-y-6">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{stats.total_cars}</div>
                    <div className="text-sm font-medium text-blue-700">Total Cars</div>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">+2 this month</div>
            </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-900">{stats.available_cars}</div>
                    <div className="text-sm font-medium text-green-700">Available</div>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600">50% utilization</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{stats.active_bookings}</div>
                    <div className="text-sm font-medium text-purple-700">Active Bookings</div>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-purple-600">+15% vs last week</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-900">{stats.pending_payments}</div>
                    <div className="text-sm font-medium text-orange-700">Pending Payments</div>
                  </div>
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-orange-600">$2,450 pending</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-900">{stats.cars_due_service}</div>
                    <div className="text-sm font-medium text-red-700">Due for Service</div>
                  </div>
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-red-600">Schedule maintenance</div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-indigo-900">${stats.monthly_revenue.toLocaleString()}</div>
                    <div className="text-sm font-medium text-indigo-700">Monthly Revenue</div>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-indigo-600">+8.2% vs last month</div>
              </div>
            </div>

            {/* Charts and Analytics Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                    aria-label="Select time period for revenue trends"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { day: 'Mon', revenue: 850, bookings: 12 },
                        { day: 'Tue', revenue: 920, bookings: 15 },
                        { day: 'Wed', revenue: 780, bookings: 10 },
                        { day: 'Thu', revenue: 1050, bookings: 18 },
                        { day: 'Fri', revenue: 1200, bookings: 22 },
                        { day: 'Sat', revenue: 980, bookings: 16 },
                        { day: 'Sun', revenue: 1100, bookings: 19 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value, _name) => [
                          _name === 'revenue' ? `$${value}` : value,
                          _name === 'revenue' ? 'Revenue' : 'Bookings'
                        ]}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0ea5e9" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBookings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total: $4,250</span>
                  <span className="text-green-600 font-medium">+12.5% vs last week</span>
                </div>
              </div>

              {/* Booking Status Distribution */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Status Distribution</h3>
                  <div className="text-sm text-gray-500">This month</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Confirmed', value: 45, color: '#22c55e' },
                          { name: 'In Progress', value: 12, color: '#3b82f6' },
                          { name: 'Pending', value: 8, color: '#eab308' },
                          { name: 'Cancelled', value: 3, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Confirmed', value: 45, color: '#22c55e' },
                          { name: 'In Progress', value: 12, color: '#3b82f6' },
                          { name: 'Pending', value: 8, color: '#eab308' },
                          { name: 'Cancelled', value: 3, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold text-gray-900">68</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fleet Utilization and Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Fleet Utilization */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Utilization</h3>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { status: 'In Use', count: stats.active_bookings, total: stats.total_cars, color: '#3b82f6' },
                        { status: 'Available', count: stats.available_cars, total: stats.total_cars, color: '#22c55e' },
                        { status: 'Maintenance', count: stats.cars_due_service, total: stats.total_cars, color: '#ef4444' }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="status" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [value, 'Vehicles']}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#0ea5e9" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">In Use</span>
                    <span className="font-medium">{stats.active_bookings}/{stats.total_cars}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium">{stats.available_cars}/{stats.total_cars}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="font-medium">{stats.cars_due_service}/{stats.total_cars}</span>
                  </div>
                </div>
                
                {/* Car Category Distribution */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Fleet by Category</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(() => {
                            const categories = DEMO_CARS.reduce((acc, car) => {
                              acc[car.category] = (acc[car.category] || 0) + 1
                              return acc
                            }, {} as Record<string, number>)
                            
                            const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#eab308', '#ef4444']
                            
                            return Object.entries(categories).map(([category, count], index) => ({
                              name: category,
                              value: count,
                              color: COLORS[index % COLORS.length]
                            }))
                          })()}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(() => {
                            const categories = DEMO_CARS.reduce((acc, car) => {
                              acc[car.category] = (acc[car.category] || 0) + 1
                              return acc
                            }, {} as Record<string, number>)
                            
                            const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#eab308', '#ef4444']
                            
                            return Object.entries(categories).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          })()}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 space-y-1">
                    {(() => {
                      const categories = DEMO_CARS.reduce((acc, car) => {
                        acc[car.category] = (acc[car.category] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                      
                      const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#eab308', '#ef4444']
                      
                      return Object.entries(categories).map(([category, count], index) => (
                        <div key={category} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-gray-700">{category}</span>
                          </div>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
                <div className="space-y-4">
                  {pendingBookings.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-yellow-900">{pendingBookings.length} pending bookings</div>
                          <div className="text-sm text-yellow-700">Require admin approval</div>
                        </div>
                        <button className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-700 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  )}
                  {getPendingPayments().length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-orange-900">{getPendingPayments().length} pending payments</div>
                          <div className="text-sm text-orange-700">Invoices to be sent</div>
                        </div>
                        <button className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                          Process
                        </button>
                      </div>
                    </div>
                  )}
                  {carsDueService.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-900">{carsDueService.length} cars need service</div>
                          <div className="text-sm text-red-700">Schedule maintenance</div>
                        </div>
                        <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
                          Schedule
                        </button>
                      </div>
                    </div>
                  )}
                  {pendingBookings.length === 0 && getPendingPayments().length === 0 && carsDueService.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">All caught up!</p>
                      <p className="text-xs text-gray-500">No pending actions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Total Users</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.total_users}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Avg. Daily Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900">$85</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Conversion Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900">68%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Avg. Rental Duration</span>
                    </div>
                    <span className="font-semibold text-gray-900">3.2 days</span>
                  </div>
                </div>
                </div>
              </div>

              {/* Recent Activity */}
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs text-green-600 font-medium">Live</span>
                   <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">View All</button>
                      </div>
                    </div>
               <div className="space-y-4">
                 {DEMO_BOOKINGS.slice(0, 5).map((booking, index) => {
                   const user = DEMO_USERS.find(u => u.id === booking.user_id)
                   const car = DEMO_CARS.find(c => c.id === booking.car_id)
                   const timeAgo = (() => {
                     const now = new Date()
                     const created = new Date(booking.created_at)
                     const diff = now.getTime() - created.getTime()
                     const minutes = Math.floor(diff / (1000 * 60))
                     const hours = Math.floor(minutes / 60)
                     const days = Math.floor(hours / 24)
                     
                     if (days > 0) return `${days}d ago`
                     if (hours > 0) return `${hours}h ago`
                     if (minutes > 0) return `${minutes}m ago`
                     return 'Just now'
                   })()
                   
                   return (
                     <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                       <div className="relative">
                         <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                           <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                </div>
                         {index === 0 && (
                           <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                         )}
              </div>
                       <div className="flex-1">
                         <div className="flex items-center gap-2">
                           <span className="font-medium text-gray-900">
                             {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                           </span>
                           <span className="text-sm text-gray-500">booked</span>
                           <span className="font-medium text-gray-900">
                             {car ? `${car.year} ${car.make} ${car.model}` : `Car ${booking.car_id}`}
                           </span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                           <span>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span>
                           <span>•</span>
                           <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{timeAgo}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <StatusBadge status={booking.status}>{booking.status.replace('_', ' ')}</StatusBadge>
                         <span className="text-sm font-medium text-gray-900">${booking.total_cost}</span>
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>
          </div>
        )
      
      case 'bookings':
        return (
          <div className="space-y-6">
            {/* Header with Stats and Actions */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Booking Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage all car rental bookings and payments</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium">
                    Export Data
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Bulk Actions
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-900">{filteredBookings.length}</div>
                  <div className="text-sm text-blue-700">Total Bookings</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-900">
                    {filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-green-700">Active Bookings</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-900">
                    {filteredBookings.filter(b => b.payment_status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-700">Pending Payments</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-900">
                    ${filteredBookings.reduce((sum, b) => sum + b.total_cost, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-700">Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="search-bookings" className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    id="search-bookings"
                    type="text"
                    placeholder="Search bookings, users, cars..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    aria-label="Search bookings"
                    value={bookingSearch}
                    onChange={(e)=>setBookingSearch(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    id="status-filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    aria-label="Filter by booking status"
                    value={bookingStatus}
                    onChange={(e)=>setBookingStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select 
                    id="payment-filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    aria-label="Filter by payment status"
                    value={bookingPayment}
                    onChange={(e)=>setBookingPayment(e.target.value)}
                  >
                    <option value="">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="invoice_sent">Invoice Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select 
                    id="date-filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    aria-label="Filter by date range"
                    value={bookingDateRange}
                    onChange={(e)=>setBookingDateRange(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Bookings Table */}
          <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                  <div className="text-sm text-gray-600">
                    Showing {filteredBookings.length} of {DEMO_BOOKINGS.length} bookings
            </div>
                </div>
              </div>
              
            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300" 
                            aria-label="Select all bookings"
                          />
                          <span className="text-sm font-semibold text-gray-700">Booking</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Customer</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Vehicle</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Rental Period</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Status</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Invoice</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Payment</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Total</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold text-gray-700">Actions</span>
                      </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const car = DEMO_CARS.find(c => c.id === booking.car_id)
                    const user = DEMO_USERS.find(u => u.id === booking.user_id)
                      const startDate = new Date(booking.start_date)
                      const endDate = new Date(booking.end_date)
                      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                      
                    return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300" 
                              aria-label={`Select booking ${booking.id}`}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">#{booking.id}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-600">{user?.email || 'No email'}</div>
                              <div className="text-xs text-gray-500">{booking.phone_number}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={car?.image_url || '/placeholder.svg'} 
                                alt={car?.make || 'Car'}
                                className="w-12 h-8 rounded object-cover bg-gray-100"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {car ? `${car.year} ${car.make} ${car.model}` : `Car ${booking.car_id}`}
                                </div>
                                <div className="text-sm text-gray-600">{car?.license_plate || 'No plate'}</div>
                                <div className="text-xs text-gray-500">{car?.category} • {car?.transmission}</div>
                              </div>
                            </div>
                        </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">{duration} day{duration !== 1 ? 's' : ''}</div>
                              <div className="text-xs text-gray-500">
                                {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status}>{booking.status.replace('_', ' ')}</StatusBadge>
                            {booking.special_requests && (
                              <div className="text-xs text-gray-500 mt-1">
                                Special requests included
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-700">{booking.invoice_id || '—'}</div>
                              <StatusBadge status={booking.invoice_status || 'draft'}>{(booking.invoice_status || 'draft')}</StatusBadge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <StatusBadge status={booking.payment_status}>{booking.payment_status.replace('_', ' ')}</StatusBadge>
                              {booking.promo_code && (
                                <div className="text-xs text-green-600 mt-1">
                                  Promo: {booking.promo_code}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">${booking.total_cost.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">
                                ${(booking.total_cost / duration).toFixed(0)}/day
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="View Details" onClick={() => handleViewBooking(booking)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit Booking" onClick={() => handleViewBooking(booking)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Send Invoice" onClick={() => handleSendInvoice(booking)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel Booking" onClick={() => handleCancelBooking(booking)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing 1 to {filteredBookings.length} of {filteredBookings.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
                      Previous
                    </button>
                    <span className="px-3 py-1 bg-sky-600 text-white rounded text-sm">1</span>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'fleet':
        return <CarManagement />

      case 'users':
        return (
           <div className="space-y-6">
             {/* Header with Stats and Actions */}
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div>
                   <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                   <p className="text-sm text-gray-600 mt-1">Manage customer accounts, roles, and loyalty programs</p>
            </div>
                 <div className="flex gap-3">
                   <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium">
                     Add New User
                   </button>
                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                     Export Users
                   </button>
                 </div>
               </div>
               
               {/* Quick Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                   <div className="text-2xl font-bold text-blue-900">{DEMO_USERS.length}</div>
                   <div className="text-sm text-blue-700">Total Users</div>
                 </div>
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <div className="text-2xl font-bold text-green-900">
                     {DEMO_USERS.filter(u => u.role === 'customer').length}
                   </div>
                   <div className="text-sm text-green-700">Customers</div>
                 </div>
                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                   <div className="text-2xl font-bold text-purple-900">
                     {DEMO_USERS.filter(u => u.role === 'admin').length}
                   </div>
                   <div className="text-sm text-purple-700">Administrators</div>
                 </div>
                 <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                   <div className="text-2xl font-bold text-orange-900">
                     {DEMO_USERS.reduce((sum, u) => sum + (u.loyalty_points ?? 0), 0).toLocaleString()}
                   </div>
                   <div className="text-sm text-orange-700">Total Loyalty Points</div>
                 </div>
               </div>
             </div>

             {/* Filters and Search */}
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                   <label htmlFor="search-users" className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                   <input
                     id="search-users"
                     type="text"
                     placeholder="Search by name, email, phone..."
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                     aria-label="Search users"
                   />
                 </div>
                 <div>
                   <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                   <select 
                     id="role-filter"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                     aria-label="Filter by user role"
                   >
                     <option value="">All Roles</option>
                     <option value="customer">Customer</option>
                     <option value="admin">Admin</option>
                     <option value="owner">Owner</option>
                   </select>
                 </div>
                 <div>
                   <label htmlFor="loyalty-filter" className="block text-sm font-medium text-gray-700 mb-2">Loyalty Status</label>
                   <select 
                     id="loyalty-filter"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                     aria-label="Filter by loyalty status"
                   >
                     <option value="">All Users</option>
                     <option value="bronze">Bronze (0-100 points)</option>
                     <option value="silver">Silver (101-500 points)</option>
                     <option value="gold">Gold (501+ points)</option>
                   </select>
                 </div>
                 <div>
                   <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                   <select 
                     id="date-filter"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                     aria-label="Filter by join date"
                   >
                     <option value="">All Time</option>
                     <option value="week">This Week</option>
                     <option value="month">This Month</option>
                     <option value="quarter">This Quarter</option>
                     <option value="year">This Year</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* Enhanced Users Table */}
             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               <div className="px-6 py-4 border-b bg-gray-50">
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                   <div className="text-sm text-gray-600">
                     Showing {DEMO_USERS.length} of {DEMO_USERS.length} users
                   </div>
                 </div>
               </div>
               
            <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-50 border-b">
                     <tr>
                       <th className="px-6 py-4 text-left">
                         <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             className="rounded border-gray-300" 
                             aria-label="Select all users"
                           />
                           <span className="text-sm font-semibold text-gray-700">User</span>
                         </div>
                       </th>
                       <th className="px-6 py-4 text-left">
                         <span className="text-sm font-semibold text-gray-700">Contact</span>
                       </th>
                       <th className="px-6 py-4 text-left">
                         <span className="text-sm font-semibold text-gray-700">Role & Status</span>
                       </th>
                       <th className="px-6 py-4 text-left">
                         <span className="text-sm font-semibold text-gray-700">Loyalty</span>
                       </th>
                       <th className="px-6 py-4 text-left">
                         <span className="text-sm font-semibold text-gray-700">Activity</span>
                       </th>
                       <th className="px-6 py-4 text-left">
                         <span className="text-sm font-semibold text-gray-700">Actions</span>
                       </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                     {DEMO_USERS.map((user) => {
                       const userBookings = DEMO_BOOKINGS.filter(b => b.user_id === user.id)
                       const totalSpent = userBookings.reduce((sum, b) => sum + b.total_cost, 0)
                       const loyaltyTier = (user.loyalty_points ?? 0) >= 501 ? 'Gold' : (user.loyalty_points ?? 0) >= 101 ? 'Silver' : 'Bronze'
                       const loyaltyColor = loyaltyTier === 'Gold' ? 'text-yellow-600' : loyaltyTier === 'Silver' ? 'text-gray-600' : 'text-orange-600'
                       
                       return (
                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <input 
                                 type="checkbox" 
                                 className="rounded border-gray-300" 
                                 aria-label={`Select user ${user.id}`}
                               />
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                   <span className="text-sky-700 font-semibold text-sm">
                                     {user.first_name?.[0]}{user.last_name?.[0]}
                                   </span>
                                 </div>
                                 <div>
                                   <div className="font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                                   <div className="text-xs text-gray-500">ID: {user.id}</div>
                                 </div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div>
                               <div className="font-medium text-gray-900">{user.email}</div>
                               <div className="text-sm text-gray-600">{user.phone || 'No phone'}</div>
                               <div className="text-xs text-gray-500">
                                 Joined {new Date(user.created_at).toLocaleDateString()}
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="space-y-2">
                               <div>
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                   user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                   user.role === 'owner' ? 'bg-purple-100 text-purple-800' : 
                                   'bg-blue-100 text-blue-800'
                                 }`}>
                          {user.role}
                        </span>
                               </div>
                               <div className="text-xs text-gray-500">
                                 {userBookings.length} bookings • ${totalSpent.toLocaleString()} spent
                               </div>
                             </div>
                      </td>
                           <td className="px-6 py-4">
                             <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                 <span className={`text-sm font-medium ${loyaltyColor}`}>{loyaltyTier}</span>
                                 <span className="text-xs text-gray-500">({user.loyalty_points ?? 0} pts)</span>
                               </div>
                               <div className="w-full bg-gray-200 rounded-full h-1.5">
                                 <div 
                                   className={`h-1.5 rounded-full ${
                                     loyaltyTier === 'Gold' ? 'bg-yellow-500' : 
                                     loyaltyTier === 'Silver' ? 'bg-gray-500' : 
                                     'bg-orange-500'
                                   }`}
                                   style={{ 
                                     width: `${Math.min(((user.loyalty_points ?? 0) / 500) * 100, 100)}%` 
                                   }}
                                 ></div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="space-y-1">
                               <div className="text-sm text-gray-900">
                                 Last active: {userBookings.length > 0 ? 
                                   new Date(userBookings[userBookings.length - 1].created_at).toLocaleDateString() : 
                                   'Never'
                                 }
                               </div>
                               <div className="text-xs text-gray-500">
                                 {userBookings.length > 0 ? 
                                   `${userBookings.filter(b => b.status === 'completed').length} completed rentals` : 
                                   'No rentals yet'
                                 }
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <button className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="View Profile">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                 </svg>
                               </button>
                               <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit User">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                 </svg>
                               </button>
                               <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="View Bookings">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                 </svg>
                               </button>
                               <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Send Message">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                 </svg>
                               </button>
                               {user.role !== 'admin' && user.role !== 'owner' && (
                                 <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend User">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                   </svg>
                                 </button>
                               )}
                             </div>
                           </td>
                    </tr>
                       )
                     })}
                </tbody>
              </table>
               </div>
               
               {/* Pagination */}
               <div className="px-6 py-4 border-t bg-gray-50">
                 <div className="flex items-center justify-between">
                   <div className="text-sm text-gray-600">
                     Showing 1 to {DEMO_USERS.length} of {DEMO_USERS.length} results
                   </div>
                   <div className="flex items-center gap-2">
                     <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
                       Previous
                     </button>
                     <span className="px-3 py-1 bg-sky-600 text-white rounded text-sm">1</span>
                     <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
                       Next
                     </button>
                   </div>
                 </div>
               </div>
             </div>

             {/* Loyalty Program Overview */}
             <div className="grid lg:grid-cols-2 gap-6">
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Program Overview</h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                         </svg>
                       </div>
                       <div>
                         <div className="font-medium text-yellow-900">Gold Members</div>
                         <div className="text-sm text-yellow-700">501+ points</div>
                       </div>
                     </div>
                     <span className="font-semibold text-yellow-900">
                       {DEMO_USERS.filter(u => (u.loyalty_points ?? 0) >= 501).length}
                     </span>
                   </div>
                   
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                         </svg>
                       </div>
                       <div>
                         <div className="font-medium text-gray-900">Silver Members</div>
                         <div className="text-sm text-gray-700">101-500 points</div>
                       </div>
                     </div>
                     <span className="font-semibold text-gray-900">
                       {DEMO_USERS.filter(u => (u.loyalty_points ?? 0) >= 101 && (u.loyalty_points ?? 0) < 501).length}
                     </span>
                   </div>
                   
                   <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                         </svg>
                       </div>
                       <div>
                         <div className="font-medium text-orange-900">Bronze Members</div>
                         <div className="text-sm text-orange-700">0-100 points</div>
                       </div>
                     </div>
                     <span className="font-semibold text-orange-900">
                       {DEMO_USERS.filter(u => (u.loyalty_points ?? 0) < 101).length}
                     </span>
                   </div>
                 </div>
               </div>

               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
                 <div className="space-y-3">
                   {DEMO_USERS.slice(0, 4).map((user) => {
                     const userBookings = DEMO_BOOKINGS.filter(b => b.user_id === user.id)
                     const lastBooking = userBookings[userBookings.length - 1]
                     
                     return (
                       <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                         <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                           <span className="text-sky-700 font-medium text-xs">
                             {user.first_name?.[0]}{user.last_name?.[0]}
                           </span>
                         </div>
                         <div className="flex-1">
                           <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                           <div className="text-xs text-gray-500">
                             {lastBooking ? 
                               `Last booking: ${new Date(lastBooking.created_at).toLocaleDateString()}` : 
                               'No bookings yet'
                             }
                           </div>
                         </div>
                         <div className="text-xs text-gray-500">
                           {userBookings.length} bookings
                         </div>
                       </div>
                     )
                   })}
                 </div>
               </div>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Maintenance Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Track service schedules, monitor vehicle health, and manage maintenance operations</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium">
                    Schedule Service
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Export Report
                  </button>
                </div>
              </div>
              
              {/* Maintenance Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-900">{DEMO_CARS.filter(c => c.status === 'available').length}</div>
                  <div className="text-sm text-green-700">Healthy</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-900">{DEMO_CARS.filter(c => c.current_odometer - c.last_service_odometer > c.service_threshold_km * 0.8).length}</div>
                  <div className="text-sm text-yellow-700">Due Soon</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-900">{carsDueService.length}</div>
                  <div className="text-sm text-red-700">Overdue</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-900">{DEMO_CARS.filter(c => c.status === 'under_maintenance').length}</div>
                  <div className="text-sm text-blue-700">In Service</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-900">${DEMO_CARS.reduce((sum, car) => sum + (car.current_odometer - car.last_service_odometer > car.service_threshold_km ? 150 : 0), 0)}</div>
                  <div className="text-sm text-purple-700">Service Cost</div>
                </div>
              </div>
            </div>

            {/* Service Alerts */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Service Alerts</h3>
                  <p className="text-sm text-gray-600 mt-1">Vehicles requiring immediate attention</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">Live Updates</span>
                </div>
              </div>
              
              {carsDueService.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-green-900 mb-2">All Systems Operational</h4>
                  <p className="text-green-600">All vehicles are up to date with service requirements.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carsDueService.map((car) => {
                    const overdueKm = car.current_odometer - car.last_service_odometer - car.service_threshold_km
                    const severity = overdueKm > 2000 ? 'critical' : overdueKm > 1000 ? 'high' : 'medium'
                    
                    return (
                      <div key={car.id} className={`border rounded-lg p-4 ${
                        severity === 'critical' ? 'bg-red-50 border-red-200' :
                        severity === 'high' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              severity === 'critical' ? 'bg-red-500' :
                              severity === 'high' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }`}>
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                        <div>
                              <div className="font-semibold text-gray-900">{car.year} {car.make} {car.model}</div>
                              <div className="text-sm text-gray-600">License: {car.license_plate}</div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`font-medium ${
                                  severity === 'critical' ? 'text-red-700' :
                                  severity === 'high' ? 'text-orange-700' :
                                  'text-yellow-700'
                                }`}>
                                  Overdue by {overdueKm.toLocaleString()} km
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">Current: {car.current_odometer.toLocaleString()} km</span>
                          </div>
                        </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">Estimated Cost</div>
                              <div className="text-lg font-bold text-gray-900">$150</div>
                            </div>
                            <button className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
                              severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                              severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-yellow-600 hover:bg-yellow-700'
                            }`}>
                              Schedule Now
                        </button>
                      </div>
                    </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Maintenance Schedule & Upcoming Services */}
            <div className="grid lg:grid-cols-2 gap-6">
            {/* Maintenance Schedule */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Standard Service Interval</div>
                      <div className="text-sm text-blue-700">{stats.service_threshold_km.toLocaleString()} km</div>
              </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Oil Change Interval</div>
                      <div className="text-sm text-green-700">5,000 km</div>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Tire Rotation</div>
                      <div className="text-sm text-purple-700">10,000 km</div>
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Services */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Services</h3>
                <div className="space-y-3">
                  {DEMO_CARS.filter(car => 
                    car.current_odometer - car.last_service_odometer > car.service_threshold_km * 0.7 &&
                    car.current_odometer - car.last_service_odometer <= car.service_threshold_km
                  ).slice(0, 3).map((car) => {
                    const remainingKm = car.service_threshold_km - (car.current_odometer - car.last_service_odometer)
                    const progress = ((car.current_odometer - car.last_service_odometer) / car.service_threshold_km) * 100
                    
                    return (
                      <div key={car.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{car.year} {car.make} {car.model}</div>
                          <span className="text-sm text-gray-500">{remainingKm.toLocaleString()} km remaining</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">License: {car.license_plate}</span>
                          <button className="text-sky-600 hover:text-sky-700 font-medium">Schedule</button>
                        </div>
                      </div>
                    )
                  })}
                  
                  {DEMO_CARS.filter(car => 
                    car.current_odometer - car.last_service_odometer > car.service_threshold_km * 0.7 &&
                    car.current_odometer - car.last_service_odometer <= car.service_threshold_km
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No upcoming services scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service History */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Service History</h3>
                <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Odometer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {DEMO_CARS.slice(0, 5).map((car) => {
                      const lastServiceDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
                      const serviceTypes = ['Oil Change', 'Brake Service', 'Tire Rotation', 'Full Service', 'Inspection']
                      const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
                      const cost = Math.floor(Math.random() * 200) + 50
                      
                      return (
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900">{car.year} {car.make} {car.model}</div>
                              <div className="text-sm text-gray-600">{car.license_plate}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {lastServiceDate.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {serviceType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {car.last_service_odometer.toLocaleString()} km
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            ${cost}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-6">
            {/* Header with Export Options */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Reports & Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive insights into fleet performance, revenue, and operational metrics</p>
              </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium">
                    Export PDF
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Export Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-900">${stats.monthly_revenue.toLocaleString()}</div>
                    <div className="text-sm font-medium text-green-700">Monthly Revenue</div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600">+12.5% vs last month</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{Math.round((stats.active_bookings / stats.total_cars) * 100)}%</div>
                    <div className="text-sm font-medium text-blue-700">Fleet Utilization</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">{stats.active_bookings} active bookings</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{DEMO_BOOKINGS.length}</div>
                    <div className="text-sm font-medium text-purple-700">Total Bookings</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-purple-600">+8.2% vs last month</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-900">${(DEMO_BOOKINGS.reduce((sum, b) => sum + b.total_cost, 0)).toLocaleString()}</div>
                    <div className="text-sm font-medium text-orange-700">Total Revenue</div>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-orange-600">All time earnings</div>
              </div>
            </div>

                         {/* Revenue Trends Chart */}
             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                 <select className="text-sm border border-gray-300 rounded-lg px-3 py-1" aria-label="Select time period">
                   <option>Last 7 days</option>
                   <option>Last 30 days</option>
                   <option>Last 3 months</option>
                   <option>Last 6 months</option>
                 </select>
               </div>
               <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart
                     data={[
                       { month: 'Jan', revenue: 4200, bookings: 45 },
                       { month: 'Feb', revenue: 3800, bookings: 38 },
                       { month: 'Mar', revenue: 5200, bookings: 52 },
                       { month: 'Apr', revenue: 4800, bookings: 48 },
                       { month: 'May', revenue: 6100, bookings: 61 },
                       { month: 'Jun', revenue: 5500, bookings: 55 },
                       { month: 'Jul', revenue: 6800, bookings: 68 },
                       { month: 'Aug', revenue: 7200, bookings: 72 },
                       { month: 'Sep', revenue: 6500, bookings: 65 },
                       { month: 'Oct', revenue: 7800, bookings: 78 },
                       { month: 'Nov', revenue: 7100, bookings: 71 },
                       { month: 'Dec', revenue: 8500, bookings: 85 }
                     ]}
                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                   >
                     <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                       </linearGradient>
                       <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="month" 
                       stroke="#64748b" 
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}
                     />
                     <YAxis 
                       stroke="#64748b" 
                       fontSize={12}
                       tickLine={false}
                       axisLine={false}
                       tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                     />
                     <Tooltip 
                       contentStyle={{
                         backgroundColor: '#ffffff',
                         border: '1px solid #e2e8f0',
                         borderRadius: '8px',
                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                       }}
                       formatter={(value, _name) => [
                         _name === 'revenue' ? `$${Number(value).toLocaleString()}` : value,
                         _name === 'revenue' ? 'Revenue' : 'Bookings'
                       ]}
                     />
                     <Legend />
                     <Area 
                       type="monotone" 
                       dataKey="revenue" 
                       stroke="#0ea5e9" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorRevenue)" 
                     />
                     <Area 
                       type="monotone" 
                       dataKey="bookings" 
                       stroke="#8b5cf6" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorBookings)" 
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-4 flex items-center justify-between text-sm">
                 <span className="text-gray-600">Total: ${(stats.monthly_revenue * 12).toLocaleString()}</span>
                 <span className="text-green-600 font-medium">+15.3% vs last year</span>
               </div>
             </div>

            {/* Fleet Performance & Category Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Fleet Performance */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Available Cars</span>
                      <span className="text-sm text-gray-600">{stats.available_cars}/{stats.total_cars}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.available_cars / stats.total_cars) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Cars in Use</span>
                      <span className="text-sm text-gray-600">{stats.active_bookings}/{stats.total_cars}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.active_bookings / stats.total_cars) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Under Maintenance</span>
                      <span className="text-sm text-gray-600">{DEMO_CARS.filter(c => c.status === 'under_maintenance').length}/{stats.total_cars}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(DEMO_CARS.filter(c => c.status === 'under_maintenance').length / stats.total_cars) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

                             {/* Category Distribution */}
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet by Category</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart
                       data={(() => {
                         const categories = DEMO_CARS.reduce((acc, car) => {
                           acc[car.category] = (acc[car.category] || 0) + 1
                           return acc
                         }, {} as Record<string, number>)
                         
                         return Object.entries(categories).map(([category, count]) => ({
                           category,
                           count,
                           percentage: (count / stats.total_cars) * 100
                         }))
                       })()}
                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                     >
                       <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="category" 
                         stroke="#64748b" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                       />
                       <YAxis 
                         stroke="#64748b" 
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                       />
                       <Tooltip 
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: '1px solid #e2e8f0',
                           borderRadius: '8px',
                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                         }}
                         formatter={(value) => [value, 'Vehicles']}
                       />
                       <Bar 
                         dataKey="count" 
                         fill="#0ea5e9" 
                         radius={[4, 4, 0, 0]}
                         maxBarSize={50}
                       />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
            </div>

                         {/* Booking Analytics */}
             <div className="grid lg:grid-cols-2 gap-6">
               {/* Booking Status Distribution */}
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Status Distribution</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={(() => {
                           const statusCounts = DEMO_BOOKINGS.reduce((acc, booking) => {
                             acc[booking.status] = (acc[booking.status] || 0) + 1
                             return acc
                           }, {} as Record<string, number>)
                           
                           const COLORS = ['#eab308', '#22c55e', '#3b82f6', '#6b7280', '#ef4444']
                           
                           return Object.entries(statusCounts).map(([status, count], index) => ({
                             name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
                             value: count,
                             color: COLORS[index % COLORS.length]
                           }))
                         })()}
                         cx="50%"
                         cy="50%"
                         labelLine={false}
                                                   label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                         outerRadius={80}
                         fill="#8884d8"
                         dataKey="value"
                       >
                         {(() => {
                           const statusCounts = DEMO_BOOKINGS.reduce((acc, booking) => {
                             acc[booking.status] = (acc[booking.status] || 0) + 1
                             return acc
                           }, {} as Record<string, number>)
                           
                           const COLORS = ['#eab308', '#22c55e', '#3b82f6', '#6b7280', '#ef4444']
                           
                           return Object.entries(statusCounts).map((_, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))
                         })()}
                       </Pie>
                       <Tooltip 
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: '1px solid #e2e8f0',
                           borderRadius: '8px',
                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                         }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* Revenue by Car Category */}
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Car Category</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={(() => {
                           const categoryRevenue = DEMO_BOOKINGS.reduce((acc, booking) => {
                             const car = DEMO_CARS.find(c => c.id === booking.car_id)
                             if (car) {
                               acc[car.category] = (acc[car.category] || 0) + booking.total_cost
                             }
                             return acc
                           }, {} as Record<string, number>)
                           
                           const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#eab308', '#ef4444']
                           
                           return Object.entries(categoryRevenue).map(([category, revenue], index) => ({
                             name: category,
                             value: revenue,
                             color: COLORS[index % COLORS.length]
                           }))
                         })()}
                         cx="50%"
                         cy="50%"
                         labelLine={false}
                                                   label={({ name, value }) => `${name}: $${(value || 0).toLocaleString()}`}
                         outerRadius={80}
                         fill="#8884d8"
                         dataKey="value"
                       >
                         {(() => {
                           const categoryRevenue = DEMO_BOOKINGS.reduce((acc, booking) => {
                             const car = DEMO_CARS.find(c => c.id === booking.car_id)
                             if (car) {
                               acc[car.category] = (acc[car.category] || 0) + booking.total_cost
                             }
                             return acc
                           }, {} as Record<string, number>)
                           
                           const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#eab308', '#ef4444']
                           
                           return Object.entries(categoryRevenue).map((_, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))
                         })()}
                       </Pie>
                       <Tooltip 
                         contentStyle={{
                           backgroundColor: '#ffffff',
                           border: '1px solid #e2e8f0',
                           borderRadius: '8px',
                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                         }}
                         formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             </div>

            {/* Customer Analytics */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Analytics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600">{DEMO_USERS.length}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="text-xs text-green-600 mt-1">+5 this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {DEMO_USERS.filter(u => (u.loyalty_points ?? 0) >= 501).length}
                  </div>
                  <div className="text-sm text-gray-600">Gold Members</div>
                  <div className="text-xs text-purple-600 mt-1">Premium customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    ${(DEMO_BOOKINGS.reduce((sum, b) => sum + b.total_cost, 0) / DEMO_USERS.length).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Customer Value</div>
                  <div className="text-xs text-orange-600 mt-1">Lifetime value</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {DEMO_BOOKINGS.slice(0, 5).map((booking, index) => {
                  const user = DEMO_USERS.find(u => u.id === booking.user_id)
                  const car = DEMO_CARS.find(c => c.id === booking.car_id)
                  const timeAgo = (() => {
                    const now = new Date()
                    const bookingDate = new Date(booking.created_at)
                    const diffInHours = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60))
                    if (diffInHours < 1) return 'Just now'
                    if (diffInHours < 24) return `${diffInHours}h ago`
                    const diffInDays = Math.floor(diffInHours / 24)
                    return `${diffInDays}d ago`
                  })()
                  
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                          </span>
                          <span className="text-sm text-gray-500">booked</span>
                          <span className="font-medium text-gray-900">
                            {car ? `${car.year} ${car.make} ${car.model}` : `Car ${booking.car_id}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={booking.status}>{booking.status.replace('_', ' ')}</StatusBadge>
                        <span className="text-sm font-medium text-gray-900">${booking.total_cost}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'drivers':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Driver Profiles</h3>
                  <p className="text-sm text-gray-600 mt-1">View and manage driver details</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEMO_USERS.map((u) => {
                const userBookings = DEMO_BOOKINGS.filter(b => b.user_id === u.id)
                return (
                  <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <span className="text-sky-700 font-semibold text-sm">{u.first_name?.[0]}{u.last_name?.[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.first_name} {u.last_name}</div>
                        <div className="text-xs text-gray-500">ID: {u.id}</div>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="font-medium">{u.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Phone</span><span className="font-medium">{u.phone || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Role</span><span className="font-medium capitalize">{u.role}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Bookings</span><span className="font-medium">{userBookings.length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Loyalty</span><span className="font-medium">{u.loyalty_points ?? 0} pts</span></div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50" onClick={() => openDriverProfile(u.id)}>View Profile</button>
                      <a href={`/contact`} className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded hover:bg-sky-700">Contact</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Payments</h3>
                  <p className="text-sm text-gray-600 mt-1">All bookings and their payment statuses</p>
                </div>
                <div className="text-sm text-gray-600">Total Due: ${DEMO_BOOKINGS.filter(b=>b.payment_status==='pending').reduce((s,b)=>s+b.total_cost,0).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Payments Overview</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Booking</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {DEMO_BOOKINGS.map((b)=>{
                      const user = DEMO_USERS.find(u=>u.id===b.user_id)
                      const car = DEMO_CARS.find(c=>c.id===b.car_id)
                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">#{b.id}</td>
                          <td className="px-6 py-3">{user ? `${user.first_name} ${user.last_name}` : 'Unknown'}</td>
                          <td className="px-6 py-3">{car ? `${car.make} ${car.model}` : b.car_id}</td>
                          <td className="px-6 py-3">${b.total_cost.toLocaleString()}</td>
                          <td className="px-6 py-3"><StatusBadge status={b.payment_status}>{b.payment_status.replace('_',' ')}</StatusBadge></td>
                          <td className="px-6 py-3 flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50" onClick={()=>handleSendInvoice(b)}>Send Invoice</button>
                            <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700" onClick={()=>handlePaymentUpdate(b.id, 'paid')}>Mark Paid</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'driver_profile': {
        const user = DEMO_USERS.find(u => u.id === selectedDriverId)
        const bookings = DEMO_BOOKINGS.filter(b => b.user_id === selectedDriverId)
        const totalSpent = bookings.reduce((s, b) => s + b.total_cost, 0)
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Driver Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive driver information, vehicles and payments</p>
                </div>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50" onClick={() => setActiveSection('drivers')}>← Back to Drivers</button>
              </div>
            </div>

            {/* Driver summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-700 font-semibold">{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</div>
                    <div className="text-xs text-gray-500">ID: {user?.id}</div>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="font-medium break-all">{user?.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Phone</span><span className="font-medium">{user?.phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Role</span><span className="font-medium capitalize">{user?.role}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Loyalty</span><span className="font-medium">{user?.loyalty_points ?? 0} pts</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Total Spent</span><span className="font-medium">${totalSpent.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Vehicles and payments */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm md:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Bookings & Payments</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Booking</th>
                        <th className="px-4 py-3 text-left">Vehicle</th>
                        <th className="px-4 py-3 text-left">Period</th>
                        <th className="px-4 py-3 text-left">Payment</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map(b => {
                        const car = DEMO_CARS.find(c => c.id === b.car_id)
                        return (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">#{b.id}</td>
                            <td className="px-4 py-3">{car ? `${car.year} ${car.make} ${car.model}` : b.car_id}</td>
                            <td className="px-4 py-3">{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</td>
                            <td className="px-4 py-3"><StatusBadge status={b.payment_status}>{b.payment_status.replace('_',' ')}</StatusBadge></td>
                            <td className="px-4 py-3"><StatusBadge status={b.status}>{b.status.replace('_',' ')}</StatusBadge></td>
                            <td className="px-4 py-3">${b.total_cost.toLocaleString()}</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                              <button className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50" onClick={()=>handleSendInvoice(b)}>Send Invoice</button>
                              <button className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700" onClick={()=>handlePaymentUpdate(b.id,'paid')}>Mark Paid</button>
                              <button className="px-3 py-1.5 text-xs text-sky-600 border border-sky-200 rounded hover:bg-sky-50" onClick={()=>handleViewBooking(b)}>View</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      }

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

             {/* Booking Modal */}
       {showBookingModal && selectedBooking && (
         <BookingModal
           booking={selectedBooking}
           onClose={() => setShowBookingModal(false)}
           onStatusUpdate={handleStatusUpdate}
           onPaymentUpdate={handlePaymentUpdate}
         />
       )}
    </div>
  )
}

export default AdminDashboard