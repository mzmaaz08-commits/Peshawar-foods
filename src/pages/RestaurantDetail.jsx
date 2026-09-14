import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Star, Clock, Phone, Mail, ArrowLeft,
  Heart, Share2, ChefHat, MessageSquare, Send,
  CheckCircle, XCircle, Utensils, ShoppingBag, MessageCircle
} from 'lucide-react'
import {
  getRestaurantById, getDishesByRestaurant,
  getReviewsByRestaurant, addReview
} from '../firebase/services'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useLanguage } from '../contexts/LanguageContext'
import OrderModal from '../components/OrderModal'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE, DEFAULT_DISH_IMAGE } from '../utils/imageHelper'
import { translateRestaurant, translateDish, translateText } from '../utils/translationHelper'

const StarRating = ({ value, onChange, size = 'md' }) => {
  const [hover, setHover] = useState(0)
  const sz = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange && onChange(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`${sz} transition-transform hover:scale-110`}>
          <Star className={`${sz} transition-colors ${s <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
        </button>
      ))}
    </div>
  )
}

const RestaurantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { t, isUrdu } = useLanguage()

  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('menu')
  const [dishCategory, setDishCategory] = useState('All')
  const [shareMsg, setShareMsg] = useState('')
  const [showOrder, setShowOrder] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [rRes, dRes, revRes] = await Promise.all([
        getRestaurantById(id),
        getDishesByRestaurant(id),
        getReviewsByRestaurant(id),
      ])
      if (rRes.success) setRestaurant(rRes.restaurant)
      if (dRes.success) setDishes(dRes.dishes || [])
      if (revRes.success) setReviews(revRes.reviews || [])
      setLoading(false)
    }
    fetchAll()
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareMsg(isUrdu ? 'لنک کاپی ہو گیا!' : 'Link copied!')
    setTimeout(() => setShareMsg(''), 2000)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (!reviewForm.comment.trim()) return
    setSubmitting(true)
    const result = await addReview({
      restaurantId: id, userId: user.uid,
      userName: user.displayName || 'Anonymous',
      rating: reviewForm.rating, comment: reviewForm.comment,
    })
    if (result.success) {
      setReviews(prev => [{ id: Date.now().toString(), name: user.displayName || 'Anonymous', rating: reviewForm.rating, comment: reviewForm.comment, date: 'Just now' }, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 3000)
    }
    setSubmitting(false)
  }

  const displayRestaurant = translateRestaurant(restaurant, isUrdu)
  const displayDishes = dishes.map(d => translateDish(d, isUrdu))

  const filteredDishes = dishCategory === 'All' ? displayDishes : displayDishes.filter(d => d.category === dishCategory)
  const availableCategories = ['All', ...new Set(displayDishes.map(d => d.category).filter(Boolean))]
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : displayRestaurant?.rating || 0
  const isFav = displayRestaurant ? isFavorite(displayRestaurant.id) : false

  if (loading) return (
    <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">{isUrdu ? 'لوڈنگ...' : 'Loading restaurant...'}</p>
      </div>
    </div>
  )

  if (!restaurant) return (
    <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{isUrdu ? 'ریسٹورنٹ نہیں ملا' : 'Restaurant not found'}</h2>
        <Link to="/restaurants" className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl">{t('restaurants')}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 pt-20">

      {/* Order Modal */}
      <AnimatePresence>
        {showOrder && (
          <OrderModal restaurant={restaurant} dishes={dishes} onClose={() => setShowOrder(false)} />
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }}
          src={getValidImageUrl(restaurant, DEFAULT_RESTAURANT_IMAGE)}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white text-sm hover:bg-white/10 transition-all">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </button>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button onClick={() => toggleFavorite(restaurant.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm border transition-all ${isFav ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-black/40 border-white/10 text-white hover:bg-white/10'}`}>
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <div className="relative">
            <button onClick={handleShare}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            {shareMsg && (
              <div className="absolute top-12 right-0 bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                {shareMsg}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                <span className={`px-2.5 py-1 rounded-full font-bold border ${displayRestaurant.isOpen !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                  {displayRestaurant.isOpen !== false ? (isUrdu ? '● کُھلا ہے' : '● Open Now') : (isUrdu ? '● بند ہے' : '● Closed')}
                </span>
                <span className="px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">{displayRestaurant.priceRange || '$$'}</span>
                <span className="px-2.5 py-1 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">{displayRestaurant.cuisine}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">{displayRestaurant.name}</h1>
              <p className="text-amber-400 font-bold mt-1 text-sm">{displayRestaurant.specialDish} • {displayRestaurant.specialDishPrice}</p>
            </div>
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <div>
                <div className="text-xl font-black text-white">{avgRating}</div>
                <div className="text-white/50 text-xs">{reviews.length} {t('reviews')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order + WhatsApp Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-3">
        <button onClick={() => setShowOrder(true)}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all">
          <ShoppingBag className="w-4 h-4" /> {t('placeOrderNow')}
        </button>
        {(restaurant.whatsapp || restaurant.phone) && (
          <a href={`https://wa.me/${restaurant.whatsapp || restaurant.phone?.replace(/[^0-9]/g, '')}?text=Hi! I found ${restaurant.name} on Peshawar Foods & Shinwari Explorer.`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl transition-all">
            <MessageCircle className="w-4 h-4" /> {t('whatsappContact')}
          </a>
        )}
        <Link to="/my-orders" className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all ml-auto">
          {t('myOrders')}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-6">
              {[
                { id: 'menu', label: 'Menu', icon: <Utensils className="w-4 h-4" /> },
                { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'about', label: 'About', icon: <ChefHat className="w-4 h-4" /> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* MENU */}
              {activeTab === 'menu' && (
                <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {availableCategories.map(c => (
                      <button key={c} onClick={() => setDishCategory(c)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${dishCategory === c ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {filteredDishes.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                      <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No dishes in this category</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {filteredDishes.map((dish, i) => (
                        <motion.div key={dish.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] group transition-all">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 relative">
                            <img
                              src={getValidImageUrl(dish, DEFAULT_DISH_IMAGE)}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => handleImageError(e, DEFAULT_DISH_IMAGE)}
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">{dish.name}</h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {dish.category && <span className="text-[11px] font-semibold text-slate-400">{dish.category}</span>}
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                                      🌶️ {i % 3 === 0 ? 'Authentic Spice' : i % 2 === 0 ? 'Mild Desi Ghee' : 'Medium Flame'}
                                    </span>
                                  </div>
                                </div>
                                {dish.available !== false
                                  ? <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">● Available</span>
                                  : <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 flex-shrink-0">● Sold Out</span>
                                }
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                              <span className="text-amber-400 font-black text-sm">{dish.price}</span>
                              <span className="text-[10px] text-slate-500 font-medium">⏱️ 20-30 Mins</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* REVIEWS */}
              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-center">
                      <div className="text-5xl font-black text-white">{avgRating}</div>
                      <StarRating value={Math.round(Number(avgRating))} />
                      <p className="text-slate-400 text-xs mt-1">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {[5,4,3,2,1].map(star => {
                        const count = reviews.filter(r => Math.round(r.rating) === star).length
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 w-3">{star}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%`, transition: 'width 0.8s ease' }} />
                            </div>
                            <span className="text-xs text-slate-500 w-4">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Write Review */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-amber-400" />{t('addReview')}</h3>
                    {!isAuthenticated ? (
                      <div className="text-center py-4">
                        <p className="text-slate-400 mb-3 text-sm">{isUrdu ? 'ریویو چھوڑنے کے لیے لاگ ان کریں' : 'Sign in to leave a review'}</p>
                        <Link to="/login" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">{t('login')}</Link>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div><label className="text-xs font-bold text-slate-400 block mb-2">{t('yourRating')}</label>
                          <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} size="lg" />
                        </div>
                        <div>
                          <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                            placeholder={t('yourComment')} rows={3}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" required />
                        </div>
                        {reviewSuccess && <p className="text-emerald-400 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{isUrdu ? 'ریویو جمع کر دیا گیا!' : 'Review submitted!'}</p>}
                        <button type="submit" disabled={submitting}
                          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold rounded-xl text-sm transition-all">
                          {submitting ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                          {t('submitReview')}
                        </button>
                      </form>
                    )}
                  </div>

                  {reviews.map((rev, i) => (
                    <motion.div key={rev.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                            {(rev.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{rev.name || 'Anonymous'}</p>
                            <p className="text-slate-500 text-xs">{rev.date || 'Recently'}</p>
                          </div>
                        </div>
                        <StarRating value={rev.rating || 5} />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ABOUT */}
              {activeTab === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white mb-3">{t('aboutRestaurant')} - {displayRestaurant.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{displayRestaurant.description || (isUrdu ? 'تفصیل دستیاب نہیں ہے۔' : 'No description available.')}</p>
                  </div>
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                    {[
                      { icon: <MapPin className="w-4 h-4 text-amber-400" />, label: t('address'), value: displayRestaurant.address || displayRestaurant.location },
                      { icon: <Clock className="w-4 h-4 text-blue-400" />, label: t('openingHours'), value: displayRestaurant.openingHours },
                      { icon: <Phone className="w-4 h-4 text-emerald-400" />, label: t('phone'), value: displayRestaurant.phone },
                      { icon: <Mail className="w-4 h-4 text-purple-400" />, label: isUrdu ? 'ای میل' : 'Email', value: displayRestaurant.email },
                    ].filter(i => i.value).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {item.icon}
                        <div>
                          <span className="text-slate-500 text-xs block">{item.label}</span>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white">{t('quickInfo')}</h3>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${displayRestaurant.isOpen !== false ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                <div className={`w-2 h-2 rounded-full ${displayRestaurant.isOpen !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span className={`font-bold text-sm ${displayRestaurant.isOpen !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {displayRestaurant.isOpen !== false ? (isUrdu ? 'کُھلا ہے' : 'Open Now') : (isUrdu ? 'اس وقت بند ہے' : 'Currently Closed')}
                </span>
              </div>
              {[
                { icon: <Clock className="w-4 h-4 text-blue-400" />, text: displayRestaurant.openingHours },
                { icon: <MapPin className="w-4 h-4 text-amber-400" />, text: displayRestaurant.location || displayRestaurant.address },
                { icon: <Phone className="w-4 h-4 text-emerald-400" />, text: displayRestaurant.phone },
              ].filter(i => i.text).map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-400">{item.icon}<span>{item.text}</span></div>
              ))}
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">{t('chefsSpecial')}</div>
              <h4 className="font-bold text-white text-lg">{displayRestaurant.specialDish}</h4>
              <p className="text-amber-400 font-black text-xl mt-1">{displayRestaurant.specialDishPrice}</p>
            </div>

            <button onClick={() => setShowOrder(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all">
              <ShoppingBag className="w-5 h-5" /> {t('placeOrderNow')}
            </button>

            <Link to="/restaurants" className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" /> {t('allRestaurantsLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail
