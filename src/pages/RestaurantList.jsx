import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, MapPin, Star, Clock, X, Grid3X3, List,
  SlidersHorizontal, Utensils, Heart, ChevronDown, MessageCircle
} from 'lucide-react'
import { getAllRestaurants } from '../firebase/services'
import { useFavorites } from '../contexts/FavoritesContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE } from '../utils/imageHelper'

const CUISINES_EN = ['All', 'Pakistani', 'Afghan', 'Chinese', 'Fast Food', 'BBQ', 'Traditional', 'Desserts']
const CUISINES_UR = ['سب', 'پاکستانی', 'افغانی', 'چائنیز', 'فاسٹ فوڈ', 'باربی کیو', 'روایتی', 'میٹھائی']
const AREAS_EN = ['All', 'Namak Mandi', 'University Road', 'Saddar', 'Hayatabad', 'Karkhano', 'Khyber Road']
const AREAS_UR = ['سب', 'نمک منڈی', 'یونیورسٹی روڈ', 'صدر', 'حیات آباد', 'کارخانو', 'خیبر روڈ']
const PRICE_RANGES = ['All', '$', '$$', '$$$']
const SORT_OPTIONS_EN = [{ value: 'rating', label: 'Top Rated' }, { value: 'reviews', label: 'Most Reviewed' }, { value: 'name', label: 'Name A-Z' }]
const SORT_OPTIONS_UR = [{ value: 'rating', label: 'بہترین ریٹنگ' }, { value: 'reviews', label: 'سب سے زیادہ ریویوز' }, { value: 'name', label: 'نام A-Z' }]

const RestaurantCard = ({ restaurant, index, view }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isUrdu } = useLanguage()
  const isFav = isFavorite(restaurant.id)

  const openWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const num = restaurant.whatsapp || restaurant.phone?.replace(/[^0-9]/g, '')
    if (num) {
      window.open(`https://wa.me/${num}?text=Hi! I found ${restaurant.name} on Peshawar Foods & Shinwari Explorer. I'd like to know more!`, '_blank')
    }
  }

  if (view === 'list') {
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/30 p-4 flex gap-5 group transition-all">
          <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-800">
            <img
              src={restaurant.image || DEFAULT_RESTAURANT_IMAGE}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.src = DEFAULT_RESTAURANT_IMAGE }}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <Link to={`/restaurant/${restaurant.id}`}>
                  <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{restaurant.name}</h3>
                </Link>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0">{restaurant.priceRange || '$$'}</span>
              </div>
              <p className="text-amber-400 text-xs font-medium mt-0.5">{restaurant.specialDish}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /><span className="truncate max-w-[140px]">{restaurant.location || restaurant.address}</span></span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{restaurant.rating || 4.5}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">{restaurant.cuisine}</span>
              <div className="flex items-center gap-2">
                <button onClick={openWhatsApp}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all">
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </button>
                <Link to={`/restaurant/${restaurant.id}`} className="text-xs font-bold text-amber-400 hover:text-amber-300">Details →</Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/30 overflow-hidden group cursor-pointer h-full flex flex-col transition-all">
        <div className="relative h-48 overflow-hidden bg-slate-800">
            <img 
              src={getValidImageUrl(restaurant, DEFAULT_RESTAURANT_IMAGE)} 
              alt={restaurant.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
            />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${restaurant.isOpen !== false ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
              {restaurant.isOpen !== false ? (isUrdu ? '● کُھلا ہے' : '● Open') : (isUrdu ? '● بند ہے' : '● Closed')}
            </span>
          </div>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(restaurant.id) }}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${isFav ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-slate-950/60 border-slate-700 text-white'}`}>
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">{restaurant.priceRange || '$$'}</span>
            <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md border border-slate-700 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{restaurant.rating || 4.5}</span>
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/restaurant/${restaurant.id}`}>
              <h3 className="font-bold text-white text-lg mb-1 group-hover:text-amber-400 transition-colors truncate">{restaurant.name}</h3>
            </Link>
            <p className="text-amber-400 text-xs font-bold mb-3 truncate">{restaurant.specialDish}</p>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
              <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate">{restaurant.location || restaurant.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-white text-xs">{restaurant.rating || 4.5}</span>
              <span className="text-slate-500 text-[10px]">({restaurant.reviews || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openWhatsApp}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <Link to={`/restaurant/${restaurant.id}`} className="text-xs font-bold text-amber-400 hover:text-amber-300">Details →</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, isUrdu } = useLanguage()
  const { isFavorite } = useFavorites()
  const [allRestaurants, setAllRestaurants] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || 'All')
  const [area, setArea] = useState('All')
  const [price, setPrice] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [openOnly, setOpenOnly] = useState(false)

  const favoritesOnly = searchParams.get('favorites') === 'true'

  useEffect(() => {
    getAllRestaurants().then((res) => {
      if (res.success) setAllRestaurants(res.restaurants || [])
      setLoading(false)
    })
  }, [])

  const applyFilters = useCallback(() => {
    let result = [...allRestaurants]
    if (favoritesOnly) {
      result = result.filter(r => isFavorite(r.id))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.specialDish?.toLowerCase().includes(q)
      )
    }
    if (cuisine !== 'All') result = result.filter(r => r.cuisine === cuisine)
    if (area !== 'All') result = result.filter(r => r.location?.toLowerCase().includes(area.toLowerCase()) || r.address?.toLowerCase().includes(area.toLowerCase()))
    if (price !== 'All') result = result.filter(r => r.priceRange === price)
    if (openOnly) result = result.filter(r => r.isOpen !== false)
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0)
      if (sortBy === 'name') return a.name?.localeCompare(b.name)
      return 0
    })
    setFiltered(result)
  }, [allRestaurants, search, cuisine, area, price, openOnly, sortBy, favoritesOnly, isFavorite])

  useEffect(() => { applyFilters() }, [applyFilters])

  const clearFilters = () => {
    setSearch(''); setCuisine('All'); setArea('All')
    setPrice('All'); setOpenOnly(false); setSortBy('rating')
    setSearchParams({})
  }

  const hasActive = search || cuisine !== 'All' || area !== 'All' || price !== 'All' || openOnly || favoritesOnly

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{isUrdu ? 'پشاور ڈائننگ گائیڈ' : 'Peshawar Dining Guide'}</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Peshawar <span className="text-amber-500">{t('restaurants')}</span></h1>
            <p className="text-slate-400 text-xs mt-1">{loading ? (isUrdu ? 'لوڈنگ...' : 'Loading...') : (isUrdu ? `${filtered.length} ریسٹورنٹ ملے` : `${filtered.length} restaurants found`)}</p>
          </motion.div>

          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder={t('searchPlaceholder')}
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl pl-11 pr-10 py-3 text-sm text-white outline-none" />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${showFilters || hasActive ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
              <SlidersHorizontal className="w-4 h-4" /> {isUrdu ? 'فلٹرز' : 'Filters'} {hasActive && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/90 border-b border-slate-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">{isUrdu ? 'پکوان' : 'Cuisine'}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(isUrdu ? CUISINES_UR : CUISINES_EN).map((c, idx) => (
                      <button key={c} onClick={() => setCuisine(CUISINES_EN[idx])}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${cuisine === CUISINES_EN[idx] ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">{isUrdu ? 'علاقہ' : 'Area'}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(isUrdu ? AREAS_UR : AREAS_EN).map((a, idx) => (
                      <button key={a} onClick={() => setArea(AREAS_EN[idx])}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${area === AREAS_EN[idx] ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">{isUrdu ? 'قیمت' : 'Price Range'}</label>
                    <div className="flex gap-2">
                      {PRICE_RANGES.map(p => (
                        <button key={p} onClick={() => setPrice(p)}
                          className={`px-3.5 py-1 rounded-lg text-xs font-medium transition-all ${price === p ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                          {p === 'All' ? (isUrdu ? 'سب' : 'All') : p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">{isUrdu ? 'ترتیب' : 'Sort By'}</label>
                    <div className="relative">
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none cursor-pointer">
                        {(isUrdu ? SORT_OPTIONS_UR : SORT_OPTIONS_EN).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">Options</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setOpenOnly(!openOnly)}
                        className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${openOnly ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${openOnly ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Open Now Only</span>
                    </label>
                    {hasActive && (
                      <button onClick={clearFilters} className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2 text-xs">
            {search && <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1">"{search}" <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button></span>}
            {cuisine !== 'All' && <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">{cuisine} <button onClick={() => setCuisine('All')}><X className="w-3 h-3" /></button></span>}
            {area !== 'All' && <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full flex items-center gap-1">{area} <button onClick={() => setArea('All')}><X className="w-3 h-3" /></button></span>}
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading Peshawar restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <Utensils className="w-12 h-12 text-slate-600" />
            <h3 className="text-xl font-bold text-white">No Restaurants Found</h3>
            <p className="text-slate-400 text-xs">Try adjusting filters or search</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl mt-2">Clear Filters</button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            {filtered.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} view={view} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantList
