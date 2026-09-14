import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Shield, Store, Star, LogOut, Edit3, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, isAdmin, isOwner, role } = useAuth()
  const { isUrdu } = useLanguage()
  const [notif, setNotif] = useState({ msg: '', type: '' })

  const showNotif = (msg, type = 'success') => {
    setNotif({ msg, type })
    setTimeout(() => setNotif({ msg: '', type: '' }), 3000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getRoleBadge = () => {
    if (isAdmin) return { label: isUrdu ? 'ایڈمن' : 'Admin', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    if (isOwner) return { label: isUrdu ? 'ریسٹورنٹ مالک' : 'Restaurant Owner', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
    return { label: isUrdu ? 'فوڈ لور' : 'Food Lover', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
  }

  const badge = getRoleBadge()

  const accountDetails = [
    { icon: <User className="w-4 h-4" />, label: isUrdu ? 'پورا نام' : 'Full Name', value: user?.displayName || (isUrdu ? 'نہیں ملا' : 'Not set') },
    { icon: <Mail className="w-4 h-4" />, label: isUrdu ? 'ای میل' : 'Email Address', value: user?.email },
    { icon: <Shield className="w-4 h-4" />, label: isUrdu ? 'کردار' : 'Account Role', value: badge.label },
    { icon: <Star className="w-4 h-4" />, label: isUrdu ? 'رکنیت' : 'Member Since', value: '2025' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-20" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {notif.msg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-xl border mb-6 text-sm ${notif.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
              {notif.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              {notif.msg}
            </motion.div>
          )}

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-b border-slate-800 p-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center text-3xl font-black text-slate-950 flex-shrink-0">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-white">{user?.displayName || (isUrdu ? 'صارف' : 'User')}</h1>
                  <p className="text-slate-400 text-sm mb-2">{user?.email}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                {isUrdu ? 'اکاؤنٹ کی تفصیلات' : 'Account Details'}
              </h2>
              {accountDetails.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-white font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="px-6 pb-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                {isUrdu ? 'فوری لنکس' : 'Quick Links'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 font-bold text-sm hover:bg-purple-500/20 transition-all">
                    <Shield className="w-4 h-4" />
                    {isUrdu ? 'ایڈمن پینل' : 'Admin Panel'}
                  </Link>
                )}
                {isOwner && (
                  <Link to="/dashboard" className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-bold text-sm hover:bg-amber-500/20 transition-all">
                    <Store className="w-4 h-4" />
                    {isUrdu ? 'میرا ڈیش بورڈ' : 'My Dashboard'}
                  </Link>
                )}
                <Link to="/restaurants" className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all">
                  <Star className="w-4 h-4" />
                  {isUrdu ? 'ریسٹورنٹس دیکھیں' : 'Browse Restaurants'}
                </Link>
                <Link to="/my-orders" className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all">
                  <Store className="w-4 h-4" />
                  {isUrdu ? 'میرے آرڈرز' : 'My Orders'}
                </Link>
              </div>
            </div>

            {/* Logout */}
            <div className="px-6 pb-6">
              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all">
                <LogOut className="w-4 h-4" />
                {isUrdu ? 'سائن آؤٹ' : 'Sign Out'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
