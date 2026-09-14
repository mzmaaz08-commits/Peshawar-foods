import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Store, Users, Star, TrendingUp,
  Shield, Eye, Trash2, CheckCircle, XCircle,
  Search, LogOut, ChevronRight, BarChart3, RefreshCw, ShoppingBag, Calendar
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getAllRestaurants, getAllUsers, updateRestaurantStatus, deleteRestaurantAdmin } from '../firebase/services'

const getAdminTabs = (t, isUrdu) => [
  { id: 'overview', label: t('tabOverview'), icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'orders', label: isUrdu ? 'آرڈرز' : 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'restaurants', label: t('restaurants'), icon: <Store className="w-4 h-4" /> },
  { id: 'users', label: isUrdu ? 'صارفین' : 'Users', icon: <Users className="w-4 h-4" /> },
  { id: 'reviews', label: t('reviews'), icon: <Star className="w-4 h-4" /> }
]

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-slate-400 text-xs font-bold">{label}</div>
    {sub && <div className="text-slate-500 text-[10px]">{sub}</div>}
  </div>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const { t, isUrdu } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [restaurants, setRestaurants] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersCount, setOrdersCount] = useState(0)
  const [bookingsCount, setBookingsCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState('')
  const [actionLoading, setActionLoading] = useState('')
  const [notification, setNotification] = useState('')

  const prevAdminOrdersCountRef = useRef(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadData()

    let unsubOrders = () => {}
    let unsubBookings = () => {}

    const setupRealtimeListeners = async () => {
      try {
        const { onSnapshot, collection } = await import('firebase/firestore')
        const { db } = await import('../firebase/config')

        unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
          const fetchedOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          fetchedOrders.sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : a.createdAt ? new Date(a.createdAt).getTime() : Date.now()
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : b.createdAt ? new Date(b.createdAt).getTime() : Date.now()
            return timeB - timeA
          })

          // Visual notification for Admin on new order (Silent)
          if (prevAdminOrdersCountRef.current !== null && snapshot.size > prevAdminOrdersCountRef.current) {
            const latest = fetchedOrders[0]
            if (latest) {
              showNotif(`🛍️ Naya Order Received: ${latest.userName || 'Customer'} ordered from ${latest.restaurantName || 'Restaurant'} (${latest.totalAmount || ''})`)
            }
          }
          prevAdminOrdersCountRef.current = snapshot.size

          setOrders(fetchedOrders)
          setOrdersCount(snapshot.size)
        })

        unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
          setBookingsCount(snapshot.size)
        })
      } catch (err) {
        console.error('Error setting up admin real-time listener:', err)
      }
    }

    setupRealtimeListeners()

    return () => {
      unsubOrders()
      unsubBookings()
    }
  }, [isAdmin])

  const loadData = async () => {
    setLoading(true)
    const [rRes, uRes] = await Promise.all([getAllRestaurants(), getAllUsers()])
    if (rRes.success) setRestaurants(rRes.restaurants)
    if (uRes.success) setUsers(uRes.users)

    try {
      const { getDocs, collection } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')
      const [ordersSnap, bookingsSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'bookings'))
      ])
      const fetchedOrders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : a.createdAt ? new Date(a.createdAt).getTime() : Date.now()
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : b.createdAt ? new Date(b.createdAt).getTime() : Date.now()
        return timeB - timeA
      })
      setOrders(fetchedOrders)
      setOrdersCount(ordersSnap.size)
      setBookingsCount(bookingsSnap.size)
    } catch (e) {
      console.error('Error loading admin orders:', e)
    }

    setLoading(false)
  }

  const showNotif = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleToggleRestaurant = async (id, current) => {
    setActionLoading(id)
    const res = await updateRestaurantStatus(id, !current)
    if (res.success) {
      setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !current } : r)))
      showNotif(`Restaurant ${!current ? 'activated' : 'deactivated'}`)
    }
    setActionLoading('')
  }

  const handleDeleteRestaurant = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setActionLoading(id)
    const res = await deleteRestaurantAdmin(id)
    if (res.success) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id))
      showNotif('Restaurant deleted')
    }
    setActionLoading('')
  }

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(searchQ.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQ.toLowerCase())
  )

  const stats = {
    total: restaurants.length,
    active: restaurants.filter((r) => r.isActive !== false).length,
    totalUsers: users.length,
    owners: users.filter((u) => u.role === 'owner').length,
    customers: users.filter((u) => u.role !== 'owner' && u.role !== 'admin').length,
    avgRating: restaurants.length
      ? (restaurants.reduce((a, r) => a + (Number(r.rating) || 0), 0) / restaurants.length).toFixed(1)
      : 0,
    totalReviews: restaurants.reduce((a, r) => a + (r.totalReviews || r.reviews || 0), 0)
  }

  if (!isAdmin) return null

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
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-sm truncate">Admin Panel</p>
              <p className="text-slate-400 text-xs truncate mt-0.5">Peshawar Foods & Shinwari Explorer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getAdminTabs(t, isUrdu).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
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
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Eye className="w-4 h-4 text-purple-400" />
            {isUrdu ? 'پلیٹ فارم دیکھیں' : 'View Platform'}
          </a>
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
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-white capitalize">{activeTab}</h1>
            <p className="text-slate-400 text-xs mt-0.5">System Overview & Management</p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-6 mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="ov" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Store className="w-5 h-5 text-amber-500" />} label="Restaurants" value={stats.total} sub={`${stats.active} active`} color="bg-amber-500/10" />
                    <StatCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Users" value={stats.totalUsers} sub={`${stats.owners} owners`} color="bg-blue-500/10" />
                    <StatCard icon={<ShoppingBag className="w-5 h-5 text-emerald-400" />} label="Orders Placed" value={ordersCount} sub="Platform total" color="bg-emerald-500/10" />
                    <StatCard icon={<Calendar className="w-5 h-5 text-purple-400" />} label="Bookings Made" value={bookingsCount} sub="Platform total" color="bg-purple-500/10" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h2 className="font-bold text-white text-sm">Recent Platform Listings</h2>
                      <div className="space-y-2 text-xs">
                        {restaurants.slice(0, 5).map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                            <div>
                              <p className="font-bold text-white">{r.name}</p>
                              <p className="text-slate-400">{r.cuisine} • {r.location || r.address}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold ${r.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {r.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-white text-sm">Recent Customer Orders</h2>
                        <button onClick={() => setActiveTab('orders')} className="text-xs text-purple-400 hover:underline">View All ({orders.length})</button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {orders.length === 0 ? (
                          <p className="text-slate-500 py-4 text-center">No orders placed yet</p>
                        ) : (
                          orders.slice(0, 5).map((o) => (
                            <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                              <div>
                                <p className="font-bold text-white">{o.userName || o.customerName || 'Customer'} • <span className="text-amber-400">{o.restaurantName || o.restaurantId}</span></p>
                                <p className="text-slate-400 text-[11px]">{o.totalAmount || `Rs. ${o.total}`}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 capitalize">
                                {o.status || 'pending'}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="ord" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">All Platform Orders ({orders.length})</h2>
                    <span className="text-xs text-slate-400">Live order records from Firebase</span>
                  </div>

                  <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No orders recorded yet. When customers place online orders, they will appear here live!
                      </div>
                    ) : (
                      <table className="w-full text-xs text-left">
                        <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900">
                          <tr>
                            <th className="p-3.5">Customer</th>
                            <th className="p-3.5">Restaurant</th>
                            <th className="p-3.5">Items</th>
                            <th className="p-3.5">Total Amount</th>
                            <th className="p-3.5">Delivery Info</th>
                            <th className="p-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => {
                            const statusColor =
                              o.status === 'completed' || o.status === 'delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : o.status === 'preparing'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : o.status === 'cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'

                            return (
                              <tr key={o.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                                <td className="p-3.5">
                                  <p className="font-bold text-white">{o.userName || o.customerName || 'Customer'}</p>
                                  <p className="text-[11px] text-slate-400">{o.userEmail || o.customerEmail || '-'}</p>
                                </td>
                                <td className="p-3.5 font-bold text-amber-400">{o.restaurantName || o.restaurantId}</td>
                                <td className="p-3.5 text-slate-300 max-w-[200px] truncate">
                                  {Array.isArray(o.items)
                                    ? o.items.map((i) => `${i.name || i.title} (x${i.qty || i.quantity || 1})`).join(', ')
                                    : 'Food items'}
                                </td>
                                <td className="p-3.5 font-black text-white">{o.totalAmount || `Rs. ${o.total || 0}`}</td>
                                <td className="p-3.5 text-slate-300 max-w-[200px]">
                                  <p className="truncate font-semibold">{o.deliveryAddress || '-'}</p>
                                  <p className="text-[11px] text-slate-400">{o.phone || o.customerPhone || '-'}</p>
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize ${statusColor}`}>
                                    {o.status || 'pending'}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'restaurants' && (
                <motion.div key="rest" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative flex items-center">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900">
                        <tr>
                          <th className="p-3.5">Restaurant</th>
                          <th className="p-3.5">Cuisine</th>
                          <th className="p-3.5">Rating</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRestaurants.map((r) => (
                          <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                            <td className="p-3.5 font-bold text-white">{r.name}</td>
                            <td className="p-3.5 text-slate-300">{r.cuisine}</td>
                            <td className="p-3.5 text-amber-400 font-bold">★ {r.rating || 4.5}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${r.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {r.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleRestaurant(r.id, r.isActive !== false)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                                >
                                  {r.isActive !== false ? <XCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteRestaurant(r.id, r.name)}
                                  className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div key="usr" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900">
                        <tr>
                          <th className="p-3.5">User</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id || i} className="border-b border-slate-800/50">
                            <td className="p-3.5 font-bold text-white">{u.name || 'Unknown'}</td>
                            <td className="p-3.5 text-slate-300">{u.email}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : u.role === 'owner' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {u.role || 'customer'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="rev" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                    <BarChart3 className="w-12 h-12 text-purple-400 mx-auto" />
                    <h3 className="text-white font-bold text-base">Reviews System Health</h3>
                    <p className="text-slate-400 text-xs">Total reviews aggregated across Peshawar restaurants: {stats.totalReviews}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
