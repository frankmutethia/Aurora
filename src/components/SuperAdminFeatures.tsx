import * as React from 'react'
import type { Profile } from '../lib/types'

interface SuperAdminFeaturesProps {
  user: Profile
}

const SuperAdminFeatures: React.FC<SuperAdminFeaturesProps> = ({ user }) => {
  if (user.role !== 'superAdmin') {
    return null
  }

  const handleCreateAgency = () => {
    // TODO: Implement agency creation functionality
    console.log('Create new agency clicked')
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-purple-900">Super Admin Controls</h3>
          <p className="text-sm text-purple-700 mt-1">
            You have access to all system features and agency management
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreateAgency}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Create New Agency
          </button>
          <button className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
            Onboard Supervisor
          </button>
        </div>
      </div>
      
      {/* Super Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/70 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">2</div>
          <div className="text-sm text-purple-700">Total Agencies</div>
        </div>
        <div className="bg-white/70 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">3</div>
          <div className="text-sm text-purple-700">Total Users</div>
        </div>
        <div className="bg-white/70 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">0</div>
          <div className="text-sm text-purple-700">Total Bookings</div>
        </div>
        <div className="bg-white/70 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">0</div>
          <div className="text-sm text-purple-700">Total Cars</div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminFeatures
