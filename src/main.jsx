import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { JobOrdersProvider } from './contexts/JobOrdersContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JobOrdersProvider>
      <App />
    </JobOrdersProvider>
  </React.StrictMode>,
)
