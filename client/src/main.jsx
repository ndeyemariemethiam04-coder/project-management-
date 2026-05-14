import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" toastOptions={{
      style: {
        background: '#ffffff',
        color: '#1e293b',
        border: '1px solid #e2e8f0'
      }
    }} />
  </React.StrictMode>,
)
