import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Star, ShoppingBag, Sparkles } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const getTickerItems = (isUrdu) => [
  {
    icon: <Flame className="w-4 h-4 text-amber-400" />,
    text: isUrdu ? 'حیات آباد میں کسی نے چارسی شنواری کڑاہی کا آرڈر دیا!' : 'Someone in Hayatabad just ordered Charsi Shinwari Karahi!',
    time: isUrdu ? '2 منٹ پہلے' : '2m ago'
  },
  {
    icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />,
    text: isUrdu ? 'خیبر پاس ریسٹورنٹ کو 5 اسٹار ریویو ملا! ⭐⭐⭐⭐⭐' : 'Khyber Pass Restaurant received a 5-Star Review! ⭐⭐⭐⭐⭐',
    time: isUrdu ? '5 منٹ پہلے' : '5m ago'
  },
  {
    icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
    text: isUrdu ? 'آرڈر #PF-8921 صدر کینٹ کی ڈیلیوری کے لیے کنفرم ہوا!' : 'Order #PF-8921 confirmed for Saddar Cantt delivery!',
    time: isUrdu ? '8 منٹ پہلے' : '8m ago'
  },
  {
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    text: isUrdu ? 'نمک منڈی تکہ ہاؤس نے نئے باربی کیو ٹیبل سلاٹس کھولے!' : 'Namak Mandi Tikka House opened fresh BBQ table slots!',
    time: isUrdu ? '12 منٹ پہلے' : '12m ago'
  }
]

export default function LiveActivityTicker() {
  const { isUrdu } = useLanguage()
  const [index, setIndex] = useState(0)
  const items = getTickerItems(isUrdu)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [items.length])

  const current = items[index] || items[0]

  return (
    <div className={`fixed bottom-6 ${isUrdu ? 'right-6' : 'left-6'} z-30 hidden lg:block pointer-events-none`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${isUrdu ? 'ur' : 'en'}-${index}`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-slate-100 max-w-sm"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex-shrink-0">
            {current.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{current.text}</p>
            <span className="text-[10px] text-amber-400 font-semibold">{current.time} • {isUrdu ? 'لائیو سرگرمی' : 'Live Activity'}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
