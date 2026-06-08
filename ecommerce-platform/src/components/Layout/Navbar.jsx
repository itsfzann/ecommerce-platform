import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
]

function navLinkClass({ isActive }) {
  return `block rounded-2xl px-4 py-2 transition text-gray-600 hover:text-primary-600 ${
    isActive ? 'font-semibold text-primary-700 bg-primary-50' : ''
  }`
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="text-2xl font-bold text-primary-600">
          🛍️ ShopHub
        </NavLink>

        <button
          type="button"
          className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-2 text-gray-600 hover:border-primary-300 hover:text-primary-700 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg">☰</span>
        </button>

        <nav className={`w-full md:flex md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass} onClick={() => setIsOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/profile"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </NavLink>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="block rounded-2xl bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block rounded-2xl bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700 ${
                      isActive ? 'ring-2 ring-primary-300' : ''
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
