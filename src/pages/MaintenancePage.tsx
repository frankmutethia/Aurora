import * as React from 'react'
import { DEMO_CARS } from '../lib/demo-data'

// Mock maintenance data
const DEMO_MAINTENANCE = [
  {
    id: 1,
    car_id: 1,
    type: 'oil_change',
    description: 'Regular oil change and filter replacement',
    scheduled_date: '2024-01-15',
    completed_date: '2024-01-15',
    status: 'completed',
    cost: 120,
    mileage: 15000,
    technician: 'Mike Wilson',
    notes: 'Oil and filter changed. Next service due at 20,000km.'
  },
  {
    id: 2,
    car_id: 2,
    type: 'tire_rotation',
    description: 'Tire rotation and pressure check',
    scheduled_date: '2024-01-20',
    completed_date: null,
    status: 'scheduled',
    cost: 80,
    mileage: 12000,
    technician: 'Sarah Chen',
    notes: 'Standard tire rotation and inspection'
  },
  {
    id: 3,
    car_id: 3,
    type: 'brake_service',
    description: 'Brake pad replacement and rotor inspection',
    scheduled_date: '2024-01-18',
    completed_date: null,
    status: 'in_progress',
    cost: 350,
    mileage: 45000,
    technician: 'David Johnson',
    notes: 'Front brake pads worn. Replacing pads and inspecting rotors.'
  },
  {
    id: 4,
    car_id: 1,
    type: 'inspection',
    description: 'Annual safety and emissions inspection',
    scheduled_date: '2024-01-25',
    completed_date: null,
    status: 'scheduled',
    cost: 150,
    mileage: 18000,
    technician: 'Mike Wilson',
    notes: 'Annual inspection due'
  }
]

// Status badge component
const StatusBadge = ({ status, children }: { status: string; children: React.ReactNode }) => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {children}
    </span>
  )
}

const MaintenancePage = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [selectedMaintenance, setSelectedMaintenance] = React.useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [isNewMaintenanceModalOpen, setIsNewMaintenanceModalOpen] = React.useState(false)

  const filteredMaintenance = React.useMemo(() => {
    return DEMO_MAINTENANCE
      .filter(maintenance => {
        const car = DEMO_CARS.find(c => c.id === maintenance.car_id)
        const searchText = `${car?.make} ${car?.model} ${car?.license_plate} ${maintenance.description} ${maintenance.technician}`.toLowerCase()
        
        const matchesSearch = searchTerm === '' || searchText.includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter
        const matchesType = typeFilter === 'all' || maintenance.type === typeFilter
        
        return matchesSearch && matchesStatus && matchesType
      })
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
  }, [searchTerm, statusFilter, typeFilter])

  const maintenanceStats = React.useMemo(() => {
    const today = new Date()
    const overdueItems = DEMO_MAINTENANCE.filter(m => 
      new Date(m.scheduled_date) < today && m.status !== 'completed'
    )
    
    return {
      total: DEMO_MAINTENANCE.length,
      scheduled: DEMO_MAINTENANCE.filter(m => m.status === 'scheduled').length,
      inProgress: DEMO_MAINTENANCE.filter(m => m.status === 'in_progress').length,
      completed: DEMO_MAINTENANCE.filter(m => m.status === 'completed').length,
      overdue: overdueItems.length,
      totalCost: DEMO_MAINTENANCE.reduce((sum, m) => m.status === 'completed' ? sum + m.cost : sum, 0)
    }
  }, [])

  const openMaintenanceDetail = (maintenance: any) => {
    setSelectedMaintenance(maintenance)
    setIsDetailModalOpen(true)
  }

  const closeMaintenanceDetail = () => {
    setSelectedMaintenance(null)
    setIsDetailModalOpen(false)
  }

  const openNewMaintenanceModal = () => {
    setIsNewMaintenanceModalOpen(true)
  }

  const closeNewMaintenanceModal = () => {
    setIsNewMaintenanceModalOpen(false)
  }

  const handleStatusUpdate = (maintenanceId: number, newStatus: string) => {
    console.log(`Updating maintenance ${maintenanceId} status to ${newStatus}`)
    // In a real app, this would make an API call
  }

  const isOverdue = (scheduledDate: string, status: string) => {
    return new Date(scheduledDate) < new Date() && status !== 'completed'
  }

  const getMaintenanceTypeIcon = (type: string) => {
    const icons = {
      oil_change: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
        </svg>
      ),
      tire_rotation: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      brake_service: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      inspection: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return icons[type as keyof typeof icons] || icons.inspection
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
          <p className="text-gray-600">Track and schedule vehicle maintenance</p>
        </div>
        <button 
          onClick={openNewMaintenanceModal}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule Maintenance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{maintenanceStats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{maintenanceStats.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{maintenanceStats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{maintenanceStats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{maintenanceStats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">${maintenanceStats.totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
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
                placeholder="Search maintenance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Types</option>
              <option value="oil_change">Oil Change</option>
              <option value="tire_rotation">Tire Rotation</option>
              <option value="brake_service">Brake Service</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenance.map((maintenance) => {
                const car = DEMO_CARS.find(c => c.id === maintenance.car_id)
                const overdueStatus = isOverdue(maintenance.scheduled_date, maintenance.status)
                
                return (
                  <tr key={maintenance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {car ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{car.year} {car.make} {car.model}</div>
                          <div className="text-sm text-gray-500">{car.license_plate}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Car not found</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {getMaintenanceTypeIcon(maintenance.type)}
                        </div>
                        <span className="text-sm text-gray-900">{maintenance.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{maintenance.description}</div>
                      <div className="text-sm text-gray-500">Mileage: {maintenance.mileage.toLocaleString()}km</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${overdueStatus ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {new Date(maintenance.scheduled_date).toLocaleDateString()}
                      </div>
                      {maintenance.completed_date && (
                        <div className="text-sm text-gray-500">
                          Completed: {new Date(maintenance.completed_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={overdueStatus ? 'overdue' : maintenance.status}>
                        {overdueStatus ? 'Overdue' : maintenance.status.replace('_', ' ')}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {maintenance.technician}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${maintenance.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openMaintenanceDetail(maintenance)}
                          className="text-sky-600 hover:text-sky-900"
                        >
                          View
                        </button>
                        {maintenance.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(maintenance.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredMaintenance.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance records found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Maintenance Detail Modal */}
      {isDetailModalOpen && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance Details</h3>
                <button
                  onClick={closeMaintenanceDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {(() => {
                const car = DEMO_CARS.find(c => c.id === selectedMaintenance.car_id)
                const overdueStatus = isOverdue(selectedMaintenance.scheduled_date, selectedMaintenance.status)
                
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Vehicle Information</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500">Vehicle:</span>
                            <span className="ml-2 text-sm text-gray-900">
                              {car ? `${car.year} ${car.make} ${car.model}` : 'Car not found'}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">License Plate:</span>
                            <span className="ml-2 text-sm text-gray-900">{car?.license_plate || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Current Mileage:</span>
                            <span className="ml-2 text-sm text-gray-900">{selectedMaintenance.mileage.toLocaleString()}km</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Maintenance Information</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500">Type:</span>
                            <span className="ml-2 text-sm text-gray-900">{selectedMaintenance.type.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className="ml-2">
                              <StatusBadge status={overdueStatus ? 'overdue' : selectedMaintenance.status}>
                                {overdueStatus ? 'Overdue' : selectedMaintenance.status.replace('_', ' ')}
                              </StatusBadge>
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Technician:</span>
                            <span className="ml-2 text-sm text-gray-900">{selectedMaintenance.technician}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Cost:</span>
                            <span className="ml-2 text-sm font-medium text-gray-900">${selectedMaintenance.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Scheduled Date:</span>
                          <span className={`ml-2 text-sm ${overdueStatus ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {new Date(selectedMaintenance.scheduled_date).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedMaintenance.completed_date && (
                          <div>
                            <span className="text-sm text-gray-500">Completed Date:</span>
                            <span className="ml-2 text-sm text-gray-900">
                              {new Date(selectedMaintenance.completed_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedMaintenance.description}</p>
                    </div>
                    
                    {selectedMaintenance.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600">{selectedMaintenance.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {selectedMaintenance.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedMaintenance.id, 'completed')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
                        Edit Maintenance
                      </button>
                      <button
                        onClick={closeMaintenanceDetail}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Modal */}
      {isNewMaintenanceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Schedule New Maintenance</h3>
                <button
                  onClick={closeNewMaintenanceModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500">
                    <option value="">Select a vehicle</option>
                    {DEMO_CARS.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model} - {car.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500">
                    <option value="">Select type</option>
                    <option value="oil_change">Oil Change</option>
                    <option value="tire_rotation">Tire Rotation</option>
                    <option value="brake_service">Brake Service</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500" 
                    rows={3}
                    placeholder="Describe the maintenance work needed..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                  <input 
                    type="text" 
                    placeholder="Assigned technician"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                  >
                    Schedule Maintenance
                  </button>
                  <button
                    type="button"
                    onClick={closeNewMaintenanceModal}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenancePage
