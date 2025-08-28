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

export default authAPI
