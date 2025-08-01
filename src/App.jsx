import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from 'react-router-dom'
import AdminView from './components/AdminView.jsx'
import TrackerView from './components/TrackerView.jsx'
import { useEffect, useState } from 'react'

function AdminWrapper() {
  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')
  const required = import.meta.env.VITE_ADMIN_KEY
  if (key !== required) {
    return <div className="p-4">Unauthorized. Provide correct key in query param.</div>
  }
  return <AdminView />
}

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors duration-300">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-zinc-200 dark:bg-zinc-800 text-sm px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<TrackerView />} />
          <Route path="/tracker" element={<TrackerView />} />
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
