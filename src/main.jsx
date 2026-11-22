import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AppRoutes from '../app/routes'
import './style.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)
