import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Utensils, LogOut, LayoutDashboard, ChevronDown, Shield, Store, Home, List, ShoppingBag, Globe, Heart, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import CartDrawer from './CartDrawer'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { user, logout, isAuthenticated, isAdmin, isOwner } = useAuth()
  const { t, language, toggleLanguage, isUrdu } = useLanguage()
  const { setIsCartOpen, getTotalCount } = useCart()

  const totalCartCount = getTotalCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getDashboardLink = () => (isAdmin ? '/admin' : '/dashboard')
  const getDashboardLabel = () => (isAdmin ? t('admin') : t('dashboard'))

  const getRoleBadge = () => {
    if (isAdmin) return { label: t('admin'), cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    if (isOwner) return { label: isUrdu ? 'مالِک' : 'Owner', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
    return { label: isUrdu ? 'کسٹمر' : 'Customer', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
  }

  const navLinks = [
    { to: '/', label: t('home'), icon: <Home className="w-4 h-4" /> },
    { to: '/restaurants', label: t('restaurants'), icon: <List className="w-4 h-4" /> },
    { to: '/about', label: t('about'), icon: <Globe className="w-4 h-4" /> },
    { to: '/contact', label: t('contact'), icon: <Globe className="w-4 h-4" /> },
    { to: '/register-restaurant', label: t('registerRestaurant'), icon: <Store className="w-4 h-4" /> },
    { to: '/my-orders', label: t('myOrders'), icon: <ShoppingBag className="w-4 h-4" /> },
  ]

  const badge = getRoleBadge()

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-slate-950/85 backdrop-blur-xl'
            : 'bg-slate-950/50 backdrop-blur-md border-b border-slate-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl border border-amber-500/40 flex items-center justify-center transition-all group-hover:scale-110 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg shadow-amber-500/10">
                <Utensils className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xl font-black text-white hidden sm:block tracking-tight font-head">
                Peshawar <span className="text-amber-400">Foods</span>
              </span>
              <span className="text-xl font-black text-white sm:hidden font-head">
                PF<span className="text-amber-400">SE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all"
                title="Switch Language (اردو / English)"
              >
                <Globe className="w-4 h-4 text-amber-500" />
                <span>{language === 'en' ? 'اردو' : 'English'}</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-all"
                title={t('yourCart')}
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Favorites Shortcut */}
              <Link
                to="/restaurants?favorites=true"
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-rose-400 transition-all"
                title={t('favorites')}
              >
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </Link>

              {/* Auth / Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 text-sm font-black">
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white leading-none">
                        {user?.displayName || 'User'}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border mt-0.5 inline-block ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${isUrdu ? 'left-0' : 'right-0'} top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/95 backdrop-blur-xl z-50`}
                      >
                        <div className="p-3 border-b border-slate-800">
                          <p className="text-xs text-slate-400">{t('signedInAs')}</p>
                          <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                          >
                            <User className="w-4 h-4 text-blue-400" />
                            {t('profile')}
                          </Link>
                          <Link
                            to={getDashboardLink()}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                          >
                            {isAdmin ? <Shield className="w-4 h-4 text-purple-400" /> : <LayoutDashboard className="w-4 h-4 text-amber-500" />}
                            {getDashboardLabel()}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions Header */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-amber-400 text-xs font-bold"
              >
                {language === 'en' ? 'اردو' : 'EN'}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg border border-slate-700 bg-slate-800/60 text-amber-400"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-800/60 flex items-center justify-center text-white"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? 'text-amber-400 border border-amber-500/30 bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-slate-800 pt-3 mt-3 space-y-2">
                <Link
                  to="/restaurants?favorites=true"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-slate-800 transition-all"
                >
                  <Heart className="w-4 h-4 fill-rose-500/20" />
                  {t('favorites')}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-500" />
                      {getDashboardLabel()}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link to="/login" className="py-2.5 text-center text-sm font-semibold rounded-xl text-slate-200 bg-slate-800">
                      {t('login')}
                    </Link>
                    <Link to="/register" className="py-2.5 text-center text-sm font-bold rounded-xl text-slate-950 bg-amber-500">
                      {t('register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}

export default Navbar
