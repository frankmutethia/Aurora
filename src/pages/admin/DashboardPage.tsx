import * as React from 'react'
import { 
  DEMO_CARS, 
  DEMO_BOOKINGS, 
  DEMO_USERS, 
  getAvailableCars, 
  getCarsDueForService, 
  getPendingPayments, 
  getActiveBookings 
} from '../../lib/demo-data'
import type { DashboardStats } from '../../lib/types'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Area } from 'recharts'

const DashboardPage = () => {
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

  // Mock charts data
  const revenueByMonth = [
    { m: 'Jan', revenue: 4200, bookings: 12 },
    { m: 'Feb', revenue: 5100, bookings: 15 },
    { m: 'Mar', revenue: 6100, bookings: 18 },
    { m: 'Apr', revenue: 5700, bookings: 17 },
    { m: 'May', revenue: 6900, bookings: 20 },
    { m: 'Jun', revenue: 7300, bookings: 22 },
  ]

  const fleetByCategory = [
    { name: 'Sedan', count: 2 },
    { name: 'SUV', count: 2 },
    { name: 'Van', count: 1 },
    { name: 'Electric', count: 1 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{stats.total_cars}</div>
          <div className="text-sm text-blue-700">Total Cars</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">{stats.available_cars}</div>
          <div className="text-sm text-green-700">Available Cars</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">{stats.active_bookings}</div>
          <div className="text-sm text-purple-700">Active Bookings</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-900">{stats.pending_payments}</div>
          <div className="text-sm text-orange-700">Pending Payments</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors">
            <div className="text-sky-600 text-lg mb-2">🚗</div>
            <div className="text-sm font-medium text-sky-900">Manage Fleet</div>
          </button>
          
          <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 text-lg mb-2">📅</div>
            <div className="text-sm font-medium text-green-900">View Bookings</div>
          </button>
          
          <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 text-lg mb-2">💳</div>
            <div className="text-sm font-medium text-purple-900">Process Payments</div>
          </button>
          
          <button className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 text-lg mb-2">📊</div>
            <div className="text-sm font-medium text-orange-900">View Reports</div>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings (last 6 months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueByMonth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="#bae6fd" stroke="#38bdf8" name="Revenue ($)" />
                <Line type="monotone" dataKey="bookings" stroke="#a78bfa" name="Bookings" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
