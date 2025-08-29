import * as React from 'react'
import AdminLayout from '../layout/AdminLayout'

// Import the extracted admin pages
import DashboardPage from '../../pages/admin/DashboardPage'
import BookingsPage from '../../pages/admin/BookingsPage'
import FleetPage from '../../pages/admin/FleetPage'
import CarManagement from '../CarManagement'
import UsersPage from '../../pages/admin/UsersPage'
import PaymentsPage from '../../pages/admin/PaymentsPage'
import MaintenancePage from '../../pages/admin/MaintenancePage'
import ReportsPage from '../../pages/admin/ReportsPage'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = React.useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />
      case 'bookings':
        return <BookingsPage />
      case 'fleet':
        // Use the fully-featured CarManagement with live API (create/list-by-agency)
        return <CarManagement />
      case 'users':
        return <UsersPage />
      // drivers removed per requirements
      case 'payments':
        return <PaymentsPage />
      case 'maintenance':
        return <MaintenancePage />
      case 'reports':
        return <ReportsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminLayout>
  )
}

export default AdminDashboard
