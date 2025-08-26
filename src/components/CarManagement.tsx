import * as React from 'react'
import type { Car, CarCategory, FuelType, Transmission, CarStatus, Agency } from '../lib/types'
import { DEMO_CARS } from '../lib/demo-data'

interface CarFormData {
  make: string
  model: string
  year: number
  license_plate: string
  agency: Agency
  category: CarCategory
  transmission: Transmission
  fuel_type: FuelType
  seats: number
  rental_rate_per_day: number
  current_odometer: number
  last_service_odometer: number
  service_threshold_km: number
  image_url: string
}

const CarManagement = () => {
  const [cars, setCars] = React.useState<Car[]>(DEMO_CARS)
  const [isAddingCar, setIsAddingCar] = React.useState(false)
  const [editingCar, setEditingCar] = React.useState<Car | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [formData, setFormData] = React.useState<CarFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    agency: 'Aurora motors',
    category: 'Sedan',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    rental_rate_per_day: 0,
    current_odometer: 0,
    last_service_odometer: 0,
    service_threshold_km: 5000,
    image_url: ''
  })

  const handleInputChange = (field: keyof CarFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      license_plate: '',
      agency: 'Aurora motors',
      category: 'Sedan',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 5,
      rental_rate_per_day: 0,
      current_odometer: 0,
      last_service_odometer: 0,
      service_threshold_km: 5000,
      image_url: ''
    })
  }

  const handleAddCar = () => {
    const newCar: Car = {
      id: Math.max(...cars.map(c => c.id)) + 1,
      ...formData,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setCars(prev => [...prev, newCar])
    setIsAddingCar(false)
    resetForm()
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      license_plate: car.license_plate,
      agency: car.agency,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      seats: car.seats,
      rental_rate_per_day: car.rental_rate_per_day,
      current_odometer: car.current_odometer,
      last_service_odometer: car.last_service_odometer,
      service_threshold_km: car.service_threshold_km,
      image_url: car.image_url || ''
    })
  }

  const handleUpdateCar = () => {
    if (!editingCar) return

    const updatedCar: Car = {
      ...editingCar,
      ...formData,
      updated_at: new Date().toISOString()
    }

    setCars(prev => prev.map(car => car.id === editingCar.id ? updatedCar : car))
    setEditingCar(null)
    resetForm()
  }

  const handleDeleteCar = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(prev => prev.filter(car => car.id !== carId))
    }
  }

  const getStatusColor = (status: CarStatus) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      booked: 'bg-blue-100 text-blue-800',
      in_use: 'bg-yellow-100 text-yellow-800',
      under_maintenance: 'bg-red-100 text-red-800',
      due_for_service: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: CarCategory) => {
    const icons = {
      Sedan: '🚗',
      SUV: '🚙',
      Hatchback: '🚐',
      Van: '🚐',
      Electric: '⚡',
      Luxury: '🏎️'
    }
    return icons[category] || '🚗'
  }

  const getCategoryColor = (category: CarCategory) => {
    const colors = {
      Sedan: 'bg-blue-500',
      SUV: 'bg-green-500',
      Hatchback: 'bg-purple-500',
      Van: 'bg-orange-500',
      Electric: 'bg-yellow-500',
      Luxury: 'bg-red-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  // Filter cars based on search and category
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate fleet statistics
  const fleetStats = {
    total: cars.length,
    available: cars.filter(c => c.status === 'available').length,
    inUse: cars.filter(c => c.status === 'in_use').length,
    maintenance: cars.filter(c => c.status === 'under_maintenance' || c.status === 'due_for_service').length,
    totalValue: cars.reduce((sum, car) => sum + car.rental_rate_per_day * 30, 0),
    avgRate: cars.reduce((sum, car) => sum + car.rental_rate_per_day, 0) / cars.length
  }

  // Group cars by category
  const carsByCategory = cars.reduce((acc, car) => {
    acc[car.category] = (acc[car.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Fleet Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your vehicle fleet, track status, and monitor performance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddingCar(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium"
            >
              Add New Car
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Export Fleet
            </button>
          </div>
        </div>
        
        {/* Fleet Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{fleetStats.total}</div>
            <div className="text-sm text-blue-700">Total Cars</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{fleetStats.available}</div>
            <div className="text-sm text-green-700">Available</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-900">{fleetStats.inUse}</div>
            <div className="text-sm text-yellow-700">In Use</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">{fleetStats.maintenance}</div>
            <div className="text-sm text-red-700">Maintenance</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">${fleetStats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Monthly Value</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-900">${fleetStats.avgRate.toFixed(0)}</div>
            <div className="text-sm text-indigo-700">Avg. Daily Rate</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search-cars" className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              id="search-cars"
              type="text"
              placeholder="Search by make, model, or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Search cars"
            />
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {Object.keys(carsByCategory).map(category => (
                <option key={category} value={category}>
                  {category} ({carsByCategory[category]})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="in_use">In Use</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(carsByCategory).map(([category, count]) => (
            <div 
              key={category}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                selectedCategory === category 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${getCategoryColor(category as CarCategory)} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {getCategoryIcon(category as CarCategory)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{category}</div>
                  <div className="text-sm text-gray-600">{count} cars</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cars Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Car Image */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={car.image_url || '/placeholder.svg'} 
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                    {car.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <div className={`w-8 h-8 ${getCategoryColor(car.category)} rounded-lg flex items-center justify-center text-white text-sm`}>
                    {getCategoryIcon(car.category)}
                  </div>
                </div>
              </div>
              
              {/* Car Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{car.year} {car.make} {car.model}</h3>
                    <p className="text-sm text-gray-600">{car.category} • {car.transmission}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sky-600">${car.rental_rate_per_day}</div>
                    <div className="text-xs text-gray-500">per day</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Agency:</span>
                    <span className="font-medium">{car.agency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">License:</span>
                    <span className="font-medium">{car.license_plate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Odometer:</span>
                    <span className="font-medium">{car.current_odometer.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fuel:</span>
                    <span className="font-medium">{car.fuel_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{car.seats}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCar(car)}
                    className="flex-1 px-3 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Vehicles</h3>
              <div className="text-sm text-gray-600">
                Showing {filteredCars.length} of {cars.length} vehicles
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Vehicle</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Category</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">License</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Status</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Rate/Day</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Odometer</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-gray-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={car.image_url || '/placeholder.svg'} 
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-12 h-8 rounded object-cover bg-gray-100"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{car.year} {car.make} {car.model}</div>
                          <div className="text-sm text-gray-600">{car.transmission} • {car.fuel_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${getCategoryColor(car.category)} rounded flex items-center justify-center text-white text-xs`}>
                          {getCategoryIcon(car.category)}
                        </div>
                        <span className="text-sm text-gray-900">{car.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{car.license_plate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                        {car.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">${car.rental_rate_per_day}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{car.current_odometer.toLocaleString()} km</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit Car"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Car"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Car Form Modal */}
      {(isAddingCar || editingCar) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingCar(false)
                    setEditingCar(null)
                    resetForm()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <input
                    id="make"
                    type="text"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Toyota"
                    required
                    aria-label="Car make"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    id="model"
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Corolla"
                    required
                    aria-label="Car model"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    placeholder="2024"
                    required
                    aria-label="Car year"
                  />
                </div>

                <div>
                  <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  <input
                    id="license"
                    type="text"
                    value={formData.license_plate}
                    onChange={(e) => handleInputChange('license_plate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., ABC-123"
                    required
                    aria-label="License plate"
                  />
                </div>

                <div>
                  <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2">Agency</label>
                  <select
                    id="agency"
                    value={formData.agency}
                    onChange={(e) => handleInputChange('agency', e.target.value as Agency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                    aria-label="Car agency"
                  >
                    <option value="Aurora motors">Aurora motors</option>
                    <option value="Smart">Smart</option>
                    <option value="JNK">JNK</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as CarCategory)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                    aria-label="Car category"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Van">Van</option>
                    <option value="Electric">Electric</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    id="transmission"
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value as Transmission)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                    aria-label="Transmission type"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    id="fuel"
                    value={formData.fuel_type}
                    onChange={(e) => handleInputChange('fuel_type', e.target.value as FuelType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                    aria-label="Fuel type"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                  <input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="2"
                    max="12"
                    required
                    aria-label="Number of seats"
                  />
                </div>

                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($)</label>
                  <input
                    id="rate"
                    type="number"
                    value={formData.rental_rate_per_day}
                    onChange={(e) => handleInputChange('rental_rate_per_day', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    step="0.01"
                    required
                    aria-label="Daily rental rate"
                  />
                </div>

                <div>
                  <label htmlFor="odometer" className="block text-sm font-medium text-gray-700 mb-2">Current Odometer (km)</label>
                  <input
                    id="odometer"
                    type="number"
                    value={formData.current_odometer}
                    onChange={(e) => handleInputChange('current_odometer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    required
                    aria-label="Current odometer reading"
                  />
                </div>

                <div>
                  <label htmlFor="last-service" className="block text-sm font-medium text-gray-700 mb-2">Last Service Odometer (km)</label>
                  <input
                    id="last-service"
                    type="number"
                    value={formData.last_service_odometer}
                    onChange={(e) => handleInputChange('last_service_odometer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    required
                    aria-label="Last service odometer reading"
                  />
                </div>

                <div>
                  <label htmlFor="service-threshold" className="block text-sm font-medium text-gray-700 mb-2">Service Threshold (km)</label>
                  <input
                    id="service-threshold"
                    type="number"
                    value={formData.service_threshold_km}
                    onChange={(e) => handleInputChange('service_threshold_km', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="1000"
                    required
                    aria-label="Service threshold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    id="image-url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="https://example.com/car-image.jpg"
                    aria-label="Car image URL"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsAddingCar(false)
                    setEditingCar(null)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCar ? handleUpdateCar : handleAddCar}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  {editingCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarManagement
