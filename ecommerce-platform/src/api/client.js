import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api'
const TIMEOUT = parseInt(import.meta.env.REACT_APP_API_TIMEOUT) || 10000

const client = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const { token } = response.data
        localStorage.setItem('authToken', token)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return client(originalRequest)
      } catch (refreshError) {
        // Logout user
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error.response?.data || error)
  }
)

export default client
