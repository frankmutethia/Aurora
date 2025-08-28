import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { login } from '../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle prefilled data from registration
  useEffect(() => {
    if (location.state) {
      const { email, password, message } = location.state as { 
        email?: string, 
        password?: string, 
        message?: string 
      }
      
      if (email) setFormData(prev => ({ ...prev, email }))
      if (password) setFormData(prev => ({ ...prev, password }))
      if (message) {
        setSuccessMessage(message)
        console.log('✅ Registration redirect message:', message)
      }
      
      // Clear the location state to prevent showing message on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const profile = await login(formData.email, formData.password)
      
      console.log('🎯 Login successful, navigating based on role:', profile.role)
      
      // Navigate based on user role
      if (profile.role === 'customer') {
        console.log('➡️ Navigating to customer dashboard (profile page)')
        navigate('/profile')
      } else if (profile.role === 'admin' || profile.role === 'superAdmin') {
        console.log('➡️ Navigating to admin dashboard')
        navigate('/admin')
      } else {
        console.log('➡️ Unknown role, navigating to profile page')
        navigate('/profile')
      }
    } catch (err) {
      console.error('❌ Login failed:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-white border rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Sign in to your account</p>
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6">
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-sky-600 hover:text-sky-700"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-sky-600 hover:text-sky-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Account</h3>
              <p className="text-xs text-blue-700 mb-2">Use these credentials to explore:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Customer:</strong> john@example.com / password123</p>
                <p><strong>Admin:</strong> admin@smartcar.com / admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default LoginPage
