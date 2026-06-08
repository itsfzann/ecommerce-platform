import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'

export default function LoginPage() {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true })
    }
  }, [token, from, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    const demoUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+62 812-3456-7890',
      address: 'Jakarta, Indonesia',
    }
    setToken('shophub-demo-token')
    setUser(demoUser)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Login</h1>
          <p className="text-slate-600 mb-8">
            Masuk untuk melanjutkan ke halaman <span className="font-semibold text-slate-900">{from}</span>.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
