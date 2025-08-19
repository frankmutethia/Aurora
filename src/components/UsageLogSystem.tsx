import * as React from 'react'
import type { UsageLog, Booking } from '../lib/types'
import { DEMO_BOOKINGS, DEMO_CARS, DEMO_USERS } from '../lib/demo-data'

interface UsageLogFormData {
  booking_id: number
  car_id: number
  user_id: number
  pickup_odometer: number
  fuel_level_pickup: number
  pickup_photo_url: string
  admin_notes: string
}

const UsageLogSystem = () => {
  const [usageLogs, setUsageLogs] = React.useState<UsageLog[]>([])
  const [isLoggingPickup, setIsLoggingPickup] = React.useState(false)

  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [formData, setFormData] = React.useState<UsageLogFormData>({
    booking_id: 0,
    car_id: 0,
    user_id: 0,
    pickup_odometer: 0,
    fuel_level_pickup: 100,
    pickup_photo_url: '',
    admin_notes: ''
  })

  // Get active bookings (confirmed or in_progress)
  const activeBookings = DEMO_BOOKINGS.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'in_progress'
  )

  const handleInputChange = (field: keyof UsageLogFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking)
    setFormData({
      booking_id: booking.id,
      car_id: booking.car_id,
      user_id: booking.user_id,
      pickup_odometer: 0,
      fuel_level_pickup: 100,
      pickup_photo_url: '',
      admin_notes: ''
    })
  }

  const handlePickupLog = () => {
    if (!selectedBooking) return

    const newUsageLog: UsageLog = {
      id: Math.max(...usageLogs.map(log => log.id), 0) + 1,
      booking_id: selectedBooking.id,
      car_id: selectedBooking.car_id,
      user_id: selectedBooking.user_id,
      pickup_timestamp: new Date().toISOString(),
      pickup_odometer: formData.pickup_odometer,
      fuel_level_pickup: formData.fuel_level_pickup,
      pickup_photo_url: formData.pickup_photo_url,
      admin_notes: formData.admin_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setUsageLogs(prev => [...prev, newUsageLog])
    setIsLoggingPickup(false)
    setSelectedBooking(null)
    
    // Update booking status to in_progress
    // In a real app, this would update the booking in the database
    console.log('Booking status updated to in_progress')
  }

  const handleReturnLog = (usageLog: UsageLog) => {
    const returnOdometer = prompt('Enter return odometer reading:')
    const returnFuelLevel = prompt('Enter return fuel level (0-100):')
    const returnPhotoUrl = prompt('Enter return photo URL (optional):')
    const returnNotes = prompt('Enter return notes (optional):')

    if (!returnOdometer || !returnFuelLevel) return

    const updatedUsageLog: UsageLog = {
      ...usageLog,
      return_timestamp: new Date().toISOString(),
      return_odometer: parseInt(returnOdometer),
      fuel_level_return: parseInt(returnFuelLevel),
      return_photo_url: returnPhotoUrl || undefined,
      admin_notes: returnNotes || usageLog.admin_notes,
      updated_at: new Date().toISOString()
    }

    setUsageLogs(prev => prev.map(log => 
      log.id === usageLog.id ? updatedUsageLog : log
    ))

    // Update booking status to completed
    // In a real app, this would update the booking in the database
    console.log('Booking status updated to completed')
  }

  const getCar = (carId: number) => DEMO_CARS.find(car => car.id === carId)
  const getUser = (userId: number) => DEMO_USERS.find(user => user.id === userId)

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usage Log Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLoggingPickup(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Log Pickup
          </button>

        </div>
      </div>

      {/* Pickup Logging Form */}
      {isLoggingPickup && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Log Car Pickup</h3>
          
          {/* Booking Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Booking</label>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {activeBookings.map((booking) => {
                const car = getCar(booking.car_id)
                const user = getUser(booking.user_id)
                return (
                  <button
                    key={booking.id}
                    onClick={() => handleBookingSelect(booking)}
                    className={`p-3 border rounded-lg text-left hover:bg-gray-50 ${
                      selectedBooking?.id === booking.id ? 'border-sky-500 bg-sky-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Booking #{booking.id}</div>
                        <div className="text-sm text-gray-600">
                          {car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Car'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pickup Details Form */}
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup_odometer" className="block text-sm font-medium mb-1">
                    Pickup Odometer (km)
                  </label>
                  <input
                    id="pickup_odometer"
                    type="number"
                    value={formData.pickup_odometer}
                    onChange={(e) => handleInputChange('pickup_odometer', parseInt(e.target.value))}
                    className="w-full border rounded-md px-3 py-2"
                    min="0"
                    required
                    aria-label="Pickup odometer reading"
                  />
                </div>

                <div>
                  <label htmlFor="fuel_level" className="block text-sm font-medium mb-1">
                    Fuel Level (%)
                  </label>
                  <input
                    id="fuel_level"
                    type="number"
                    value={formData.fuel_level_pickup}
                    onChange={(e) => handleInputChange('fuel_level_pickup', parseInt(e.target.value))}
                    className="w-full border rounded-md px-3 py-2"
                    min="0"
                    max="100"
                    required
                    aria-label="Fuel level percentage"
                  />
                </div>

                <div>
                  <label htmlFor="pickup_photo" className="block text-sm font-medium mb-1">
                    Pickup Photo URL
                  </label>
                  <input
                    id="pickup_photo"
                    type="url"
                    value={formData.pickup_photo_url}
                    onChange={(e) => handleInputChange('pickup_photo_url', e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="https://example.com/photo.jpg"
                    aria-label="URL for pickup photo"
                  />
                </div>

                <div>
                  <label htmlFor="admin_notes" className="block text-sm font-medium mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    id="admin_notes"
                    value={formData.admin_notes}
                    onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Any notes about the car condition..."
                    aria-label="Administrative notes"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePickupLog}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Log Pickup
                </button>
                <button
                  onClick={() => {
                    setIsLoggingPickup(false)
                    setSelectedBooking(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Usage Logs Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Usage Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Booking ID</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Car</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Pickup</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Return</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Odometer</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageLogs.map((log) => {
                const car = getCar(log.car_id)
                const user = getUser(log.user_id)
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{log.booking_id}</td>
                    <td className="px-6 py-4">
                      {car ? `${car.year} ${car.make} ${car.model}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      {user ? `${user.first_name} ${user.last_name}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>{new Date(log.pickup_timestamp).toLocaleDateString()}</div>
                        <div className="text-gray-500">{log.pickup_odometer.toLocaleString()} km</div>
                        <div className="text-gray-500">{log.fuel_level_pickup}% fuel</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.return_timestamp ? (
                        <div className="text-xs">
                          <div>{new Date(log.return_timestamp).toLocaleDateString()}</div>
                          <div className="text-gray-500">{log.return_odometer?.toLocaleString()} km</div>
                          <div className="text-gray-500">{log.fuel_level_return}% fuel</div>
                        </div>
                      ) : (
                        <span className="text-yellow-600 text-xs">Not returned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.return_odometer ? (
                        <div className="text-xs">
                          <div>Distance: {(log.return_odometer - log.pickup_odometer).toLocaleString()} km</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!log.return_timestamp && (
                        <button
                          onClick={() => handleReturnLog(log)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Log Return
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {usageLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No usage logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UsageLogSystem
