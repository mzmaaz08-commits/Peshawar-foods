import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Clock, CheckCircle, XCircle, MapPin, Phone, ChefHat, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getOrdersByCustomer } from '../firebase/services'

const MyOrders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isUrdu } = useLanguage()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { navigate('/login'); return }
    if (user) {
      getOrdersByCustomer(user.uid).then(res => {
        if (res.success) setOrders(res.orders || [])
        setLoading(false)
      })
    }
  }, [user, isAuthenticated, authLoading])

  const formatDate = (timestamp) => {
    if (!timestamp) return isUrdu ? 'ابھی' : 'Recently'
    if (timestamp?.toDate) return timestamp.toDate().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
    return new Date(timestamp).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const STATUS_STYLES = {
    pending:   { label: isUrdu ? 'زیرِ التواء' : 'Pending',   color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/30',  icon: <Clock className="w-3.5 h-3.5" /> },
    confirmed: { label: isUrdu ? 'منظور' : 'Confirmed',       color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30',      icon: <CheckCircle className="w-3.5 h-3.5" /> },
    preparing: { label: isUrdu ? 'تَیاری جاری' : 'Preparing', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30',    icon: <ChefHat className="w-3.5 h-3.5" /> },
    ready:     { label: isUrdu ? 'تَیار' : 'Ready',           color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    delivered: { label: isUrdu ? 'ڈیلیور' : 'Delivered',      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    cancelled: { label: isUrdu ? 'منسوخ' : 'Cancelled',       color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/30',        icon: <XCircle className="w-3.5 h-3.5" /> },
  }

  const PROGRESS_LABELS = isUrdu
    ? ['موصول', 'تصدیق', 'تَیاری', 'تَیار', 'ڈیلیور']
    : ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Delivered']

  return (
    <div className="min-h-screen bg-slate-950 pt-20" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            {isUrdu ? 'آرڈر ہسٹری' : 'Order History'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isUrdu ? 'میرے آرڈرز' : 'My Orders'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isUrdu ? 'پشاور کے ریسٹورنٹس سے اپنے تمام آرڈرز ٹریک کریں' : 'Track all your orders from Peshawar restaurants'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">
              {isUrdu ? 'آرڈرز لوڈ ہو رہے ہیں...' : 'Loading your orders...'}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 bg-slate-900 rounded-3xl border border-slate-800">
            <ShoppingBag className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2">
              {isUrdu ? 'ابھی کوئی آرڈر نہیں' : 'No Orders Yet'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {isUrdu ? 'آپ نے ابھی تک کوئی آرڈر نہیں دیا ہے۔' : "You haven't placed any orders yet."}
            </p>
            <Link to="/restaurants"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all">
              {isUrdu ? 'ریسٹورنٹس دیکھیں' : 'Browse Restaurants'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending
              const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
              const currentIdx = statuses.indexOf(order.status)
              return (
                <motion.div key={order.id || i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

                  <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <div>
                      <h3 className="font-black text-white">{order.restaurantName}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="space-y-2 mb-4">
                      {(order.items || []).map((item, j) => (
                        <div key={j} className="flex justify-between text-sm">
                          <span className="text-slate-300">{item.qty}x {item.name}</span>
                          <span className="text-amber-400 font-bold">{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                        {isUrdu ? 'کل رقم' : 'Total'}
                      </span>
                      <span className="text-amber-400 font-black">{order.totalAmount}</span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {order.deliveryAddress && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                      {order.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <div className="px-5 pb-4">
                      <div className="flex items-center gap-1">
                        {statuses.map((s, idx) => (
                          <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${idx <= currentIdx ? 'bg-amber-500' : 'bg-slate-700'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        {PROGRESS_LABELS.map((label, idx) => (
                          <span key={idx}>{label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
