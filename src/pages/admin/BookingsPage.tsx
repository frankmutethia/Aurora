import * as React from 'react'
import { DEMO_BOOKINGS, DEMO_USERS, DEMO_CARS } from '../../lib/demo-data'
import { bookingAPI, fleetAPI } from '../../lib/api'
import BookingModal from '../../components/BookingModal'

const BookingsPage = () => {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selected, setSelected] = React.useState<any | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError('')
        const res = await bookingAPI.getBookings(0, 50)
        const list = (res.data as any).data || []
        setBookings(Array.isArray(list) ? list : [])
      } catch (e) {
        console.warn('Falling back to demo bookings due to API error:', e)
        setBookings(DEMO_BOOKINGS)
        setError('Failed to load live bookings; showing demo data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-4 py-2">{error}</div>
      )}
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(loading ? [] : bookings).map((booking: any) => {
                const user = DEMO_USERS.find(u => u.id === booking.user_id)
                const car = DEMO_CARS.find(c => c.id === booking.car_id)
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user ? `${user.first_name} ${user.last_name}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Car'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.total_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-sky-600 hover:text-sky-900 mr-3" onClick={()=> setSelected(booking)}>View</button>
                      <button className="text-green-600 hover:text-green-900 mr-3" onClick={()=> setSelected(booking)}>Edit</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <BookingModal
          booking={selected}
          onClose={()=> setSelected(null)}
          onStatusUpdate={() => {}}
          onPaymentUpdate={() => {}}
        />
      )}
    </div>
  )
}

export default BookingsPage
