import * as React from 'react'

interface PaymentSectionProps {
  totalAmount: number
  onPaymentMethodSelect: (method: string) => void
  selectedPaymentMethod: string
  onPaymentSubmit: () => void
  isProcessing: boolean
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  totalAmount,
  onPaymentMethodSelect,
  selectedPaymentMethod,
  onPaymentSubmit,
  isProcessing
}) => {
  const [paymentDetails, setPaymentDetails] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    mpesaPhone: '',
    paypalEmail: '',
    cryptoAddress: ''
  })

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      color: 'border-blue-200 bg-blue-50',
      activeColor: 'border-blue-500 bg-blue-100'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: '📱',
      description: 'Mobile money payment',
      color: 'border-green-200 bg-green-50',
      activeColor: 'border-green-500 bg-green-100'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      description: 'Pay with PayPal account',
      color: 'border-blue-200 bg-blue-50',
      activeColor: 'border-blue-500 bg-blue-100'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: '₿',
      description: 'Bitcoin, Ethereum, USDT',
      color: 'border-orange-200 bg-orange-50',
      activeColor: 'border-orange-500 bg-orange-100'
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'visa':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentDetails.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={paymentDetails.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="John Doe"
              />
            </div>
          </div>
        )

      case 'mpesa':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📱</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">M-Pesa Payment</h4>
                  <p className="text-sm text-green-700">You'll receive an M-Pesa prompt on your phone</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={paymentDetails.mpesaPhone}
                onChange={(e) => handleInputChange('mpesaPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+254 700 000 000"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>• Enter your M-Pesa registered phone number</p>
              <p>• You'll receive a payment prompt on your phone</p>
              <p>• Enter your M-Pesa PIN to complete payment</p>
            </div>
          </div>
        )

      case 'paypal':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔵</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">PayPal Payment</h4>
                  <p className="text-sm text-blue-700">You'll be redirected to PayPal to complete payment</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PayPal Email
              </label>
              <input
                type="email"
                value={paymentDetails.paypalEmail}
                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your-email@example.com"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>• Enter your PayPal email address</p>
              <p>• You'll be redirected to PayPal to complete payment</p>
              <p>• Payment will be processed securely through PayPal</p>
            </div>
          </div>
        )

      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">₿</span>
                </div>
                <div>
                  <h4 className="font-medium text-orange-900">Cryptocurrency Payment</h4>
                  <p className="text-sm text-orange-700">Pay with Bitcoin, Ethereum, or USDT</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cryptocurrency Type
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                aria-label="Select cryptocurrency type"
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="usdt">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address (Optional)
              </label>
              <input
                type="text"
                value={paymentDetails.cryptoAddress}
                onChange={(e) => handleInputChange('cryptoAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>• Select your preferred cryptocurrency</p>
              <p>• You'll receive payment instructions</p>
              <p>• Payment will be confirmed once received</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
      
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onPaymentMethodSelect(method.id)}
            className={`p-4 border rounded-lg text-left transition-all duration-200 ${
              selectedPaymentMethod === method.id
                ? method.activeColor
                : method.color
            } hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{method.name}</div>
                <div className="text-xs text-gray-600">{method.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Form */}
      {selectedPaymentMethod && (
        <div className="border-t border-gray-200 pt-6">
          {renderPaymentForm()}
          
          {/* Payment Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500">
              Secure payment processed by our trusted payment partners
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onPaymentSubmit}
            disabled={isProcessing}
            className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay $${totalAmount.toLocaleString()}`
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure payment with SSL encryption</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentSection
