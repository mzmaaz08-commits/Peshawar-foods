import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Users, Sparkles, CheckCircle, Phone, User } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { createBooking } from '../firebase/services'
import confetti from 'canvas-confetti'

const getTimeSlots = (isUrdu) => [
  isUrdu ? '12:30 دوپہر - لنچ' : '12:30 PM - Lunch',
  isUrdu ? '01:30 دوپہر - لنچ' : '01:30 PM - Lunch',
  isUrdu ? '02:30 دوپہر - لنچ' : '02:30 PM - Lunch',
  isUrdu ? '07:30 شام - ڈنر' : '07:30 PM - Dinner',
  isUrdu ? '08:30 شام - ڈنر' : '08:30 PM - Dinner',
  isUrdu ? '09:30 رات - لیٹ ڈنر' : '09:30 PM - Late Dinner',
  isUrdu ? '10:30 رات - لیٹ ڈنر' : '10:30 PM - Late Dinner'
]

const BookingModal = ({ isOpen, onClose, restaurant }) => {
  const { t, isUrdu } = useLanguage()
  const { user } = useAuth()
  const timeSlots = getTimeSlots(isUrdu)

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(timeSlots[3])
  const [guests, setGuests] = useState(4)
  const [specialRequest, setSpecialRequest] = useState('')
  const [customerName, setCustomerName] = useState(user?.displayName || '')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState(null)

  if (!restaurant) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(isUrdu ? 'براہ کرم اپنا نام اور فون نمبر درج کریں۔' : 'Please provide your name and phone number.')
      return
    }

    setIsSubmitting(true)

    const ref = 'RES-' + Math.floor(100000 + Math.random() * 900000)
    const newBooking = {
      id: ref,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: user?.uid || 'guest',
      date,
      time,
      guests,
      specialRequest,
      customerName,
      customerPhone,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // Save to Firestore
    try {
      await createBooking(newBooking)
    } catch (e) {
      console.error('Error saving booking to Firestore', e)
    }

    // Save to localStorage as fallback
    try {
      const existingBookings = JSON.parse(localStorage.getItem('peshawar_bookings') || '[]')
      localStorage.setItem('peshawar_bookings', JSON.stringify([newBooking, ...existingBookings]))
    } catch (e) {
      console.error('Error saving booking to localStorage', e)
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      })
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false)
      setBookingRef(ref)
    }, 1000)
  }

  const handleClose = () => {
    onClose()
    setBookingRef(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-5 bg-slate-800/80 border-b border-amber-500/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  {t('tableBooking')}
                </h3>
                <p className="text-xs text-amber-400 font-medium">{restaurant.name}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form / Content */}
            <div className="p-6">
              {bookingRef ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">{t('bookingSuccess')}</h4>
                  <p className="text-sm text-slate-400">
                    {t('bookingRef')}: <span className="text-amber-400 font-mono font-bold">{bookingRef}</span>
                  </p>
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 max-w-xs mx-auto text-xs text-left space-y-1.5">
                    <p className="text-slate-300"><strong>Date:</strong> {date}</p>
                    <p className="text-slate-300"><strong>Time:</strong> {time}</p>
                    <p className="text-slate-300"><strong>Guests:</strong> {guests} People</p>
                    <p className="text-slate-300"><strong>Name:</strong> {customerName}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors"
                  >
                    {t('close')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {t('selectDate')}
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {t('selectTime')}
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        {t('guestsCount')}
                      </span>
                      <span className="text-amber-400 font-bold">{guests} {isUrdu ? 'افراد' : 'People'}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-500" />
                        {t('customerName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        {t('customerPhone')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {t('specialRequests')}
                    </label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder={isUrdu ? 'مثال: سالگرہ کا کیک / خاموش ٹیبل' : 'Birthday celebration, window seat, etc.'}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {t('confirmBooking')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookingModal
