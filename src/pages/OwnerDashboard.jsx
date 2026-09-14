import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Utensils, Star, Eye, Edit3, Plus,
  Trash2, CheckCircle, XCircle, Save, X, TrendingUp,
  MessageSquare, Clock, MapPin, LogOut, ChevronRight,
  AlertCircle, Store, ShoppingBag, Calendar, Phone, Check, RefreshCw, Upload, Image as ImageIcon, BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import {
  getRestaurantsByOwner, updateRestaurantInfo,
  addDish, deleteDish, toggleDishAvailability,
  getDishesByRestaurant, getReviewsByRestaurant, uploadDishImage,
  getOrdersByRestaurant, updateOrderStatus, listenToOrdersByRestaurant,
  getBookingsByRestaurant, updateBookingStatus
} from '../firebase/services'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE, DEFAULT_DISH_IMAGE } from '../utils/imageHelper'
import { playNewOrderSound } from '../utils/soundHelper'

const DISH_CATS = ['BBQ', 'Rice', 'Curry', 'Fast Food', 'Drinks', 'Desserts', 'Starters', 'Other']

const getTabs = (t) => [
  { id: 'overview', label: t('tabOverview'), icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'info', label: t('tabInfo'), icon: <Store className="w-4 h-4" /> },
  { id: 'menu', label: t('tabMenu'), icon: <Utensils className="w-4 h-4" /> },
  { id: 'orders', label: t('tabOrders'), icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'bookings', label: t('tabBookings'), icon: <Calendar className="w-4 h-4" /> },
  { id: 'reviews', label: t('tabReviews'), icon: <Star className="w-4 h-4" /> },
]

const OwnerDashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { t, isUrdu } = useLanguage()

  const [activeTab, setActiveTab] = useState('overview')
  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  const [reviews, setReviews] = useState([])
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notif, setNotif] = useState({ msg: '', type: '' })
  const [showAddDish, setShowAddDish] = useState(false)
  const [editInfo, setEditInfo] = useState(false)
  const [infoForm, setInfoForm] = useState({})
  const [dishForm, setDishForm] = useState({ name: '', price: '', category: 'BBQ', image: '', available: true })
  const [dishAction, setDishAction] = useState('')
  const [dishImageFile, setDishImageFile] = useState(null)
  const [dishImagePreview, setDishImagePreview] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadData()
  }, [isAuthenticated])

  const prevOrdersCountRef = useRef(null)

  // Real-time order listener with audio alert
  useEffect(() => {
    if (!restaurant) return
    
    const unsubscribe = listenToOrdersByRestaurant(restaurant.id, (updatedOrders) => {
      if (prevOrdersCountRef.current !== null && updatedOrders.length > prevOrdersCountRef.current) {
        // Sound alert for new order
        playNewOrderSound()
        showNotif('🔔 Naya Online Food Order Aaya Hai!', 'success')
      }
      prevOrdersCountRef.current = updatedOrders.length
      setOrders(updatedOrders)
    })
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [restaurant])

  const loadData = async () => {
    setLoading(true)
    const rRes = await getRestaurantsByOwner(user.uid)
    if (rRes.success && rRes.restaurants?.length > 0) {
      const r = rRes.restaurants[0]
      setRestaurant(r)
      setInfoForm({
        name: r.name || '',
        cuisine: r.cuisine || '',
        description: r.description || '',
        address: r.address || '',
        phone: r.phone || '',
        email: r.email || '',
        openingHours: r.openingHours || '',
        priceRange: r.priceRange || '$$',
        specialDish: r.specialDish || '',
        specialDishPrice: r.specialDishPrice || '',
        isOpen: r.isOpen !== false
      })

      const [dRes, revRes, ordRes, bookRes] = await Promise.all([
        getDishesByRestaurant(r.id),
        getReviewsByRestaurant(r.id),
        getOrdersByRestaurant(r.id),
        getBookingsByRestaurant(r.id)
      ])
      if (dRes.success) setDishes(dRes.dishes || [])
      if (revRes.success) setReviews(revRes.reviews || [])
      if (ordRes.success) setOrders(ordRes.orders || [])
      if (bookRes.success) setBookings(bookRes.bookings || [])
    }

    setLoading(false)
  }

  const showNotif = (msg, type = 'success') => {
    setNotif({ msg, type })
    setTimeout(() => setNotif({ msg: '', type: '' }), 3000)
  }

  const handleSaveInfo = async () => {
    if (!restaurant) return
    setSaving(true)
    const res = await updateRestaurantInfo(restaurant.id, infoForm)
    if (res.success) {
      setRestaurant((p) => ({ ...p, ...infoForm }))
      setEditInfo(false)
      showNotif('Restaurant info updated successfully!')
    } else {
      showNotif(res.error || 'Failed to update', 'error')
    }
    setSaving(false)
  }

  const handleAddDish = async (e) => {
    e.preventDefault()
    if (!dishForm.name || !dishForm.price) return
    setSaving(true)

    let imageUrl = getValidImageUrl(dishForm.image, DEFAULT_DISH_IMAGE)
    if (dishImageFile) {
      const tempId = Date.now().toString()
      const uploadResult = await uploadDishImage(dishImageFile, restaurant.id, tempId)
      if (uploadResult.success) {
        imageUrl = uploadResult.url
      } else {
        showNotif(uploadResult.error || 'Failed to upload image', 'error')
        setSaving(false)
        return
      }
    }

    const res = await addDish({ ...dishForm, image: imageUrl }, restaurant.id)
    if (res.success) {
      setDishes((p) => [...p, { ...dishForm, image: imageUrl, id: res.dishId || Date.now().toString() }])
      setDishForm({ name: '', price: '', category: 'BBQ', image: '', available: true })
      setDishImageFile(null)
      setDishImagePreview('')
      setShowAddDish(false)
      showNotif('Dish added successfully!')
    } else {
      showNotif(res.error || 'Failed', 'error')
    }
    setSaving(false)
  }

  const handleToggleDish = async (id, current) => {
    setDishAction(id)
    const res = await toggleDishAvailability(id, current)
    if (res.success) setDishes(p => p.map(d => d.id === id ? { ...d, available: !current } : d))
    setDishAction('')
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus)
    if (res.success) {
      setOrders(p => p.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      showNotif(`Order status updated to ${newStatus}`)
    } else {
      showNotif(res.error || 'Failed to update status', 'error')
    }
  }

  const handleDeleteDish = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    setDishAction(id)
    const res = await deleteDish(id)
    if (res.success) setDishes((p) => p.filter((d) => d.id !== id))
    setDishAction('')
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const res = await updateBookingStatus(bookingId, newStatus)
    if (res.success) {
      setBookings(p => p.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
      showNotif(`Booking marked as ${newStatus}`)
    } else {
      showNotif(res.error || 'Failed to update booking status', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ready': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'delivered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : restaurant?.rating || 4.5

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Owner Console...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
            <Store className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Restaurant Registered</h2>
          <p className="text-slate-400 text-xs">Register your Peshawar restaurant to manage menu, orders, and table bookings.</p>
          <Link to="/register-restaurant" className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl inline-block text-sm">
            + Register Restaurant
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex-col fixed left-0 top-0 bottom-0 z-40 hidden md:flex"
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
              {restaurant.image ? (
                <img 
                  src={getValidImageUrl(restaurant, DEFAULT_RESTAURANT_IMAGE)} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
                />
              ) : (
                <Store className="w-5 h-5 text-amber-500 m-auto mt-2.5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-sm truncate">{restaurant.name}</p>
              <p className="text-slate-400 text-xs truncate mt-0.5">{restaurant.cuisine}</p>
            </div>
          </div>
          <div className={`mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg w-fit ${restaurant.isOpen !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen !== false ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            {restaurant.isOpen !== false ? 'Open Now' : 'Closed'}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getTabs(t).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Eye className="w-4 h-4 text-amber-500" />
            {isUrdu ? 'لائیو پیج دیکھیں' : 'View Live Public Page'}
          </Link>
          <button
            onClick={async () => {
              await logout()
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
        {/* Top Bar */}
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-white">{t('ownerDashboardTitle')}</h1>
            <p className="text-slate-400 text-xs mt-0.5">{restaurant.name} Console</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'menu' && (
              <button
                onClick={() => setShowAddDish(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Dish
              </button>
            )}
          </div>
        </header>

        {/* Notifications */}
        <AnimatePresence>
          {notif.msg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 border text-xs font-bold ${
                notif.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {notif.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {notif.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="p-6">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: <Utensils className="w-5 h-5 text-amber-500" />, label: 'Total Menu Dishes', value: dishes.length, sub: `${dishes.filter((d) => d.available !== false).length} active` },
                    { icon: <ShoppingBag className="w-5 h-5 text-blue-400" />, label: 'Total Orders', value: orders.length, sub: `${orders.filter((o) => o.status === 'pending').length} pending` },
                    { icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, label: 'Completed Orders', value: orders.filter(o => o.status === 'delivered').length, sub: 'Successfully delivered' },
                    { icon: <Star className="w-5 h-5 text-yellow-400" />, label: 'Average Rating', value: avgRating, sub: `${reviews.length} reviews` }
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="p-2.5 bg-slate-800 rounded-xl w-fit">{s.icon}</div>
                      <div className="text-2xl font-black text-white">{s.value}</div>
                      <div className="text-slate-400 text-xs font-bold">{s.label}</div>
                      <div className="text-slate-500 text-[10px]">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-500" />Performance Analytics</h3>
                  
                  {/* Simple Bar Chart */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Dishes Available</span>
                        <span className="text-white font-bold">{dishes.filter(d => d.available !== false).length}/{dishes.length}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                          style={{ width: `${dishes.length ? (dishes.filter(d => d.available !== false).length / dishes.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Rating Score</span>
                        <span className="text-white font-bold">{avgRating}/5.0</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
                          style={{ width: `${(avgRating / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Customer Reviews</span>
                        <span className="text-white font-bold">{reviews.length}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min(reviews.length * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-white text-base">Quick Status</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-800/60 rounded-xl space-y-1">
                      <p className="text-slate-400">Opening Hours</p>
                      <p className="text-white font-bold">{restaurant.openingHours || '11:00 AM - 12:00 AM'}</p>
                    </div>
                    <div className="p-4 bg-slate-800/60 rounded-xl space-y-1">
                      <p className="text-slate-400">Signature Dish</p>
                      <p className="text-amber-400 font-bold">{restaurant.specialDish || 'Mutton Karahi'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESTAURANT INFO TAB */}
            {activeTab === 'info' && (
              <motion.div key="info" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-white text-base">Edit Restaurant Profile</h3>
                  {!editInfo ? (
                    <button onClick={() => setEditInfo(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
                      <Edit3 className="w-4 h-4" /> Edit Details
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditInfo(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                        Cancel
                      </button>
                      <button onClick={handleSaveInfo} disabled={saving} className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1">
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Restaurant Name</label>
                    <input
                      disabled={!editInfo}
                      value={infoForm.name || ''}
                      onChange={(e) => setInfoForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cuisine Type</label>
                    <input
                      disabled={!editInfo}
                      value={infoForm.cuisine || ''}
                      onChange={(e) => setInfoForm((p) => ({ ...p, cuisine: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none disabled:opacity-60"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-400 block mb-1">Address in Peshawar</label>
                    <input
                      disabled={!editInfo}
                      value={infoForm.address || ''}
                      onChange={(e) => setInfoForm((p) => ({ ...p, address: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Phone Number</label>
                    <input
                      disabled={!editInfo}
                      value={infoForm.phone || ''}
                      onChange={(e) => setInfoForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Opening Hours</label>
                    <input
                      disabled={!editInfo}
                      value={infoForm.openingHours || ''}
                      onChange={(e) => setInfoForm((p) => ({ ...p, openingHours: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* MENU DISHES TAB */}
            {activeTab === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {showAddDish && (
                  <form onSubmit={handleAddDish} className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 space-y-4 text-xs">
                    <h3 className="font-bold text-white text-base">Add New Menu Dish</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 block mb-1">Dish Name *</label>
                        <input
                          required
                          value={dishForm.name}
                          onChange={(e) => setDishForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Shinwari Karahi 1KG"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Price *</label>
                        <input
                          required
                          value={dishForm.price}
                          onChange={(e) => setDishForm((p) => ({ ...p, price: e.target.value }))}
                          placeholder="Rs. 1800"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Category</label>
                        <select
                          value={dishForm.category}
                          onChange={(e) => setDishForm((p) => ({ ...p, category: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                        >
                          {DISH_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Image URL (optional)</label>
                        <input
                          value={dishForm.image}
                          onChange={(e) => setDishForm((p) => ({ ...p, image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={saving} className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">
                        {saving ? 'Adding...' : 'Add Dish'}
                      </button>
                      <button type="button" onClick={() => setShowAddDish(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dishes.map((dish) => (
                    <div key={dish.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-sm">{dish.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dish.available !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                            {dish.available !== false ? 'Available' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-amber-400 font-bold text-xs mt-1">Rs. {dish.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleDish(dish.id, dish.available !== false)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg"
                        >
                          {dish.available !== false ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Online Food Orders ({orders.length})
                </h3>

                {orders.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    No online food orders received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div>
                            <span className="font-mono font-bold text-amber-400 text-sm">Order #{order.id?.slice(-6)}</span>
                            <span className="text-slate-500 text-[10px] block">{order.createdAt ? new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleString() : 'Just now'}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${getStatusColor(order.status)}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-300">
                          <p><strong>Customer:</strong> {order.customerName || order.userName || 'Guest'}</p>
                          <p><strong>Phone:</strong> {order.customerPhone || order.phone || 'N/A'}</p>
                          <p><strong>Address:</strong> {order.deliveryAddress || order.address || 'Pickup'}</p>
                          <p><strong>Total:</strong> Rs. {order.totalAmount || order.total || '0'}</p>
                        </div>

                        {order.items && (
                          <div className="bg-slate-800/60 rounded-xl p-3 space-y-1">
                            <p className="font-bold text-white mb-2">Items:</p>
                            {order.items.map((item, idx) => {
                              const p = parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0
                              const qty = item.quantity || item.qty || 1
                              return (
                                <div key={idx} className="flex justify-between text-slate-300">
                                  <span>{item.name} x{qty}</span>
                                  <span>Rs. {(p * qty).toLocaleString()}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2 flex-wrap">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-slate-950 font-bold rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Start Preparing
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 font-bold rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                              className="flex-1 py-2 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-slate-950 font-bold rounded-xl border border-purple-500/30 transition-all flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Table Reservations ({bookings.length})
                </h3>

                {bookings.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    No table reservations submitted yet.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-mono font-bold text-amber-400">#{booking.id?.slice(-6) || booking.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            booking.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-300">
                          <p><strong>Customer:</strong> {booking.customerName}</p>
                          <p><strong>Phone:</strong> {booking.customerPhone}</p>
                          <p><strong>Date & Time:</strong> {booking.date} at {booking.time}</p>
                          <p><strong>Guests:</strong> {booking.guests} People</p>
                          {booking.specialRequest && <p className="text-amber-400"><strong>Note:</strong> {booking.specialRequest}</p>}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {t('accept')}
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                            className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 font-bold rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            {t('reject')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rev.name || rev.userName || 'Peshawar Foodie'}</span>
                      <span className="text-amber-400 font-bold">★ {rev.rating}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default OwnerDashboard
