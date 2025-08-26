// Core User Management Types
export type UserRole = 'customer' | 'admin' | 'owner'

export type Profile = {
  id: number
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: UserRole
  loyalty_points?: number
  created_at: string
  updated_at: string
}

// Enhanced Car Management Types
export type CarStatus = 'available' | 'booked' | 'in_use' | 'under_maintenance' | 'due_for_service'

export type CarCategory = 'SUV' | 'Sedan' | 'Hatchback' | 'Van' | 'Luxury' | 'Electric'
export type Agency = 'Agency A' | 'Agency B' | 'Agency C'

export type AgencyLocation = {
  id: Agency
  name: string
  address: string
  city: string
  state: string
  postcode: string
  phone?: string
  email?: string
}

export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'

export type Transmission = 'Automatic' | 'Manual' | 'CVT'

export type Car = {
  id: number
  make: string
  model: string
  year: number
  license_plate: string
  agency: Agency
  category: CarCategory
  transmission: Transmission
  fuel_type: FuelType
  seats: number
  rental_rate_per_day: number
  status: CarStatus
  current_odometer: number
  last_service_odometer: number
  service_threshold_km: number
  image_url?: string
  created_at: string
  updated_at: string
}

// Enhanced Booking System Types
export type BookingStatus = 
  | 'pending'           // User requested booking
  | 'payment_pending'   // Waiting for payment
  | 'invoice_sent'      // Invoice sent to customer
  | 'confirmed'         // Payment confirmed, booking active
  | 'in_progress'       // Car picked up, rental active
  | 'completed'         // Car returned, rental finished
  | 'cancelled'         // Booking cancelled

export type PaymentStatus = 'pending' | 'invoice_sent' | 'paid' | 'overdue'

export type Booking = {
  id: number
  user_id: number
  car_id: number
  start_date: string
  end_date: string
  pickup_location: string
  return_location: string
  special_requests?: string
  promo_code?: string
  phone_number: string
  status: BookingStatus
  payment_status: PaymentStatus
  total_cost: number
  pickup_odometer?: number
  return_odometer?: number
  fuel_level_pickup?: number
  fuel_level_return?: number
  pickup_photo_url?: string
  return_photo_url?: string
  // Handover additions
  driver_license_url?: string
  pickup_photos?: string[]
  return_photos?: string[]
  bond_amount?: number
  week1_amount?: number
  collection_completed_at?: string
  return_completed_at?: string
  // Invoicing additions
  invoice_id?: string
  invoice_status?: 'draft' | 'sent' | 'paid' | 'void'
  invoice_created_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

// Car Usage Log Types
export type UsageLog = {
  id: number
  booking_id: number
  car_id: number
  user_id: number
  pickup_timestamp: string
  return_timestamp?: string
  pickup_odometer: number
  return_odometer?: number
  fuel_level_pickup: number
  fuel_level_return?: number
  pickup_photo_url?: string
  return_photo_url?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

// Maintenance and Service Types
export type ServiceRecord = {
  id: number
  car_id: number
  service_date: string
  odometer_reading: number
  service_type: 'routine' | 'repair' | 'inspection'
  description: string
  cost: number
  next_service_odometer: number
  created_at: string
}

// Notification Types
export type NotificationType = 'booking_confirmed' | 'payment_required' | 'pickup_reminder' | 'return_reminder' | 'service_due'

export type Notification = {
  id: number
  user_id: number
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
}

// Admin Dashboard Types
export type DashboardStats = {
  total_cars: number
  available_cars: number
  active_bookings: number
  pending_payments: number
  cars_due_service: number
  monthly_revenue: number
  total_users: number
  service_threshold_km: number
}

// API Response Types
export type ApiResponse<T> = {
  status: 'success' | 'error'
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}
