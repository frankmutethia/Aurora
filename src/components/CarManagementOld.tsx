import * as React from 'react'
import { fleetAPI, type Car, type CarFilters, type CreateCarData } from '../lib/api'
import { getCurrentUser } from '../lib/auth'

interface CarFormData {
  make: string
  model: string
  year: number
  license_plate: string
  category_id: number
  transmission: 'Automatic' | 'Manual' | 'CVT'
  fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'
  seats: number
  rental_rate_per_day: number
  vin: string
  current_odometer: number
  last_service_odometer: number
  service_threshold_km: number
  insurance_expiry_date: string
  images: File[]
}

const CarManagement = () => {
  const [cars, setCars] = React.useState<Car[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddingCar, setIsAddingCar] = React.useState(false)
  const [editingCar, setEditingCar] = React.useState<Car | null>(null)
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [selectedFuelType, setSelectedFuelType] = React.useState<string>('all')
  const [selectedSeats, setSelectedSeats] = React.useState<string>('all')
  const [maxPrice, setMaxPrice] = React.useState<string>('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCars, setTotalCars] = React.useState(0)
  const [error, setError] = React.useState<string>('')
  const [actionLoading, setActionLoading] = React.useState<{ [key: string]: boolean }>({})
  
  const [formData, setFormData] = React.useState<CarFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    category_id: 1, // Default to Economy category
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    rental_rate_per_day: 0,
    vin: '',
    current_odometer: 0,
    last_service_odometer: 0,
    service_threshold_km: 5000,
    insurance_expiry_date: '',
    images: []
  })

  const currentUser = getCurrentUser()
  const userAgencyId = currentUser?.agency?.id

  // Load cars when component mounts or filters change
  React.useEffect(() => {
    loadCars()
  }, [currentPage, selectedStatus, selectedFuelType, selectedSeats, maxPrice])

  const loadCars = async () => {
    try {
      setLoading(true)
      setError('')
      
      const filters: CarFilters = {
        page: currentPage - 1, // API uses 0-based pagination
        size: 20
      }
      
      if (selectedStatus !== 'all') filters.status = selectedStatus
      if (selectedFuelType !== 'all') filters.fuel_type = selectedFuelType
      if (selectedSeats !== 'all') filters.seats = parseInt(selectedSeats)
      if (maxPrice) filters.max_price = parseFloat(maxPrice)
      if (userAgencyId) filters.agency_id = userAgencyId

      console.log('🔍 Loading cars with filters:', filters)
      
      const response = await fleetAPI.getCars(filters)
      console.log('✅ Cars loaded:', response.data.data.length, 'cars')
      
      setCars(response.data.data)
      setTotalPages(response.data.meta.last_page)
      setTotalCars(response.data.meta.total)
      
    } catch (err) {
      console.error('❌ Failed to load cars:', err)
      setError('Failed to load cars. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CarFormData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      license_plate: '',
      category_id: 1,
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 5,
      rental_rate_per_day: 0,
      vin: '',
      current_odometer: 0,
      last_service_odometer: 0,
      service_threshold_km: 5000,
      insurance_expiry_date: '',
      images: []
    })
  }

  const handleAddCar = async () => {
    if (!userAgencyId) {
      setError('Agency ID not found. Please log in again.')
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, addCar: true }))
      setError('')

      const carData: CreateCarData = {
        ...formData,
        agency_id: userAgencyId
      }

      console.log('➕ Creating new car:', carData)
      
      const response = await fleetAPI.createCar(carData)
      console.log('✅ Car created successfully:', response.data)
      
      setIsAddingCar(false)
      resetForm()
      loadCars() // Reload the cars list
      
    } catch (err: any) {
      console.error('❌ Failed to create car:', err)
      setError(err.message || 'Failed to create car. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, addCar: false }))
    }
  }

  const handleDeleteCar = async (carId: number) => {
    if (!window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${carId}`]: true }))
      
      console.log('🗑️ Deleting car:', carId)
      await fleetAPI.deleteCar(carId)
      console.log('✅ Car deleted successfully')
      
      loadCars() // Reload the cars list
      
    } catch (err: any) {
      console.error('❌ Failed to delete car:', err)
      setError(err.message || 'Failed to delete car. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${carId}`]: false }))
    }
  }

  const handleToggleStatus = async (carId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [`status_${carId}`]: true }))
      
      console.log('🔄 Toggling car status:', carId)
      const response = await fleetAPI.toggleCarStatus(carId)
      console.log('✅ Car status updated:', response.data.status)
      
      loadCars() // Reload the cars list
      
    } catch (err: any) {
      console.error('❌ Failed to toggle car status:', err)
      setError(err.message || 'Failed to update car status. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [`status_${carId}`]: false }))
    }
  }

  const handleToggleMaintenance = async (carId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [`maintenance_${carId}`]: true }))
      
      console.log('🔧 Toggling car maintenance:', carId)
      const response = await fleetAPI.toggleCarMaintenance(carId)
      console.log('✅ Car maintenance status updated:', response.data.status)
      
      loadCars() // Reload the cars list
      
    } catch (err: any) {
      console.error('❌ Failed to toggle car maintenance:', err)
      setError(err.message || 'Failed to update car maintenance status. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [`maintenance_${carId}`]: false }))
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Available: 'bg-green-100 text-green-800',
      Disabled: 'bg-gray-100 text-gray-800',
      Under_maintenance: 'bg-red-100 text-red-800',
      Booked: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (categoryId: number) => {
    const icons = {
      1: '🚗', // Economy
      2: '🚙', // Compact
      3: '🏎️', // Luxury
      4: '🚐'  // SUV/Van
    }
    return icons[categoryId as keyof typeof icons] || '🚗'
  }

  // Filter cars based on search term (frontend filtering for real-time search)
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Calculate fleet statistics
  const fleetStats = {
    total: totalCars,
    available: cars.filter(c => c.status === 'Available').length,
    disabled: cars.filter(c => c.status === 'Disabled').length,
    maintenance: cars.filter(c => c.status === 'Under_maintenance').length,
    totalValue: cars.reduce((sum, car) => sum + parseFloat(car.rental_rate_per_day) * 30, 0),
    avgRate: cars.length ? cars.reduce((sum, car) => sum + parseFloat(car.rental_rate_per_day), 0) / cars.length : 0
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

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
              disabled={loading}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Add New Car
            </button>
            <button 
              onClick={loadCars}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{fleetStats.disabled}</div>
            <div className="text-sm text-gray-700">Disabled</div>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Disabled">Disabled</option>
              <option value="Under_maintenance">Under Maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="fuel-filter" className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
            <select
              id="fuel-filter"
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Filter by fuel type"
            >
              <option value="all">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div>
            <label htmlFor="seats-filter" className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
            <select
              id="seats-filter"
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Filter by seats"
            >
              <option value="all">All Seats</option>
              <option value="2">2 Seats</option>
              <option value="4">4 Seats</option>
              <option value="5">5 Seats</option>
              <option value="7">7 Seats</option>
              <option value="8">8+ Seats</option>
            </select>
          </div>
          <div>
            <label htmlFor="price-filter" className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
            <input
              id="price-filter"
              type="number"
              placeholder="Max daily rate"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              min="0"
              step="0.01"
              aria-label="Filter by maximum price"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedStatus('all')
                setSelectedFuelType('all')
                setSelectedSeats('all')
                setMaxPrice('')
                setSearchTerm('')
              }}
              className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
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
                  <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                  <input
                    id="vin"
                    type="text"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., 5TDLB3CH50S130282"
                    aria-label="Vehicle VIN"
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
                  <label htmlFor="bond" className="block text-sm font-medium text-gray-700 mb-2">Bond Amount ($)</label>
                  <input
                    id="bond"
                    type="number"
                    value={formData.bond_amount || 0}
                    onChange={(e) => handleInputChange('bond_amount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    step="0.01"
                    aria-label="Bond amount"
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

      {/* Add Car Form Modal */}
      {isAddingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Add New Car</h3>
                <button
                  onClick={() => {
                    setIsAddingCar(false)
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
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  <input
                    id="make"
                    type="text"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Toyota"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    id="model"
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Corolla"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                  <input
                    id="license_plate"
                    type="text"
                    value={formData.license_plate}
                    onChange={(e) => handleInputChange('license_plate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., ABC-123"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  >
                    <option value={1}>Economy</option>
                    <option value={2}>Compact</option>
                    <option value={3}>Luxury</option>
                    <option value={4}>SUV</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                  <select
                    id="transmission"
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value as 'Automatic' | 'Manual' | 'CVT')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                  <select
                    id="fuel_type"
                    value={formData.fuel_type}
                    onChange={(e) => handleInputChange('fuel_type', e.target.value as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">Seats *</label>
                  <input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="2"
                    max="12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="rental_rate_per_day" className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($) *</label>
                  <input
                    id="rental_rate_per_day"
                    type="number"
                    value={formData.rental_rate_per_day}
                    onChange={(e) => handleInputChange('rental_rate_per_day', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                  <input
                    id="vin"
                    type="text"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., ABCDEFG1234567890"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="current_odometer" className="block text-sm font-medium text-gray-700 mb-2">Current Odometer (km) *</label>
                  <input
                    id="current_odometer"
                    type="number"
                    value={formData.current_odometer}
                    onChange={(e) => handleInputChange('current_odometer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="last_service_odometer" className="block text-sm font-medium text-gray-700 mb-2">Last Service Odometer (km) *</label>
                  <input
                    id="last_service_odometer"
                    type="number"
                    value={formData.last_service_odometer}
                    onChange={(e) => handleInputChange('last_service_odometer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="service_threshold_km" className="block text-sm font-medium text-gray-700 mb-2">Service Threshold (km) *</label>
                  <input
                    id="service_threshold_km"
                    type="number"
                    value={formData.service_threshold_km}
                    onChange={(e) => handleInputChange('service_threshold_km', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="1000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="insurance_expiry_date" className="block text-sm font-medium text-gray-700 mb-2">Insurance Expiry Date *</label>
                  <input
                    id="insurance_expiry_date"
                    type="date"
                    value={formData.insurance_expiry_date}
                    onChange={(e) => handleInputChange('insurance_expiry_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">Car Images *</label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleInputChange('images', Array.from(e.target.files || []))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Select one or more images for the car</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsAddingCar(false)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCar}
                  disabled={actionLoading.addCar}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.addCar ? 'Creating Car...' : 'Add Car'}
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
