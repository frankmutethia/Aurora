import * as React from 'react'
import { DEMO_USERS, DEMO_BOOKINGS } from '../lib/demo-data'

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)

  const filteredUsers = React.useMemo(() => {
    return DEMO_USERS.filter(user => {
      const searchText = `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase()
      return searchText.includes(searchTerm.toLowerCase())
    })
  }, [searchTerm])

  const openUserDetail = (user: any) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  const closeUserDetail = () => {
    setSelectedUser(null)
    setIsDetailModalOpen(false)
  }

  const getUserBookings = (userId: number) => {
    return DEMO_BOOKINGS.filter(booking => booking.user_id === userId)
  }

  const getUserStats = (userId: number) => {
    const bookings = getUserBookings(userId)
    return {
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, booking) => sum + booking.total_cost, 0),
      activeBookings: bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage customer accounts and profiles</p>
        </div>
        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="text-lg font-medium text-gray-900">{DEMO_USERS.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {DEMO_USERS.filter(user => {
                    const userBookings = getUserBookings(user.id)
                    return userBookings.some(b => b.status === 'confirmed' || b.status === 'in_progress')
                  }).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">
                  ${DEMO_BOOKINGS.reduce((sum, booking) => sum + booking.total_cost, 0).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Bookings</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {(DEMO_BOOKINGS.length / DEMO_USERS.length).toFixed(1)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const stats = getUserStats(user.id)
          return (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {(user.first_name || '').charAt(0)}{(user.last_name || '').charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bookings:</span>
                  <span className="font-medium text-gray-900">{stats.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Total Spent:</span>
                  <span className="font-medium text-gray-900">${stats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Active Bookings:</span>
                  <span className="font-medium text-gray-900">{stats.activeBookings}</span>
                </div>
              </div>

              {user.phone && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {user.phone}
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => openUserDetail(user)}
                  className="flex-1 bg-sky-50 text-sky-700 py-2 px-3 rounded-lg text-sm hover:bg-sky-100 transition-colors"
                >
                  View Details
                </button>
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* User Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={closeUserDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xl mx-auto mb-4">
                        {(selectedUser.first_name || '').charAt(0)}{(selectedUser.last_name || '').charAt(0)}
                      </div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h4>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      {selectedUser.phone && (
                        <p className="text-sm text-gray-500 mt-1">{selectedUser.phone}</p>
                      )}
                    </div>

                    <div className="mt-6 space-y-4">
                      {(() => {
                        const stats = getUserStats(selectedUser.id)
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Total Bookings:</span>
                              <span className="text-sm font-medium text-gray-900">{stats.totalBookings}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Total Spent:</span>
                              <span className="text-sm font-medium text-gray-900">${stats.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Active Bookings:</span>
                              <span className="text-sm font-medium text-gray-900">{stats.activeBookings}</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* Booking History */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Booking History</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {getUserBookings(selectedUser.id).map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Booking #{booking.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              ${booking.total_cost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getUserBookings(selectedUser.id).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No bookings found for this user.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
                  Edit User
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Create Booking
                </button>
                <button
                  onClick={closeUserDetail}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
