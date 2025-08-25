import type { Profile, Booking } from './types'

const USER_KEY = 'am_user'
const BOOKINGS_KEY = 'am_bookings'

export function getCurrentUser(): Profile | null {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}

export function setCurrentUser(user: Profile | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export async function login(email: string, _password: string): Promise<Profile> {
  // Demo-only: accept any password and create a mock user
  const user: Profile = { 
    id: 1, 
    email, 
    first_name: email.split('@')[0], 
    role: 'customer',
    loyalty_points: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  setCurrentUser(user)
  return user
}

export async function register(data: { first_name: string; last_name: string; email: string; password: string; phone?: string }): Promise<Profile> {
  const user: Profile = { 
    id: 1, 
    email: data.email, 
    first_name: data.first_name, 
    last_name: data.last_name, 
    role: 'customer',
    loyalty_points: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  setCurrentUser(user)
  return user
}

export function logout() { setCurrentUser(null) }

export function listBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') } catch { return [] }
}

export function addBooking(b: Booking) {
  const list = listBookings()
  list.unshift(b)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
}

export function updateBooking(id: number, updater: (b: Booking) => Booking) {
  const list = listBookings()
  const updated = list.map(b => (b.id === id ? updater(b) : b))
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated))
}

export function getBooking(id: number): Booking | null {
  return listBookings().find(b => b.id === id) || null
}


