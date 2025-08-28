import CarManagement from '../components/CarManagement'

const FleetPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
          <p className="text-gray-600">Manage your vehicle fleet and inventory</p>
        </div>
      </div>

      {/* Car Management Component */}
      <CarManagement />
    </div>
  )
}

export default FleetPage
