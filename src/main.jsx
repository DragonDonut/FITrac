import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-black dark:text-white transition-colors duration-300">
      <App />
    </div>
  </React.StrictMode>
)
