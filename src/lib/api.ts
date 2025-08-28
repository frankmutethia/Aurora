import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  Profile 
} from './types'

const API_BASE_URL = 'http://172.20.10.11:8000/api/v1'

// Storage keys
const TOKEN_KEY = 'am_token'
const USER_KEY = 'am_user'

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Authentication API functions
export const authAPI = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.status === 'success' && response.data.token) {
      // Store token and user data in localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
    }
    
    return response
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.status === 'success' && response.data.token) {
      // Store token and user data in localStorage
      localStorage.setItem(TOKEN_KEY, response.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
    }
    
    return response
  },

  async logout(): Promise<void> {
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
    }
  },

  async getCurrentUser(): Promise<Profile | null> {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return null
      
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    return await apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
  },

  // Utility functions
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = localStorage.getItem(USER_KEY)
    return !!(token && user)
  },

  hasRole(role: string): boolean {
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return false
      
      const user = JSON.parse(userStr)
      return user.role === role
    } catch (error) {
      return false
    }
  },
}

// Export for backward compatibility and easier imports
export const {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  getToken,
  isAuthenticated,
  hasRole,
} = authAPI

export default authAPI
