export type DemoCar = {
  id: number
  make: string
  model: string
  year: number
  rental_rate_per_day: number
  transmission?: string
  fuel_type?: string
  seats?: number
  vehicle_model?: { vehicle_line?: { vehicle_type?: 'SUV' | 'Sedan' | 'Hatchback' | 'Van' } }
  imageUrl?: string
}

export const DEMO_CARS: DemoCar[] = [
  { id: 101, make: 'Toyota', model: 'Corolla', year: 2022, rental_rate_per_day: 89, transmission: 'Automatic', fuel_type: 'Petrol', seats: 5, vehicle_model: { vehicle_line: { vehicle_type: 'Sedan' } }, imageUrl: '/images/cars/sedan-white.png' },
  { id: 102, make: 'Honda', model: 'Civic', year: 2023, rental_rate_per_day: 95, transmission: 'CVT', fuel_type: 'Hybrid', seats: 5, vehicle_model: { vehicle_line: { vehicle_type: 'Sedan' } }, imageUrl: '/images/cars/sedan-silver.png' },
  { id: 103, make: 'Hyundai', model: 'Tucson', year: 2021, rental_rate_per_day: 110, transmission: 'Automatic', fuel_type: 'Petrol', seats: 5, vehicle_model: { vehicle_line: { vehicle_type: 'SUV' } }, imageUrl: '/images/cars/suv-blue.png' },
  { id: 104, make: 'Kia', model: 'Sportage', year: 2022, rental_rate_per_day: 115, transmission: 'Automatic', fuel_type: 'Diesel', seats: 5, vehicle_model: { vehicle_line: { vehicle_type: 'SUV' } }, imageUrl: '/images/cars/suv-black.png' },
]

export const DEMO_TESTIMONIALS = [
  { name: 'Sophie L.', role: 'Rideshare Driver', quote: 'Picked up a clean car and hit the road in minutes. Best rates in Melbourne!', avatar: '/images/avatars/avatar-1.png' },
  { name: 'Mark R.', role: 'Contractor', quote: 'Long-term rental was flexible and hassle-free. Highly recommended.', avatar: '/images/avatars/avatar-2.png' },
  { name: 'Aisha K.', role: 'Student', quote: 'Loved the simple booking and great customer service.', avatar: '/images/avatars/avatar-3.png' },
]


