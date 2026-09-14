import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Utensils, ArrowRight, Check } from 'lucide-react'
import { loginUser, getUserData } from '../firebase/services'
import { useLanguage } from '../contexts/LanguageContext'

const Login = () => {
  const navigate = useNavigate()
  const { t, isUrdu } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await loginUser(form.email, form.password)
    if (result.success) {
      const userDataResult = await getUserData(result.user.uid)
      const role = userDataResult?.userData?.role || 'customer'

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'owner') {
        navigate('/dashboard')
      } else {
        navigate('/restaurants')
      }
    } else {
      setError(
        result.error?.includes('user-not-found') ? (isUrdu ? 'اس ای میل سے کوئی اکاؤنٹ نہیں ملا۔' : 'No account found with this email.') :
        result.error?.includes('wrong-password') ? (isUrdu ? 'پاس ورڈ غلط ہے۔ دوبارہ کوشش کریں۔' : 'Incorrect password. Please try again.') :
        result.error?.includes('too-many-requests') ? (isUrdu ? 'زیادہ کوششیں۔ کچھ دیر بعد کوشش کریں۔' : 'Too many attempts. Please try later.') :
        (isUrdu ? 'لاگ ان ناکام ہو گیا۔ معلومات چیک کریں۔' : 'Sign in failed. Please check your credentials.')
      )
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(255,107,53,0.06)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.06)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl border border-primary/30 flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }}>
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-black text-white font-head">Peshawar <span className="text-primary">Eats</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white font-head">{t('welcomeBack')}</h1>
          <p className="text-white/50 mt-2">{t('signInDesc')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 text-red-400 text-sm mb-6"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">{t('emailAddress')}</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@email.com" className="input-field pl-11" required />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label">{t('password')}</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" className="input-field pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  rememberMe ? 'bg-primary border-primary' : 'border-white/20 hover:border-white/40'
                }`}
              >
                {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <label className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors" onClick={() => setRememberMe(!rememberMe)}>
                {t('rememberMe')}
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-base gap-2 disabled:opacity-60 mt-2">
              {loading
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUrdu ? 'لاگ ان ہو رہا ہے...' : 'Signing in...'}</>
                : <>{t('signIn')} <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="divider" />

          {/* Quick Connected Demo Accounts */}
          <div className="mt-6 pt-2 border-t border-white/10">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider text-center mb-3 flex items-center justify-center gap-1.5">
              <span>⚡</span> {isUrdu ? 'ٹیسٹ اکاؤنٹس (1-Click Login)' : 'Connected Test Logins (Demo)'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setForm({ email: 'imaazdev00@gmail.com', password: 'maaz@3172007' })
                  setLoading(true)
                  setError('')
                  const res = await loginUser('imaazdev00@gmail.com', 'maaz@3172007')
                  setLoading(false)
                  if (res.success) navigate('/admin')
                  else setError('Admin login error: ' + (res.error || 'Please seed data first'))
                }}
                className="flex flex-col items-center p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-all text-center group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">👑</span>
                <span className="text-[11px] font-bold block truncate w-full">Admin</span>
                <span className="text-[9px] text-white/40 block truncate w-full">Maaz Khan</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setForm({ email: 'owner@peshawareats.com', password: 'owner123' })
                  setLoading(true)
                  setError('')
                  const res = await loginUser('owner@peshawareats.com', 'owner123')
                  setLoading(false)
                  if (res.success) navigate('/dashboard')
                  else setError('Owner login error: ' + (res.error || 'Please seed data first'))
                }}
                className="flex flex-col items-center p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all text-center group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🏪</span>
                <span className="text-[11px] font-bold block truncate w-full">Owner</span>
                <span className="text-[9px] text-white/40 block truncate w-full">Charsi Tikka</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setForm({ email: 'customer@peshawareats.com', password: 'customer123' })
                  setLoading(true)
                  setError('')
                  const res = await loginUser('customer@peshawareats.com', 'customer123')
                  setLoading(false)
                  if (res.success) navigate('/restaurants')
                  else setError('Customer login error: ' + (res.error || 'Please seed data first'))
                }}
                className="flex flex-col items-center p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition-all text-center group"
              >
                <span className="text-lg mb-1 group-hover:scale-110 transition-transform">👤</span>
                <span className="text-[11px] font-bold block truncate w-full">Customer</span>
                <span className="text-[9px] text-white/40 block truncate w-full">Foodie</span>
              </button>
            </div>
          </div>

          <p className="text-center text-white/50 text-sm mt-6">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">{t('createOneFree')}</Link>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-white/30 text-xs mt-6">
          <Link to="/restaurants" className="hover:text-white transition-colors inline-flex items-center gap-1">
            ← {isUrdu ? 'تمام ریسٹورنٹس پر واپس' : 'Back to Restaurants'}
          </Link>
        </motion.p>
      </div>
    </div>
  )
}

export default Login
