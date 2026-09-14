import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle, MapPin, Phone, CreditCard } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { createOrder } from '../firebase/services'
import confetti from 'canvas-confetti'

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getItemPrice
  } = useCart()

  const { t, isUrdu } = useLanguage()
  const { user } = useAuth()

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderPlacedRef, setOrderPlacedRef] = useState(null)

  // Prevent background scrolling when Cart Drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  const deliveryFee = cartItems.length > 0 ? 150 : 0
  const subtotal = getSubtotal()
  const total = subtotal + deliveryFee

  const formatPrice = (price) => `Rs. ${price}`

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!address.trim() || !phone.trim()) {
      alert(isUrdu ? 'براہ کرم اپنا پتہ اور فون نمبر درج کریں۔' : 'Please provide delivery address and contact phone number.')
      return
    }

    setIsPlacing(true)

    const orderRef = 'PESH-' + Math.floor(100000 + Math.random() * 900000)
    const newOrder = {
      id: orderRef,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: getItemPrice(item.price),
        quantity: item.quantity
      })),
      restaurantId: cartItems[0]?.restaurantId || 'general',
      restaurantName: cartItems[0]?.restaurantName || 'Peshawar Restaurant',
      userId: user?.uid || 'guest',
      customerName: user?.displayName || 'Customer',
      customerEmail: user?.email || '',
      phone,
      customerPhone: phone,
      deliveryAddress: address,
      address,
      paymentMethod,
      subtotal,
      deliveryFee,
      totalAmount: `Rs. ${total}`,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // Save to Firestore
    try {
      await createOrder(newOrder)
    } catch (e) {
      console.error('Error saving order to Firestore', e)
    }

    // Save to localStorage as fallback
    try {
      const existingOrders = JSON.parse(localStorage.getItem('peshawar_orders') || '[]')
      localStorage.setItem('peshawar_orders', JSON.stringify([newOrder, ...existingOrders]))
    } catch (e) {
      console.error('Error saving order', e)
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (err) {}

    setTimeout(() => {
      setIsPlacing(false)
      setOrderPlacedRef(orderRef)
      clearCart()
    }, 1200)
  }

  const handleClose = () => {
    setIsCartOpen(false)
    setOrderPlacedRef(null)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isUrdu ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isUrdu ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 ${
              isUrdu ? 'left-0' : 'right-0'
            } w-full max-w-md bg-slate-900 border-l border-amber-500/20 shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="p-5 bg-slate-800/80 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('yourCart')}</h3>
                  {cartItems.length > 0 && (
                    <p className="text-xs text-slate-400">
                      {cartItems[0].restaurantName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {orderPlacedRef ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{t('orderSuccess')}</h4>
                  <p className="text-sm text-slate-400">
                    {t('orderRef')}: <span className="text-amber-400 font-mono font-bold">{orderPlacedRef}</span>
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {isUrdu
                      ? 'آپ کا آرڈر ریسٹورنٹ کو بھیج دیا گیا ہے۔ آپ ڈیش بورڈ سے اس کا لائیو سٹیٹس دیکھ سکتے ہیں۔'
                      : 'Your food order has been submitted to the restaurant. You can track status in dashboard.'}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors"
                  >
                    {t('close')}
                  </button>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm">{t('cartEmpty')}</p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                          <p className="text-xs text-amber-400 font-medium">
                            Rs. {getItemPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:text-amber-400 text-slate-400 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:text-amber-400 text-slate-400 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} className="pt-4 border-t border-slate-800 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {t('deliveryAddress')}
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={isUrdu ? 'مثال: مکان نمبر 12، سٹریٹ 4، حیات آباد، پشاور' : 'House 12, Street 4, Phase 3, Hayatabad'}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        {t('contactNumber')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                        {t('paymentMethod')}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-center ${
                            paymentMethod === 'cod'
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {t('cashOnDelivery')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-center ${
                            paymentMethod === 'card'
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {t('onlineCard')}
                        </button>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>{t('subtotal')}</span>
                        <span>Rs. {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{t('deliveryFee')}</span>
                        <span>Rs. {deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-700">
                        <span>{t('total')}</span>
                        <span className="text-amber-400">Rs. {total}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPlacing}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      {isPlacing ? (
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {t('placeOrder')} (Rs. {total})
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
