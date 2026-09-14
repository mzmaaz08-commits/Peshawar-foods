import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'
import { seedRestaurants } from './firebase/seedData'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RestaurantList from './pages/RestaurantList'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import RestaurantRegistration from './pages/RestaurantRegistration'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import LiveActivityTicker from './components/LiveActivityTicker'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

const HIDE_NAVBAR_ROUTES = ['/login', '/register', '/dashboard', '/admin']

const App = () => {
  const location = useLocation()
  const hideNavbar = HIDE_NAVBAR_ROUTES.some(r => location.pathname.startsWith(r))

  useEffect(() => {
    const seeded = localStorage.getItem('peshawar_seeded')
    if (!seeded) {
      seedRestaurants().then(res => {
        if (res.success) localStorage.setItem('peshawar_seeded', 'true')
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {!hideNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-restaurant" element={<ProtectedRoute><RestaurantRegistration /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!hideNavbar && <LiveActivityTicker />}
    </div>
  )
}

export default App
