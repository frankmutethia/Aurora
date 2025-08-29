import * as React from 'react'

const DriversPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Driver Profiles</h3>
          <p className="text-gray-500 mb-4">Manage driver information and documentation</p>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
            Add Driver
          </button>
        </div>
      </div>
    </div>
  )
}

export default DriversPage
