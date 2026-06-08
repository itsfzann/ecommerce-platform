import { create } from 'zustand'

const storedUser = localStorage.getItem('authUser')

export const useAuthStore = create((set, get) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  setUser: (user) => {
    localStorage.setItem('authUser', JSON.stringify(user))
    set({ user })
  },

  updateUser: (updates) => {
    const user = { ...(get().user || {}), ...updates }
    localStorage.setItem('authUser', JSON.stringify(user))
    set({ user })
  },

  setToken: (token) => {
    localStorage.setItem('authToken', token)
    if (!get().user) {
      const demoUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62 812-3456-7890',
        address: 'Jakarta, Indonesia',
      }
      localStorage.setItem('authUser', JSON.stringify(demoUser))
      set({ user: demoUser })
    }
    set({ token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authUser')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}))
