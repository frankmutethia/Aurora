import * as React from 'react'
import { createDemoAdmin, createDemoCustomer, isAdmin } from '../lib/demo-admin'
import { toast } from './Toaster'

const AdminSetup = () => {
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = React.useState(false)

  React.useEffect(() => {
    setIsCurrentUserAdmin(isAdmin())
  }, [])

  const handleCreateAdmin = () => {
    createDemoAdmin()
    setIsCurrentUserAdmin(true)
    toast('Demo admin user created! You can now access the admin dashboard.')
    setTimeout(() => {
      window.location.href = '/admin'
    }, 1000)
  }

  const handleCreateCustomer = () => {
    createDemoCustomer()
    toast('Demo customer user created!')
    setTimeout(() => {
      window.location.href = '/profile'
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Setup</h1>
            <p className="text-slate-600">Create demo users for testing</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Demo Admin User</h3>
              <p className="text-sm text-blue-700 mb-3">
                Creates an admin user with full access to the admin dashboard.
              </p>
              <button
                onClick={handleCreateAdmin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Admin User
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Demo Customer User</h3>
              <p className="text-sm text-green-700 mb-3">
                Creates a customer user for testing the booking system.
              </p>
              <button
                onClick={handleCreateCustomer}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Customer User
              </button>
            </div>

            {isCurrentUserAdmin && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h3 className="font-semibold text-sky-900 mb-2">Admin Access</h3>
                <p className="text-sm text-sky-700 mb-3">
                  You are currently logged in as an admin user.
                </p>
                <a
                  href="/admin"
                  className="block w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors text-center"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            )}
          </div>

          <div className="text-center">
            <a href="/" className="text-sky-600 hover:text-sky-700 text-sm">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSetup
