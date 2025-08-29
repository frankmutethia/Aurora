import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PaymentSection from '../components/PaymentSection'
import { DEMO_CARS } from '../lib/demo-data'

function BookPage() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  
  const car = DEMO_CARS.find(c => c.id === Number(carId))
  
  const [formData, setFormData] = React.useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    returnLocation: '',
    phoneNumber: '',
    specialRequests: '',
    promoCode: ''
  })
  
  const [showPayment, setShowPayment] = React.useState(false)
  const [totalCost, setTotalCost] = React.useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  if (!car) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">Car not found</h1>
            <button 
              onClick={() => navigate('/cars')}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
            >
              Back to Cars
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  React.useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      setTotalCost(days > 0 ? days * car.rental_rate_per_day : 0)
    }
  }, [formData.startDate, formData.endDate, car.rental_rate_per_day])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.startDate || !formData.endDate || !formData.pickupLocation || !formData.phoneNumber) {
      alert('Please fill in all required fields')
      return
    }
    
    // Check dates
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (start < today) {
      alert('Start date cannot be in the past')
      return
    }
    
    if (end <= start) {
      alert('End date must be after start date')
      return
    }
    
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    alert('Booking confirmed! You will receive a confirmation email shortly.')
    navigate('/profile')
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handlePaymentSubmit = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      handlePaymentSuccess()
    }, 2000)
  }

  if (showPayment) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <PaymentSection
              totalAmount={totalCost}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const days = formData.startDate && formData.endDate ? 
    Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button 
                onClick={() => navigate(`/car/${car.id}`)}
                className="text-sky-600 hover:text-sky-700 transition mb-4"
              >
                ← Back to Car Details
              </button>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">Book Your Rental</h1>
              <p className="text-slate-600">Complete the form below to book your vehicle</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Rental Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pickup Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Return Date *
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pickup Location *
                        </label>
                        <select
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="">Select pickup location</option>
                          <option value="Melbourne CBD">Melbourne CBD</option>
                          <option value="Melbourne Airport">Melbourne Airport</option>
                          <option value="St Kilda">St Kilda</option>
                          <option value="Richmond">Richmond</option>
                          <option value="Brunswick">Brunswick</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Return Location
                        </label>
                        <select
                          name="returnLocation"
                          value={formData.returnLocation}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="">Same as pickup</option>
                          <option value="Melbourne CBD">Melbourne CBD</option>
                          <option value="Melbourne Airport">Melbourne Airport</option>
                          <option value="St Kilda">St Kilda</option>
                          <option value="Richmond">Richmond</option>
                          <option value="Brunswick">Brunswick</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+61 4XX XXX XXX"
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder="Enter promo code"
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Any special requests or notes..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition font-medium"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>

              {/* Booking Summary */}
              <div>
                <div className="bg-slate-50 border rounded-lg p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-3">
                      <img 
                        src={car.image_url || '/images/cars/sedan-silver.png'} 
                        alt={`${car.make} ${car.model}`}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          {car.year} {car.make} {car.model}
                        </p>
                        <p className="text-sm text-slate-600">{car.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {formData.startDate && formData.endDate && (
                      <>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{days} day{days !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate per day:</span>
                          <span>${car.rental_rate_per_day}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${totalCost}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {(!formData.startDate || !formData.endDate) && (
                    <p className="text-sm text-slate-500 mt-4">
                      Select dates to see pricing
                    </p>
                  )}

                  <div className="mt-6 p-3 bg-green-50 rounded-md">
                    <p className="text-xs text-green-700">
                      ✓ Free cancellation up to 24 hours before pickup
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default BookPage
