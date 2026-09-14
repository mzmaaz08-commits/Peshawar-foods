import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { createOrder } from '../firebase/services'
import { useNavigate } from 'react-router-dom'
import { getValidImageUrl, handleImageError, DEFAULT_DISH_IMAGE } from '../utils/imageHelper'
import { translateRestaurant, translateDish, translateText } from '../utils/translationHelper'

const OrderModal = ({ restaurant: rawRes, dishes: rawDishes, onClose }) => {
  const { user, isAuthenticated } = useAuth()
  const { t, isUrdu } = useLanguage()
  const navigate = useNavigate()

  const restaurant = translateRestaurant(rawRes, isUrdu)
  const dishes = (rawDishes || []).map(d => translateDish(d, isUrdu))

  const [cart, setCart] = useState({})
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [step, setStep] = useState(1) // 1=select dishes, 2=details, 3=success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Prevent background scrolling when Order Modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const addItem = (dish) => {
    setCart(prev => ({ ...prev, [dish.id]: { ...dish, qty: (prev[dish.id]?.qty || 0) + 1 } }))
  }

  const removeItem = (dishId) => {
    setCart(prev => {
      const updated = { ...prev }
      if (updated[dishId]?.qty > 1) {
        updated[dishId] = { ...updated[dishId], qty: updated[dishId].qty - 1 }
      } else {
        delete updated[dishId]
      }
      return updated
    })
  }

  const cartItems = Object.values(cart).filter(item => item.qty > 0)
  const totalAmount = cartItems.reduce((sum, item) => {
    const priceStr = item.price?.toString() || '0'
    const cleaned = priceStr.replace(/[^0-9]/g, '')
    const price = parseInt(cleaned, 10) || 0
    return sum + price * item.qty
  }, 0)

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!address.trim()) { setError(isUrdu ? 'براہ کرم ڈیلیوری کا پتہ درج کریں' : 'Please enter delivery address'); return }
    if (!phone.trim()) { setError(isUrdu ? 'براہ کرم فون نمبر درج کریں' : 'Please enter phone number'); return }

    setLoading(true)
    setError('')

    const orderData = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: user.uid,
      userName: user.displayName || 'Customer',
      userEmail: user.email,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totalAmount: `Rs. ${totalAmount.toLocaleString()}`,
      deliveryAddress: address,
      phone,
      note,
      status: 'pending',
    }

    const result = await createOrder(orderData)
    if (result.success) {
      setStep(3)
    } else {
      setError(result.error || (isUrdu ? 'آرڈر دینے میں ناکامی ہوئی۔ دوبارہ کوشش کریں۔' : 'Failed to place order. Please try again.'))
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white">
              {step === 1 ? (isUrdu ? 'ڈشز منتخب کریں' : 'Select Dishes') : step === 2 ? (isUrdu ? 'آرڈر کی تفصیلات' : 'Order Details') : t('orderSuccess')}
            </h2>
            <p className="text-amber-400 text-xs font-bold mt-0.5">{restaurant.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* Step 1 — Select Dishes */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-3">
                {dishes.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>{isUrdu ? 'آرڈر کے لیے ڈشز دستیاب نہیں ہیں' : 'No dishes available to order'}</p>
                  </div>
                ) : (
                  dishes.filter(d => d.available !== false).map((dish, i) => (
                    <div key={dish.id || i} className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                          <img
                            src={getValidImageUrl(dish, DEFAULT_DISH_IMAGE)}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, DEFAULT_DISH_IMAGE)}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{dish.name}</p>
                          <p className="text-amber-400 text-xs font-bold">{dish.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {cart[dish.id]?.qty > 0 ? (
                          <>
                            <button onClick={() => removeItem(dish.id)}
                              className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-all">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white font-bold text-sm w-5 text-center">{cart[dish.id].qty}</span>
                          </>
                        ) : null}
                        <button onClick={() => addItem(dish)}
                          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-4">
                {/* Order Summary */}
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold text-sm mb-3">{isUrdu ? 'آرڈر کی تفصیل (سمری)' : 'Order Summary'}</h3>
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>{item.qty}x {item.name}</span>
                      <span className="text-amber-400 font-bold">{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-700 mt-3 pt-3 flex justify-between">
                    <span className="text-white font-black text-sm">Total</span>
                    <span className="text-amber-400 font-black text-sm">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Delivery Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. House 12, Street 5, Hayatabad, Peshawar"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Special Instructions (optional)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="e.g. Extra spicy, no onions..."
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" />
                </div>
              </motion.div>
            )}

            {/* Step 3 — Success */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Order Placed!</h3>
                <p className="text-slate-400 text-sm mb-2">Your order has been sent to <span className="text-amber-400 font-bold">{restaurant.name}</span></p>
                <p className="text-slate-500 text-xs mb-6">You'll receive a confirmation soon. Check your order history for updates.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/my-orders')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all">
                    View My Orders
                  </button>
                  <button onClick={onClose}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                    Close
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="p-6 border-t border-slate-800">
            {step === 1 ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-slate-400 text-xs">{cartItems.length} items</p>
                  <p className="text-amber-400 font-black">Rs. {totalAmount.toLocaleString()}</p>
                </div>
                <button onClick={() => { if (cartItems.length > 0) setStep(2) }}
                  disabled={cartItems.length === 0}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Proceed to Order
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Placing Order...</>
                    : <><CheckCircle className="w-4 h-4" /> Place Order</>
                  }
                </button>
              </div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  )
}

export default OrderModal
