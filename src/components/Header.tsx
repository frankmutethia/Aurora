import { useEffect, useState } from 'react'
import { getCurrentUser, logout } from '../lib/auth'
import type { Profile } from '../lib/types'

const Header = () => {
  const [user, setUser] = useState<Profile | null>(null)
  useEffect(() => { setUser(getCurrentUser()) }, [])
  function handleLogout() { logout(); location.href = '/' }
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2" aria-label="Smart Car Rentals home">
          <img src="/images/logo.jpg" alt="Smart Rentals Logo" className="h-9 w-9 rounded object-cover" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">Smart Car Rentals</span>
            <span className="text-[11px] text-sky-700/80">Smart Car Rentals</span>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/cars" className="text-sm font-medium text-foreground/80 hover:text-sky-700">Browse Cars</a>
          <a href="/about" className="text-sm font-medium text-foreground/80 hover:text-sky-700">About</a>
          <a href="/terms" className="text-sm font-medium text-foreground/80 hover:text-sky-700">T&Cs</a>
          <a href="/contact" className="text-sm font-medium text-foreground/80 hover:text-sky-700">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <a href="/admin" className="px-3 h-8 inline-flex items-center justify-center rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm">Admin</a>
              )}
              <a href="/profile" className="px-3 h-8 inline-flex items-center justify-center rounded-md hover:text-sky-700 text-sm">{user.first_name || user.email}</a>
              <button onClick={handleLogout} className="px-3 h-8 inline-flex items-center justify-center rounded-md border bg-transparent hover:border-sky-300 text-sm">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="px-3 h-8 inline-flex items-center justify-center rounded-md border bg-transparent hover:border-sky-300 text-sm">Sign in</a>
              <a href="/register" className="h-8 px-3 inline-flex items-center justify-center rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700 shadow-sm">Create account</a>
            </>
          )}
        </div>

        {/* Mobile auth/actions */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <>
              {user.role === 'admin' && (
                <a href="/admin" className="h-8 px-2 inline-flex items-center justify-center rounded-md bg-sky-600 text-white text-xs hover:bg-sky-700">Admin</a>
              )}
              <a href="/profile" className="h-8 px-2 inline-flex items-center justify-center rounded-md text-xs hover:text-sky-700">Profile</a>
              <button onClick={handleLogout} className="h-8 px-2 inline-flex items-center justify-center rounded-md border bg-transparent text-xs hover:border-sky-300">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="h-8 px-2 inline-flex items-center justify-center rounded-md border bg-transparent text-xs hover:border-sky-300">Sign in</a>
              <a href="/register" className="h-8 px-2 inline-flex items-center justify-center rounded-md bg-sky-600 text-white text-xs hover:bg-sky-700 shadow-sm">Create</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header


