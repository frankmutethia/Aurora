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

export function filterDemoCars(query: URLSearchParams) {
  let data = [...DEMO_CARS]
  const make = query.get('make')?.toLowerCase()
  const category = query.get('category') || undefined
  const transmission = query.get('transmission') || undefined
  const fuel = query.get('fuel_type') || undefined
  const seats = Number(query.get('seats') || 0)
  const min = Number(query.get('min_price') || 0)
  const max = Number(query.get('max_price') || 100000)

  if (make) data = data.filter((c) => [c.make, c.model].join(' ').toLowerCase().includes(make))
  if (category && category !== 'Any') data = data.filter((c) => c.vehicle_model?.vehicle_line?.vehicle_type === (category as any))
  if (transmission && transmission !== 'Any') data = data.filter((c) => c.transmission === transmission)
  if (fuel && fuel !== 'Any') data = data.filter((c) => c.fuel_type === fuel)
  if (seats) data = data.filter((c) => (c.seats || 0) >= seats)
  data = data.filter((c) => c.rental_rate_per_day >= min && c.rental_rate_per_day <= max)

  const page = Number(query.get('page') || 1)
  const per_page = Number(query.get('per_page') || 12)
  const total = data.length
  const start = (page - 1) * per_page
  const items = data.slice(start, start + per_page)
  const total_pages = Math.max(1, Math.ceil(total / per_page))

  return { cars: items, pagination: { page, per_page, total, total_pages } }
}


