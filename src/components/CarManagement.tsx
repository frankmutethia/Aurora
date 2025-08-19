import * as React from 'react'
import type { Car, CarCategory, FuelType, Transmission, CarStatus } from '../lib/types'
import { DEMO_CARS } from '../lib/demo-data'

interface CarFormData {
  make: string
  model: string
  year: number
  license_plate: string
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
  const [formData, setFormData] = React.useState<CarFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
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

  const handleStatusChange = (carId: number, newStatus: CarStatus) => {
    setCars(prev => prev.map(car => 
      car.id === carId 
        ? { ...car, status: newStatus, updated_at: new Date().toISOString() }
        : car
    ))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fleet Management</h2>
        <button
          onClick={() => setIsAddingCar(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          Add New Car
        </button>
      </div>

      {/* Add/Edit Car Form */}
      {(isAddingCar || editingCar) && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium mb-1">Make</label>
              <input
                id="make"
                type="text"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., Toyota"
                required
                aria-label="Car make"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">Model</label>
              <input
                id="model"
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="e.g., Corolla"
                required
                aria-label="Car model"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">Year</label>
              <input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="2000"
                max={new Date().getFullYear() + 1}
                placeholder="2024"
                required
                aria-label="Car year"
              />
            </div>

            <div>
              <label htmlFor="license_plate" className="block text-sm font-medium mb-1">License Plate</label>
              <input
                id="license_plate"
                type="text"
                value={formData.license_plate}
                onChange={(e) => handleInputChange('license_plate', e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="ABC-123"
                required
                aria-label="License plate number"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as CarCategory)}
                className="w-full border rounded-md px-3 py-2"
                aria-label="Select car category"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Van">Van</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label htmlFor="transmission" className="block text-sm font-medium mb-1">Transmission</label>
              <select
                id="transmission"
                value={formData.transmission}
                onChange={(e) => handleInputChange('transmission', e.target.value as Transmission)}
                className="w-full border rounded-md px-3 py-2"
                aria-label="Select transmission type"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <div>
              <label htmlFor="fuel_type" className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                id="fuel_type"
                value={formData.fuel_type}
                onChange={(e) => handleInputChange('fuel_type', e.target.value as FuelType)}
                className="w-full border rounded-md px-3 py-2"
                aria-label="Select fuel type"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label htmlFor="seats" className="block text-sm font-medium mb-1">Seats</label>
              <input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="2"
                max="12"
                placeholder="5"
                required
                aria-label="Number of seats"
              />
            </div>

            <div>
              <label htmlFor="daily_rate" className="block text-sm font-medium mb-1">Daily Rate ($)</label>
              <input
                id="daily_rate"
                type="number"
                value={formData.rental_rate_per_day}
                onChange={(e) => handleInputChange('rental_rate_per_day', parseFloat(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="0"
                step="0.01"
                placeholder="89.00"
                required
                aria-label="Daily rental rate in dollars"
              />
            </div>

            <div>
              <label htmlFor="current_odometer" className="block text-sm font-medium mb-1">Current Odometer (km)</label>
              <input
                id="current_odometer"
                type="number"
                value={formData.current_odometer}
                onChange={(e) => handleInputChange('current_odometer', parseInt(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="0"
                placeholder="15000"
                required
                aria-label="Current odometer reading in kilometers"
              />
            </div>

            <div>
              <label htmlFor="last_service_odometer" className="block text-sm font-medium mb-1">Last Service Odometer (km)</label>
              <input
                id="last_service_odometer"
                type="number"
                value={formData.last_service_odometer}
                onChange={(e) => handleInputChange('last_service_odometer', parseInt(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="0"
                placeholder="12000"
                required
                aria-label="Odometer reading at last service in kilometers"
              />
            </div>

            <div>
              <label htmlFor="service_threshold" className="block text-sm font-medium mb-1">Service Threshold (km)</label>
              <input
                id="service_threshold"
                type="number"
                value={formData.service_threshold_km}
                onChange={(e) => handleInputChange('service_threshold_km', parseInt(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="1000"
                placeholder="5000"
                required
                aria-label="Service threshold in kilometers"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium mb-1">Image URL</label>
              <input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://example.com/image.jpg"
                aria-label="URL for car image"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={editingCar ? handleUpdateCar : handleAddCar}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              {editingCar ? 'Update Car' : 'Add Car'}
            </button>
            <button
              onClick={() => {
                setIsAddingCar(false)
                setEditingCar(null)
                resetForm()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cars Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Car</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">License</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Rate/Day</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Odometer</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={car.image_url || '/placeholder.svg'} 
                        alt={car.make}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{car.year} {car.make} {car.model}</div>
                        <div className="text-xs text-gray-500">{car.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{car.license_plate}</td>
                  <td className="px-6 py-4">
                    <select
                      value={car.status}
                      onChange={(e) => handleStatusChange(car.id, e.target.value as CarStatus)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(car.status)}`}
                      aria-label={`Change status for ${car.make} ${car.model}`}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="in_use">In Use</option>
                      <option value="under_maintenance">Under Maintenance</option>
                      <option value="due_for_service">Due for Service</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">${car.rental_rate_per_day}</td>
                  <td className="px-6 py-4">{car.current_odometer.toLocaleString()} km</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCar(car)}
                        className="text-sky-600 hover:text-sky-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CarManagement
