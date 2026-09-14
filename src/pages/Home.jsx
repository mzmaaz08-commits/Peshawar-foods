import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Star, MapPin, Clock, ArrowRight, Utensils, Store, Users, TrendingUp, Zap, Shield, ChefHat, Heart, Calendar } from 'lucide-react'
import { getApprovedRestaurants } from '../firebase/services'
import { useLanguage } from '../contexts/LanguageContext'
import { useFavorites } from '../contexts/FavoritesContext'
import PeshawarMap from '../components/PeshawarMap'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE } from '../utils/imageHelper'
import { translateRestaurant, translateText } from '../utils/translationHelper'

const Home = () => {
  const navigate = useNavigate()
  const { t, isUrdu } = useLanguage()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApprovedRestaurants().then((res) => {
      if (res.success) setRestaurants(res.restaurants || [])
      setLoading(false)
    })
  }, [])

  const graphRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!graphRef.current) return
    const rect = graphRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    graphRef.current.style.setProperty('--mouse-x', `${x}px`)
    graphRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(search.trim() ? `/restaurants?search=${encodeURIComponent(search.trim())}` : '/restaurants')
  }

  const featured = [...restaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6)

  const features = [
    { icon: <MapPin className="w-6 h-6" />, title: 'Discover Local Gems', desc: 'Find the best restaurants across Peshawar', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: <Star className="w-6 h-6" />, title: 'Verified Reviews', desc: 'Authentic ratings from real food lovers', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Instant Table Booking', desc: 'Reserve your dining table online in seconds', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: <Shield className="w-6 h-6" />, title: 'Trusted Platform', desc: 'Verified and quality-assured listings', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: <ChefHat className="w-6 h-6" />, title: 'Curated Menus', desc: 'Detailed dish info and chef specials', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Owner Analytics', desc: 'Powerful dashboard for restaurant owners', color: 'text-rose-400', bg: 'bg-rose-500/10' }
  ]

  const cuisines = [
    { name: 'Pakistani', ur: 'پاکستانی', emoji: '🍖' },
    { name: 'Afghan', ur: 'افغانی', emoji: '🥘' },
    { name: 'Chinese', ur: 'چینی', emoji: '🍜' },
    { name: 'Fast Food', ur: 'فاسٹ فوڈ', emoji: '🍔' },
    { name: 'BBQ', ur: 'باربی کیو', emoji: '🔥' },
    { name: 'Desserts', ur: 'میٹھے پکوان', emoji: '🍰' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO SECTION */}
      <section
        ref={graphRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-20"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] bg-gradient-to-br from-amber-500/20 to-orange-600/10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] bg-gradient-to-br from-amber-600/15 to-purple-600/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 pb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 text-amber-400 text-xs sm:text-sm font-black mb-8 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              🔥 {isUrdu ? 'پشاور کا نمبر 1 آن لائن فوڈ پلیٹ فارم' : 'Peshawar’s Premier #1 Food & Dining Explorer'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight font-head"
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto p-2.5 rounded-2xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-2xl mb-8 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/25 active:scale-95"
              >
                {isUrdu ? 'تلاش کریں' : 'Search'}
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/restaurants"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm"
              >
                <Utensils className="w-5 h-5" />
                {t('exploreAll')}
              </Link>
              <Link
                to="/register-restaurant"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Store className="w-5 h-5 text-amber-500" />
                {t('registerRestaurant')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 border-y border-slate-800 bg-slate-900/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '150+', label: isUrdu ? 'پشاور ریسٹورنٹس' : 'Peshawar Restaurants', color: 'text-amber-400', icon: <Store className="w-6 h-6" />, bg: 'bg-amber-500/10 border-amber-500/20' },
              { value: '5000+', label: isUrdu ? 'خوش کسٹمرز' : 'Happy Food Lovers', color: 'text-blue-400', icon: <Users className="w-6 h-6" />, bg: 'bg-blue-500/10 border-blue-500/20' },
              { value: '10K+', label: isUrdu ? 'ریویوز اور ریٹنگز' : 'Reviews & Ratings', color: 'text-yellow-400', icon: <Star className="w-6 h-6" />, bg: 'bg-yellow-500/10 border-yellow-500/20' },
              { value: '12', label: isUrdu ? 'احاطہ شدہ علاقے' : 'Areas Covered', color: 'text-emerald-400', icon: <MapPin className="w-6 h-6" />, bg: 'bg-emerald-500/10 border-emerald-500/20' }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-2xl border ${s.bg} backdrop-blur-sm`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-slate-900 mb-3 ${s.color}`}>{s.icon}</div>
                <div className={`text-3xl sm:text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-slate-400 text-xs font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUISINES SECTION */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
              {isUrdu ? 'پشاور کی خاص ڈشز' : 'Peshawar Specialties'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t('categoriesTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {cuisines.map((c, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/restaurants?cuisine=${c.name}`)}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-500/40 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</span>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{isUrdu ? c.ur : c.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
                {t('featuredSubtitle')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white">{t('featuredTitle')}</h2>
            </div>
            <Link
              to="/restaurants"
              className="hidden md:flex items-center gap-2 text-amber-400 font-bold text-sm hover:gap-3 transition-all"
            >
              {t('exploreAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((rawR, i) => {
                const r = translateRestaurant(rawR, isUrdu)
                const isFav = isFavorite(r.id)
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/30 overflow-hidden group cursor-pointer h-full flex flex-col justify-between transition-all">
                      <div className="relative h-52 overflow-hidden bg-slate-800">
                        <img
                          src={getValidImageUrl(r, DEFAULT_RESTAURANT_IMAGE)}
                          alt={r.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${r.isOpen !== false ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                            {r.isOpen !== false ? t('openStatus') : t('closedStatus')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(r.id)
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
                            isFav ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-slate-950/60 border-slate-700 text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`/restaurant/${r.id}`}>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors truncate">
                              {r.name}
                            </h3>
                          </Link>
                          <p className="text-amber-400 text-xs font-bold mb-3 truncate">{r.specialDish}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{r.location || r.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-white text-xs">{r.rating || 4.5}</span>
                          </div>
                          <Link
                            to={`/restaurant/${r.id}`}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                          >
                            {t('viewDetails')} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* MAP PREVIEW SECTION */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
              {t('interactiveMap')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t('mapTitle')}</h2>
          </div>
          <PeshawarMap restaurants={restaurants} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-amber-500/30 flex items-center justify-center bg-amber-500/10">
                <Utensils className="w-4 h-4 text-amber-500" />
              </div>
              <span className="font-bold text-white">
                Peshawar Foods <span className="text-amber-500">& Shinwari Explorer</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              {t('footerRights')}
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <Link to="/restaurants" className="hover:text-white transition-colors">
                {t('restaurants')}
              </Link>
              <Link to="/register-restaurant" className="hover:text-white transition-colors">
                {t('registerRestaurant')}
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
