import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Utensils, ArrowRight, CheckCircle, Store, Users } from 'lucide-react'
import { registerUser } from '../firebase/services'
import { useLanguage } from '../contexts/LanguageContext'

const getRoles = (isUrdu) => [
  {
    id: 'customer',
    label: isUrdu ? 'فوڈ لور / کسٹمر' : 'Food Lover & Guest',
    desc: isUrdu ? 'ریسٹورنٹس دیکھیں، آرڈر کریں اور ریویوز دیں' : 'Explore menus, order dishes & write reviews',
    icon: <Users className="w-5 h-5 text-blue-400" />,
    badge: isUrdu ? 'کسٹمر' : 'Customer'
  },
  {
    id: 'owner',
    label: isUrdu ? 'ریسٹورنٹ مالِک' : 'Restaurant Owner',
    desc: isUrdu ? 'اپنا ریسٹورنٹ رجسٹر کریں اور مینو مینج کریں' : 'List your restaurant & manage menu catalog',
    icon: <Store className="w-5 h-5 text-[#c5a059]" />,
    badge: isUrdu ? 'مالِک' : 'Owner SaaS'
  },
]

const passwordStrength = (pwd) => {
  let score = 0
  if (pwd.length >= 6) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

const Register = () => {
  const navigate = useNavigate()
  const { t, isUrdu } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [role, setRole] = useState('customer')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const ROLES = getRoles(isUrdu)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your full name.'); return }
    if (!form.email.trim()) { setError('Please enter a valid email address.'); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError(isUrdu ? 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے' : 'Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError(isUrdu ? 'پاس ورڈز ملتے نہیں' : 'Passwords do not match.'); return }
    setLoading(true)
    setError('')
    const result = await registerUser(form.email, form.password, form.name, role)
    setLoading(false)
    if (result.success) {
      if (role === 'owner') navigate('/register-restaurant')
      else navigate('/restaurants')
    } else {
      setError(
        result.error?.includes('email-already-in-use') ? (isUrdu ? 'یہ ای میل پہلے سے رجسٹر ہے' : 'This email is already registered.') :
        result.error?.includes('weak-password') ? (isUrdu ? 'پاس ورڈ بہت کمزور ہے' : 'Password is too weak.') :
        result.error?.includes('invalid-email') ? (isUrdu ? 'غلط ای میل پتہ' : 'Invalid email address.') :
        (isUrdu ? 'رجسٹریشن ناکام ہوئی۔ دوبارہ کوشش کریں' : 'Registration failed. Please try again.')
      )
    }
  }

  const strength = passwordStrength(form.password)
  const strengthLabels = isUrdu
    ? ['', 'کمزور', 'درمیانہ', 'اچھا', 'مضبوط']
    : ['', 'Basic', 'Medium', 'Good', 'Strong']
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden" dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10 my-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Utensils className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white block">
                {isUrdu ? 'پشاور فوڈز' : 'Peshawar Foods'}
              </span>
              <span className="text-xs text-amber-400 font-bold block">
                {isUrdu ? 'شنواری ایکسپلورر' : '& Shinwari Explorer'}
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-2">
            {isUrdu ? 'اکاؤنٹ بنائیں' : 'Create Account'}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {isUrdu ? 'پشاور کے فوڈ پلیٹ فارم میں شامل ہوں' : "Join Peshawar's premier food platform"}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-amber-500' : 'bg-white/10'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isUrdu ? 'مرحلہ 1 از 2 — اکاؤنٹ کی قسم' : 'Step 1 of 2 — Account Role'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {isUrdu ? 'اکاؤنٹ کا مقصد منتخب کریں' : 'Select Account Purpose'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLES.map(r => (
                      <button key={r.id} type="button" onClick={() => setRole(r.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 ${role === r.id ? 'bg-amber-500/20 border-amber-500 shadow-lg' : 'bg-slate-800/70 border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-xl bg-white/5">{r.icon}</div>
                          {role === r.id && <CheckCircle className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="font-bold text-white text-xs">{r.label}</p>
                        <p className="text-white/40 text-[11px] mt-1 leading-snug">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isUrdu ? 'پورا نام' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder={isUrdu ? 'مثلاً: احمد خان' : 'e.g. Ahmad Khan'}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isUrdu ? 'ای میل پتہ' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500" required />
                  </div>
                </div>

                <button type="submit"
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all">
                  <span>{isUrdu ? 'آگے جاریں' : 'Continue to Security'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isUrdu ? 'مرحلہ 2 از 2 — پاس ورڈ سیٹ کریں' : 'Step 2 of 2 — Set Password'}
                  </span>
                  <button type="button" onClick={() => setStep(1)} className="text-white/50 text-xs hover:text-white transition-colors">
                    {isUrdu ? '← تدوین کریں' : '← Edit Details'}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b0b0e] border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] font-bold text-sm">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-bold truncate">{form.name}</p>
                    <p className="text-white/40 text-[11px] truncate">{form.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${role === 'owner' ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'bg-blue-500/20 text-blue-400'}`}>
                    {role === 'owner' ? 'Restaurant Owner' : 'Foodie Guest'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isUrdu ? 'پاس ورڈ' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500"
                      required minLength={6} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1.5 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-white/50">
                        {isUrdu ? 'پاس ورڈ کی طاقت: ' : 'Password strength: '}{strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {isUrdu ? 'پاس ورڈ تصدیق کریں' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500"
                      required />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      <span>{isUrdu ? 'اکاؤنٹ بن رہا ہے...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{isUrdu ? 'رجسٹریشن مکمل کریں' : 'Complete Registration'}</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}

          </AnimatePresence>

          <div className="my-6 border-t border-white/10" />

          <p className="text-center text-slate-400 text-xs">
            {isUrdu ? 'پہلے سے اکاؤنٹ ہے؟ ' : 'Already registered? '}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              {isUrdu ? 'یہاں لاگ ان کریں' : 'Sign In Here'}
            </Link>
          </p>
        </motion.div>

      </div>
    </div>
  )
}

export default Register
