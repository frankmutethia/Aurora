import * as React from 'react'

// Mock drivers data since it's not in the demo data
const DEMO_DRIVERS = [
  {
    id: 1,
    first_name: 'Marcus',
    last_name: 'Johnson',
    email: 'marcus.johnson@carental.com',
    phone: '+61 423 123 456',
    license_number: 'VIC123456789',
    license_expiry: '2025-08-15',
    hire_date: '2023-01-15',
    status: 'active',
    vehicle_assigned: 'CAR001',
    rating: 4.8,
    total_trips: 145
  },
  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@carental.com',
    phone: '+61 434 567 890',
    license_number: 'VIC987654321',
    license_expiry: '2024-12-22',
    hire_date: '2023-03-10',
    status: 'active',
    vehicle_assigned: 'CAR002',
    rating: 4.9,
    total_trips: 89
  },
  {
    id: 3,
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@carental.com',
    phone: '+61 445 678 901',
    license_number: 'NSW456789123',
    license_expiry: '2026-04-30',
    hire_date: '2022-11-05',
    status: 'on_leave',
    vehicle_assigned: null,
    rating: 4.7,
    total_trips: 203
  }
]

// Status badge component
const StatusBadge = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    on_leave: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  )
}

const DriversPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedDriver, setSelectedDriver] = React.useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)

  const filteredDrivers = React.useMemo(() => {
    return DEMO_DRIVERS.filter(driver => {
      const searchText = `${driver.first_name} ${driver.last_name} ${driver.email} ${driver.license_number}`.toLowerCase()
      const matchesSearch = searchTerm === '' || searchText.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const statusCounts = React.useMemo(() => {
    return DEMO_DRIVERS.reduce((acc, driver) => {
      acc[driver.status] = (acc[driver.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [])

  const openDriverDetail = (driver: any) => {
    setSelectedDriver(driver)
    setIsDetailModalOpen(true)
  }

  const closeDriverDetail = () => {
    setSelectedDriver(null)
    setIsDetailModalOpen(false)
  }

  const handleStatusUpdate = (driverId: number, newStatus: string) => {
    console.log(`Updating driver ${driverId} status to ${newStatus}`)
    // In a real app, this would make an API call
  }

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drivers Management</h2>
          <p className="text-gray-600">Manage driver profiles and assignments</p>
        </div>
        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{DEMO_DRIVERS.length}</div>
          <div className="text-sm text-gray-600">Total Drivers</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{statusCounts.active || 0}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.on_leave || 0}</div>
          <div className="text-sm text-gray-600">On Leave</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {DEMO_DRIVERS.filter(d => isLicenseExpiringSoon(d.license_expiry)).length}
          </div>
          <div className="text-sm text-gray-600">Licenses Expiring</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search drivers by name, email, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {driver.first_name.charAt(0)}{driver.last_name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {driver.first_name} {driver.last_name}
                </p>
                <p className="text-sm text-gray-500 truncate">{driver.email}</p>
              </div>
              <StatusBadge status={driver.status}>
                {driver.status.replace('_', ' ')}
              </StatusBadge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{driver.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">License:</span>
                <span className="text-gray-900">{driver.license_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expiry:</span>
                <span className={`font-medium ${isLicenseExpiringSoon(driver.license_expiry) ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(driver.license_expiry).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rating:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 mr-1">{driver.rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Trips:</span>
                <span className="text-gray-900">{driver.total_trips}</span>
              </div>
              {driver.vehicle_assigned && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Assigned Vehicle:</span>
                  <span className="text-gray-900">{driver.vehicle_assigned}</span>
                </div>
              )}
            </div>

            {isLicenseExpiringSoon(driver.license_expiry) && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-sm text-red-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  License expires soon!
                </div>
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => openDriverDetail(driver)}
                className="flex-1 bg-sky-50 text-sky-700 py-2 px-3 rounded-lg text-sm hover:bg-sky-100 transition-colors"
              >
                View Details
              </button>
              <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Driver Detail Modal */}
      {isDetailModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Driver Details</h3>
                <button
                  onClick={closeDriverDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Info */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xl mx-auto mb-4">
                        {selectedDriver.first_name.charAt(0)}{selectedDriver.last_name.charAt(0)}
                      </div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {selectedDriver.first_name} {selectedDriver.last_name}
                      </h4>
                      <StatusBadge status={selectedDriver.status}>
                        {selectedDriver.status.replace('_', ' ')}
                      </StatusBadge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-500">Email:</span>
                            <span className="ml-2 text-gray-900">{selectedDriver.email}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Phone:</span>
                            <span className="ml-2 text-gray-900">{selectedDriver.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">License Information</h5>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-500">License Number:</span>
                            <span className="ml-2 text-gray-900">{selectedDriver.license_number}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Expiry Date:</span>
                            <span className={`ml-2 font-medium ${isLicenseExpiringSoon(selectedDriver.license_expiry) ? 'text-red-600' : 'text-gray-900'}`}>
                              {new Date(selectedDriver.license_expiry).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Employment</h5>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-500">Hire Date:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(selectedDriver.hire_date).toLocaleDateString()}
                            </span>
                          </div>
                          {selectedDriver.vehicle_assigned && (
                            <div className="text-sm">
                              <span className="text-gray-500">Assigned Vehicle:</span>
                              <span className="ml-2 text-gray-900">{selectedDriver.vehicle_assigned}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Statistics</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedDriver.total_trips}</div>
                      <div className="text-sm text-blue-700">Total Trips</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{selectedDriver.rating}</div>
                      <div className="text-sm text-yellow-700">Rating</div>
                    </div>
                  </div>

                  {isLicenseExpiringSoon(selectedDriver.license_expiry) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-red-800">License Expiring Soon</div>
                          <div className="text-sm text-red-700">
                            Expires on {new Date(selectedDriver.license_expiry).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-900">Recent Activity</h5>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">No recent activity data available</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
                  Edit Driver
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedDriver.id, selectedDriver.status === 'active' ? 'suspended' : 'active')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  {selectedDriver.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={closeDriverDetail}
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

export default DriversPage
