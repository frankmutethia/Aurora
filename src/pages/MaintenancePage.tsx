import * as React from 'react'
import { fetchCars, toggleCarMaintenance, type Car } from '../lib/api'

const MaintenancePage: React.FC = () => {
  const [cars, setCars] = React.useState<Car[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null)
  const [isCarDetailModalOpen, setIsCarDetailModalOpen] = React.useState(false)

  React.useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('MaintenancePage: Loading cars...')
      const response = await fetchCars()
      console.log('MaintenancePage: Cars loaded:', response)
      setCars(response.data.data)
    } catch (err) {
      console.error('MaintenancePage: Error loading cars:', err)
      setError('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMaintenance = async (carId: number) => {
    try {
      console.log('MaintenancePage: Toggling maintenance for car:', carId)
      await toggleCarMaintenance(carId)
      console.log('MaintenancePage: Maintenance toggle successful')
      
      // Refresh the cars list
      await loadCars()
      
      // Update selected car if it's currently open
      if (selectedCar && selectedCar.id === carId) {
        const updatedCar = cars.find(car => car.id === carId)
        if (updatedCar) {
          setSelectedCar(updatedCar)
        }
      }
    } catch (err) {
      console.error('MaintenancePage: Error toggling maintenance:', err)
      setError('Failed to update maintenance status')
    }
  }

  const openCarDetail = (car: Car) => {
    setSelectedCar(car)
    setIsCarDetailModalOpen(true)
  }

  const closeCarDetail = () => {
    setSelectedCar(null)
    setIsCarDetailModalOpen(false)
  }

  // Filter cars based on search and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = searchTerm === '' || 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate car statistics
  const carStats = React.useMemo(() => {
    const total = cars.length
    const available = cars.filter(car => car.status === 'Available').length
    const underMaintenance = cars.filter(car => car.status === 'Under_maintenance').length
    const disabled = cars.filter(car => car.status === 'Disabled').length
    const serviceDue = cars.filter(car => 
      (car.current_odometer - car.last_service_odometer) >= car.service_threshold_km
    ).length

    return { total, available, underMaintenance, disabled, serviceDue }
  }, [cars])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <span className="ml-2 text-gray-600">Loading cars...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadCars}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
          <p className="text-gray-600">Track vehicle maintenance and service schedules</p>
        </div>
      </div>

      {/* Car Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{carStats.total}</div>
          <div className="text-sm text-gray-600">Total Cars</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{carStats.available}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{carStats.underMaintenance}</div>
          <div className="text-sm text-gray-600">Under Maintenance</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{carStats.disabled}</div>
          <div className="text-sm text-gray-600">Disabled</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{carStats.serviceDue}</div>
          <div className="text-sm text-gray-600">Service Due</div>
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
                placeholder="Search cars by make, model, or license plate..."
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
              <option value="Available">Available</option>
              <option value="Under_maintenance">Under Maintenance</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.map((car) => {
                const kmSinceService = car.current_odometer - car.last_service_odometer
                const serviceDue = kmSinceService >= car.service_threshold_km
                
                return (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {car.images && car.images.length > 0 && (
                          <img 
                            src={car.images[0].image_url}
                            alt={`${car.make} ${car.model}`}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {car.make} {car.model} ({car.year})
                          </div>
                          <div className="text-sm text-gray-500">{car.license_plate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        car.status === 'Available' ? 'bg-green-100 text-green-800' :
                        car.status === 'Under_maintenance' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {car.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{car.current_odometer.toLocaleString()} km</div>
                      <div className="text-xs text-gray-500">
                        Last service: {car.last_service_odometer.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {serviceDue ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Service Due ({kmSinceService.toLocaleString()} km)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          OK ({(car.service_threshold_km - kmSinceService).toLocaleString()} km remaining)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openCarDetail(car)}
                          className="text-sky-600 hover:text-sky-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleToggleMaintenance(car.id)}
                          className={`${
                            car.status === 'Under_maintenance' 
                              ? 'text-green-600 hover:text-green-900'
                              : 'text-orange-600 hover:text-orange-900'
                          }`}
                        >
                          {car.status === 'Under_maintenance' ? 'Remove from Maintenance' : 'Put in Maintenance'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Car Detail Modal */}
      {isCarDetailModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Car Maintenance Details</h3>
                <button
                  onClick={closeCarDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedCar.images && selectedCar.images.length > 0 && (
                    <img 
                      src={selectedCar.images[0].image_url}
                      alt={`${selectedCar.make} ${selectedCar.model}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-medium text-gray-900">
                      {selectedCar.make} {selectedCar.model} ({selectedCar.year})
                    </h4>
                    <p className="text-gray-500">{selectedCar.license_plate}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedCar.status === 'Available' ? 'bg-green-100 text-green-800' :
                      selectedCar.status === 'Under_maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedCar.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Odometer</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCar.current_odometer.toLocaleString()} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Service</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCar.last_service_odometer.toLocaleString()} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Threshold</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCar.service_threshold_km.toLocaleString()} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Expiry</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCar.insurance_expiry_date}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleToggleMaintenance(selectedCar.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCar.status === 'Under_maintenance'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {selectedCar.status === 'Under_maintenance' ? 'Remove from Maintenance' : 'Put in Maintenance'}
                </button>
                <button
                  onClick={closeCarDetail}
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

export default MaintenancePage
