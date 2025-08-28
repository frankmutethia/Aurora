// API Types
export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'customer' | 'admin' | 'superAdmin'
  loyalty_points: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  agency?: Agency | null
}

export interface Agency {
  id: number
  name: string
  location: string
  postal_code: string
  contact: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DashboardData {
  // Customer dashboard
  data?: string
  // Admin dashboard
  agency_name?: string
  cars_count?: number
  available_cars?: number
  rented_cars?: number
  under_maintenance_cars?: number
  // SuperAdmin dashboard
  agencies_count?: number
  bookings_count?: number
  total_users?: number
  active_users?: number
  inactive_users?: number
}

export interface LoginResponse {
  token: string
  user: User
  dashboard: DashboardData
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  phone: string
  email: string
  password: string
  password_confirmation: string
}

export interface RegisterResponse {
  user: User
  token: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

const API_BASE_URL = 'https://4043f016f021.ngrok-free.app/api/v1'

// Storage keys
const TOKEN_KEY = 'am_token'
const USER_KEY = 'am_user'
const DASHBOARD_KEY = 'am_dashboard'

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem(TOKEN_KEY)
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  }
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const url = `${API_BASE_URL}${endpoint}`
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
  console.log('📤 Request Config:', config)
  
  try {
    const response = await fetch(url, config)
    const data = await response.json()

    console.log(`📥 API Response (${response.status}):`, data)
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('❌ API request failed:', error)
    throw error
  }
}

// Authentication API functions
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Attempting login:', { email: credentials.email })
    
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const { user, token, dashboard } = response.data
    
    console.log('✅ Login successful:', {
      userId: user.id,
      email: user.email,
      role: user.role,
      agency: user.agency?.name || 'No agency',
      dashboardType: user.role === 'customer' ? 'Customer Dashboard' : 
                    user.role === 'admin' ? 'Admin Dashboard' : 
                    'SuperAdmin Dashboard'
    })

    // Store user data and token in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboard))

    console.log('💾 User data stored in localStorage')
    
    return response.data
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    console.log('🔐 Registering new user:', { email: userData.email, role: 'customer' })
    
    const response = await apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    console.log('✅ Registration successful:', response.data.user)
    
    // Store user data (token will be null after registration)
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token)
    }
    
    return response.data
  },

  async logout(): Promise<void> {
    console.log('🔓 Logging out user')
    
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage regardless of API call success
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(DASHBOARD_KEY)
      
      console.log('🗑️ User data cleared from localStorage')
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return null
      
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return await apiRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
    })
  },

  // Utility functions
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getDashboard(): DashboardData | null {
    try {
      const dashboardStr = localStorage.getItem(DASHBOARD_KEY)
      return dashboardStr ? JSON.parse(dashboardStr) : null
    } catch (error) {
      console.error('Failed to get dashboard data:', error)
      return null
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = localStorage.getItem(USER_KEY)
    return !!(token && user)
  },

  hasRole(role: 'customer' | 'admin' | 'superAdmin'): boolean {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return false
      
      const user: User = JSON.parse(userStr)
      return user.role === role
    } catch (error) {
      return false
    }
  },

  getUserRole(): 'customer' | 'admin' | 'superAdmin' | null {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return null
      
      const user: User = JSON.parse(userStr)
      return user.role
    } catch (error) {
      return null
    }
  }
}

// Export for backward compatibility and easier imports
export const {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  getToken,
  getDashboard,
  isAuthenticated,
  hasRole,
  getUserRole,
} = authAPI

// Helper functions for external use
export const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    return null
  }
}

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getStoredDashboard = (): DashboardData | null => {
  try {
    const dashboardData = localStorage.getItem(DASHBOARD_KEY)
    return dashboardData ? JSON.parse(dashboardData) : null
  } catch (error) {
    console.error('Error parsing stored dashboard data:', error)
    return null
  }
}

// Check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  return !!getStoredToken() && !!getStoredUser()
}

// Get authorization header for API requests
export const getAuthHeader = (): Record<string, string> => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Fleet Management API Types
export interface Car {
  id: number
  make: string
  model: string
  year: number
  license_plate: string
  category_id: number
  transmission: string
  fuel_type: string
  seats: number
  rental_rate_per_day: string
  vin: string
  current_odometer: number
  last_service_odometer: number
  service_threshold_km: number
  insurance_expiry_date: string
  agency_id: number
  status: string
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
  }
  images: Array<{
    id: number
    car_id: number
    image_url: string
    created_at: string
    updated_at: string
  }>
  agency?: {
    id: number
    name: string
    location: string
    postal_code: string
    contact: string
    email: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

export interface CarFilters {
  page?: number
  size?: number
  max_price?: number
  status?: string
  fuel_type?: string
  seats?: number
  agency_id?: number
}

export interface CreateCarData {
  make: string
  model: string
  year: number
  license_plate: string
  category_id: number
  transmission: 'Automatic' | 'Manual' | 'CVT'
  fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'
  seats: number
  rental_rate_per_day: number
  agency_id: number
  vin: string
  current_odometer: number
  last_service_odometer: number
  service_threshold_km: number
  insurance_expiry_date: string
  images: File[]
}

export interface CarListResponse {
  status: string
  message: string
  data: {
    data: Car[]
    meta: {
      current_page: number
      last_page: number
      total: number
      per_page: number
    }
  }
}

// Fleet Management API functions
export const fleetAPI = {
  // Fetch all cars with optional filters
  async getCars(filters: CarFilters = {}): Promise<CarListResponse> {
    const queryParams = new URLSearchParams()
    
    if (filters.page !== undefined) queryParams.append('page', filters.page.toString())
    if (filters.size !== undefined) queryParams.append('size', filters.size.toString())
    if (filters.max_price !== undefined) queryParams.append('max_price', filters.max_price.toString())
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.fuel_type) queryParams.append('fuel_type', filters.fuel_type)
    if (filters.seats !== undefined) queryParams.append('seats', filters.seats.toString())
    if (filters.agency_id !== undefined) queryParams.append('agency_id', filters.agency_id.toString())

    const endpoint = `/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    console.log('🚗 Fetching cars with filters:', filters)
    
    return await apiRequest<CarListResponse['data']>(endpoint, {
      method: 'GET'
    }).then(response => ({
      ...response,
      data: response.data
    }))
  },

  // Fetch a specific car by ID
  async getCar(carId: number): Promise<ApiResponse<Car>> {
    console.log(`🚗 Fetching car details for ID: ${carId}`)
    
    return await apiRequest<Car>(`/cars/${carId}`, {
      method: 'GET'
    })
  },

  // Create a new car
  async createCar(carData: CreateCarData): Promise<ApiResponse<Car>> {
    console.log('🚗 Creating new car:', { make: carData.make, model: carData.model, license_plate: carData.license_plate })
    
    const formData = new FormData()
    
    // Append all car data to form data
    formData.append('make', carData.make)
    formData.append('model', carData.model)
    formData.append('year', carData.year.toString())
    formData.append('license_plate', carData.license_plate)
    formData.append('category_id', carData.category_id.toString())
    formData.append('transmission', carData.transmission)
    formData.append('fuel_type', carData.fuel_type)
    formData.append('seats', carData.seats.toString())
    formData.append('rental_rate_per_day', carData.rental_rate_per_day.toString())
    formData.append('agency_id', carData.agency_id.toString())
    formData.append('vin', carData.vin)
    formData.append('current_odometer', carData.current_odometer.toString())
    formData.append('last_service_odometer', carData.last_service_odometer.toString())
    formData.append('service_threshold_km', carData.service_threshold_km.toString())
    formData.append('insurance_expiry_date', carData.insurance_expiry_date)
    
    // Append images
    carData.images.forEach(image => {
      formData.append('images[]', image)
    })

    const token = getStoredToken()
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true'
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers,
      body: formData
    })

    const data = await response.json()
    console.log(`📥 Create car response (${response.status}):`, data)
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create car')
    }

    return data
  },

  // Delete a car
  async deleteCar(carId: number): Promise<void> {
    console.log(`🗑️ Deleting car with ID: ${carId}`)
    
    const token = getStoredToken()
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true'
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to delete car')
    }

    console.log('✅ Car deleted successfully')
  },

  // Toggle car status (Available/Disabled)
  async toggleCarStatus(carId: number): Promise<ApiResponse<Car>> {
    console.log(`🔄 Toggling status for car ID: ${carId}`)
    
    return await apiRequest<Car>(`/cars/status/${carId}`, {
      method: 'PUT'
    })
  },

  // Toggle car maintenance status
  async toggleCarMaintenance(carId: number): Promise<ApiResponse<Car>> {
    console.log(`🔧 Toggling maintenance status for car ${carId}`)
    
    return await apiRequest<Car>(`/cars/maintenance/${carId}`, {
      method: 'PUT'
    })
  },

  // Add images to a car
  async addCarImages(carId: number, images: File[]): Promise<ApiResponse<any[]>> {
    console.log(`📸 Adding ${images.length} images to car ID: ${carId}`)
    
    const formData = new FormData()
    
    images.forEach(image => {
      formData.append('images[]', image)
    })

    const token = getStoredToken()
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true'
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cars/images/update?car_id=${carId}`, {
      method: 'POST',
      headers,
      body: formData
    })

    const data = await response.json()
    console.log(`📥 Add images response (${response.status}):`, data)
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload images')
    }

    return data
  },

  // Delete car image
  async deleteCarImage(imageId: number): Promise<void> {
    console.log(`🗑️ Deleting car image ${imageId}`)
    
    const token = getStoredToken()
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true'
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cars/${imageId}/images/delete`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to delete car image')
    }

    console.log('✅ Car image deleted successfully')
  }
}

// ==================== AGENCY MANAGEMENT ====================

export interface CreateAgencyRequest {
  name: string
  location: string
  postal_code: string
  contact: string
  email: string
  is_active: boolean
}

// Agency Management API functions
export const agencyAPI = {
  // Fetch all agencies
  async getAgencies(): Promise<ApiResponse<Agency[]>> {
    console.log('📋 Fetching all agencies')
    
    return await apiRequest<Agency[]>('/agency/list', {
      method: 'GET'
    })
  },

  // Fetch agency details
  async getAgencyDetails(agencyId: number): Promise<ApiResponse<Agency>> {
    console.log(`📋 Fetching agency details for ${agencyId}`)
    
    return await apiRequest<Agency>(`/agency/details/${agencyId}`, {
      method: 'GET'
    })
  },

  // Create agency
  async createAgency(agencyData: CreateAgencyRequest): Promise<ApiResponse<Agency>> {
    console.log('➕ Creating new agency:', agencyData)
    
    return await apiRequest<Agency>('/agency/create', {
      method: 'POST',
      body: JSON.stringify(agencyData)
    })
  },

  // Update agency
  async updateAgency(agencyId: number, agencyData: CreateAgencyRequest): Promise<ApiResponse<Agency>> {
    console.log(`✏️ Updating agency ${agencyId}:`, agencyData)
    
    return await apiRequest<Agency>(`/agency/update/${agencyId}`, {
      method: 'PUT',
      body: JSON.stringify(agencyData)
    })
  },

  // Toggle agency status
  async toggleAgencyStatus(agencyId: number): Promise<ApiResponse<Agency>> {
    console.log(`🔄 Toggling agency status for ${agencyId}`)
    
    return await apiRequest<Agency>(`/agency/status/${agencyId}`, {
      method: 'GET'
    })
  },

  // Delete agency
  async deleteAgency(agencyId: number): Promise<void> {
    console.log(`🗑️ Deleting agency ${agencyId}`)
    
    const token = getStoredToken()
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true'
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/agency/delete/${agencyId}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to delete agency')
    }

    console.log('✅ Agency deleted successfully')
  }
}

// ==================== USER MANAGEMENT ====================

export interface CreateUserRequest {
  first_name: string
  last_name: string
  agency_id: number
  phone: string
  email: string
  password: string
}

export interface ApiUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: 'superAdmin' | 'admin' | 'customer'
  loyalty_points: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  agency: Agency | null
}

// User Management API functions
export const userAPI = {
  // Create admin user
  async createAdminUser(userData: CreateUserRequest): Promise<ApiResponse<ApiUser>> {
    console.log('➕ Creating new admin user:', userData)
    
    return await apiRequest<ApiUser>('/user-management/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  // Fetch all users
  async getUsers(page = 0, size = 20): Promise<ApiResponse<ApiUser[]>> {
    console.log(`📋 Fetching users (page: ${page}, size: ${size})`)
    
    return await apiRequest<ApiUser[]>(`/user-management/users?page=${page}&size=${size}`, {
      method: 'GET'
    })
  }
}

// Convenience exports for backward compatibility
export const fetchCars = fleetAPI.getCars
export const getCars = fleetAPI.getCars
export const getCar = fleetAPI.getCar
export const createCar = fleetAPI.createCar
export const deleteCar = fleetAPI.deleteCar
export const toggleCarStatus = fleetAPI.toggleCarStatus
export const toggleCarMaintenance = fleetAPI.toggleCarMaintenance
export const addCarImages = fleetAPI.addCarImages
export const deleteCarImage = fleetAPI.deleteCarImage

export const getAgencies = agencyAPI.getAgencies
export const getAgencyDetails = agencyAPI.getAgencyDetails
export const createAgency = agencyAPI.createAgency
export const updateAgency = agencyAPI.updateAgency
export const toggleAgencyStatus = agencyAPI.toggleAgencyStatus
export const deleteAgency = agencyAPI.deleteAgency

export const createAdminUser = userAPI.createAdminUser
export const getUsers = userAPI.getUsers

export default authAPI
