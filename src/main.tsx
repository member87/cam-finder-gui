import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes } from './Routes'

declare global {
  interface Window {
    electronAPI: any
  }
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)

