import { setCurrentUser } from './auth'
import type { Profile } from './types'

// Demo admin user for testing
export const DEMO_ADMIN: Profile = {
  id: 1,
  email: 'admin@auroramotors.com',
  first_name: 'Admin',
  last_name: 'User',
  phone: '+61420123456',
  role: 'admin',
  loyalty_points: 0,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-08-19T00:00:00Z'
}

// Function to create demo admin user
export function createDemoAdmin() {
  setCurrentUser(DEMO_ADMIN)
  return DEMO_ADMIN
}

// Function to create demo customer user
export function createDemoCustomer() {
  const customer: Profile = {
    id: 2,
    email: 'customer@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+61420987654',
    role: 'customer',
    loyalty_points: 250,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-08-19T00:00:00Z'
  }
  setCurrentUser(customer)
  return customer
}

// Function to check if current user is admin
export function isAdmin(): boolean {
  try {
    const user = JSON.parse(localStorage.getItem('am_user') || 'null')
    return user?.role === 'admin'
  } catch {
    return false
  }
}

// Function to get current user role
export function getUserRole(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem('am_user') || 'null')
    return user?.role || null
  } catch {
    return null
  }
}
