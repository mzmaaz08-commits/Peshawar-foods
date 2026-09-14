import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { registerRestaurant, uploadRestaurantImage } from '../firebase/services'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE } from '../utils/imageHelper'
import { Store, CheckCircle, ArrowRight, ArrowLeft, MapPin, Phone, Mail, Clock, DollarSign, ChefHat, Camera, AlertCircle, Utensils, X, Upload, MessageCircle } from 'lucide-react'

const getRegistrationSteps = (isUrdu) => [
  { id: 1, label: isUrdu ? 'بنیادی معلومات' : 'Basic Info', icon: <Store className="w-4 h-4" /> },
  { id: 2, label: isUrdu ? 'مقام اور رابطہ' : 'Location & Contact', icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: isUrdu ? 'مینو کی تفصیلات' : 'Menu Details', icon: <ChefHat className="w-4 h-4" /> },
]

const CUISINES = ['Pakistani','Afghan','Chinese','Fast Food','BBQ','Traditional','Italian','Continental','Desserts','Other']
const PRICE_RANGES = ['Rs. 500-1000', 'Rs. 1000-2000', 'Rs. 2000+']

const RestaurantRegistration = () => {
  const navigate = useNavigate()
  const { user, refreshUserData } = useAuth()
  const { t, isUrdu } = useLanguage()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState({
    name: '', cuisine: 'Pakistani', description: '',
    address: '', phone: '', whatsapp: '', email: '', openingHours: '11:00 AM - 11:00 PM',
    priceRange: '$$', image: '', specialDish: '', specialDishPrice: '', isOpen: true,
  })

  const STEPS = getRegistrationSteps(isUrdu)
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(isUrdu ? 'تصویر کا سائز 5MB سے کم ہونا چاہیے' : 'Image size must be less than 5MB')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(isUrdu ? 'صرف JPEG، PNG اور WebP اجازت ہے' : 'Only JPEG, PNG, and WebP images are allowed')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    set('image', '')
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) { setError(isUrdu ? 'ریسٹورنٹ کا نام درکار ہے' : 'Restaurant name is required'); return false }
      if (!form.description.trim()) { setError(isUrdu ? 'تفصیل درکار ہے' : 'Description is required'); return false }
    }
    if (step === 2) {
      if (!form.address.trim()) { setError(isUrdu ? 'پتہ درکار ہے' : 'Address is required'); return false }
      if (!form.phone.trim()) { setError(isUrdu ? 'فون نمبر درکار ہے' : 'Phone number is required'); return false }
    }
    if (step === 3) {
      if (!form.specialDish.trim()) { setError(isUrdu ? 'خاص ڈش کا نام درکار ہے' : 'Signature dish is required'); return false }
    }
    setError('')
    return true
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const prev = () => { setError(''); setStep(s => s - 1) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return
    if (!user) { navigate('/login'); return }
    setLoading(true)

    // Process image URL with helper
    let imageUrl = getValidImageUrl(form.image, DEFAULT_RESTAURANT_IMAGE)
    if (imageFile) {
      setUploading(true)
      const uploadResult = await uploadRestaurantImage(imageFile, user.uid)
      setUploading(false)
      if (uploadResult.success) {
        imageUrl = uploadResult.url
      } else {
        imageUrl = getValidImageUrl(form.image, DEFAULT_RESTAURANT_IMAGE)
      }
    }
    
    const result = await registerRestaurant({ ...form, image: imageUrl }, user.uid)
    if (result.success) {
      if (refreshUserData) await refreshUserData()
      setSubmitted(true)
    } else {
      setError(result.error || 'Failed to register. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16,185,129,0.15)' }}>
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h2 className="text-3xl font-black text-white font-head mb-3">{isUrdu ? 'ریسٹورنٹ رجسٹر ہو گیا!' : 'Restaurant Registered!'}</h2>
          <p className="text-white/50 mb-8"><span className="text-primary font-semibold">{form.name}</span> {isUrdu ? 'اب پشاور فوڈز پر آن لائن لائیو ہے۔' : 'is now live on Peshawar Foods & Shinwari Explorer.'}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn-primary py-4 rounded-xl gap-2 text-base"><Store className="w-5 h-5" />{isUrdu ? 'ڈیش بورڈ پر جائیں' : 'Go to Dashboard'}</button>
            <button onClick={() => navigate('/restaurants')} className="btn-ghost py-3 rounded-xl text-sm">{isUrdu ? 'تمام ریسٹورنٹس دیکھیں' : 'View All Restaurants'}</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-16">
      <div className="page-container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl border border-primary/30 flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }}>
              <Utensils className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-head">{isUrdu ? 'اپنا ریسٹورنٹ رجسٹر کریں' : 'Register Your Restaurant'}</h1>
          <p className="text-white/50 mt-2">{isUrdu ? 'پشاور کے ہزاروں فوڈ لورز تک پہنچیں' : 'Reach thousands of food lovers in Peshawar'}</p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all w-full ${step === s.id ? 'border-primary/50 text-primary' : step > s.id ? 'border-emerald-500/40 text-emerald-400' : 'border-white/10 text-white/40'}`}
                style={{ background: step === s.id ? 'rgba(255,107,53,0.15)' : step > s.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}>
                {step > s.id ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : s.icon}
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-4 rounded-full flex-shrink-0 ${step > s.id ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 text-red-400 text-sm mb-6"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-5"><Store className="w-4 h-4 text-primary" />{isUrdu ? 'بنیادی معلومات' : 'Basic Information'}</h3>
                  <div><label className="input-label">{isUrdu ? 'ریسٹورنٹ کا نام *' : 'Restaurant Name *'}</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Charsi Tikka House" className="input-field mt-1.5" /></div>
                  <div>
                    <label className="input-label">{isUrdu ? 'پکوان کی قسم *' : 'Cuisine Type *'}</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CUISINES.map(c => <button key={c} type="button" onClick={() => set('cuisine', c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${form.cuisine === c ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/8'}`}>{c}</button>)}
                    </div>
                  </div>
                  <div><label className="input-label">{isUrdu ? 'تفصیل *' : 'Description *'}</label><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={isUrdu ? 'اپنے ریسٹورنٹ کی خصوصیات بیان کریں...' : 'Tell customers about your restaurant...'} rows={4} className="input-field mt-1.5 resize-none" /></div>
                  <div>
                    <label className="input-label">{isUrdu ? 'ریسٹورنٹ تصویر' : 'Restaurant Image'}</label>
                    <div className="mt-1.5">
                      {!(imagePreview || form.image) ? (
                        <div className="relative">
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" id="image-upload" />
                          <label htmlFor="image-upload" className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-white font-medium text-sm">{isUrdu ? 'تصویر اپلوڈ کرنے کے لیے کلک کریں' : 'Click to upload image'}</p>
                              <p className="text-white/40 text-xs mt-1">JPEG, PNG, WebP (max 5MB)</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview || getValidImageUrl(form.image, DEFAULT_RESTAURANT_IMAGE)}
                            alt="preview"
                            className="w-full h-48 object-cover rounded-xl border border-white/10 shadow-md"
                            onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
                          />
                          <button type="button" onClick={removeImage} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-white/50 text-xs font-semibold">{isUrdu ? 'یا Image URL درج کریں:' : 'Or enter Image URL:'}</span>
                      <input
                        value={form.image}
                        onChange={e => {
                          set('image', e.target.value)
                          setError('')
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 input-field py-2 text-sm"
                      />
                    </div>
                    <p className="text-amber-400/70 text-[11px] mt-1">
                      {isUrdu
                        ? '💡 نوٹ: ویب صفحہ کے بجائے براہِ راست تصویر کا لنک (.jpg, .png یا Unsplash image URL) درج کریں۔ اگر لنک کام نہ کرے تو ڈیفالٹ تصویر خود بخود لگ جائے گی۔'
                        : '💡 Note: Ensure URL is a direct image link (.jpg, .png, or Unsplash direct URL). Broken links fallback automatically.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-5"><MapPin className="w-4 h-4 text-primary" />{isUrdu ? 'مقام اور رابطہ' : 'Location & Contact'}</h3>
                  <div><label className="input-label">{isUrdu ? 'مکمل پتہ *' : 'Full Address *'}</label><div className="relative mt-1.5"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Namak Mandi, Old City, Peshawar" className="input-field pl-11" /></div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">{isUrdu ? 'فون نمبر *' : 'Phone *'}</label><div className="relative mt-1.5"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 1234567" className="input-field pl-11" /></div></div>
                    <div><label className="input-label">{isUrdu ? 'ای میل *' : 'Email *'}</label><div className="relative mt-1.5"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@restaurant.com" className="input-field pl-11" /></div></div>
                  </div>
                  <div><label className="input-label">{isUrdu ? 'واٹس ایپ نمبر (کسٹمر رابطے کے لیے)' : 'WhatsApp Number (for direct customer contact)'}</label><div className="relative mt-1.5"><MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" /><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="923001234567" className="input-field pl-11" /></div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{isUrdu ? 'اوقاتِ کار' : 'Opening Hours'}</label><input value={form.openingHours} onChange={e => set('openingHours', e.target.value)} placeholder="11:00 AM - 11:00 PM" className="input-field mt-1.5" /></div>
                    <div>
                      <label className="input-label flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" />{isUrdu ? 'قیمت کی حد' : 'Price Range'}</label>
                      <div className="flex gap-2 mt-1.5">
                        {PRICE_RANGES.map(p => <button key={p} type="button" onClick={() => set('priceRange', p)} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${form.priceRange === p ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>{p}</button>)}
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => set('isOpen', !form.isOpen)} className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${form.isOpen ? 'bg-emerald-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isOpen ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-white/70">{isUrdu ? 'کاروبار کے لیے فی الحال کُھلا ہے' : 'Currently Open for Business'}</span>
                  </label>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h3 className="font-bold text-white flex items-center gap-2 mb-5"><ChefHat className="w-4 h-4 text-primary" />{isUrdu ? 'خاص ڈش' : 'Signature Dish'}</h3>
                  <div className="p-4 rounded-xl border border-primary/20" style={{ background: 'rgba(255,107,53,0.06)' }}>
                    <p className="text-white/60 text-sm">{isUrdu ? 'آپ کی خاص ڈش ریسٹورنٹ پروفائل پر نمایاں کی جائے گی۔' : 'Your signature dish will be highlighted on your restaurant profile.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">{isUrdu ? 'ڈش کا نام *' : 'Dish Name *'}</label><input value={form.specialDish} onChange={e => set('specialDish', e.target.value)} placeholder="e.g. Charsi Tikka" className="input-field mt-1.5" /></div>
                    <div><label className="input-label">{isUrdu ? 'قیمت' : 'Price'}</label><input value={form.specialDishPrice} onChange={e => set('specialDishPrice', e.target.value)} placeholder="Rs. 800" className="input-field mt-1.5" /></div>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/8 space-y-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <h4 className="font-bold text-white text-sm mb-3">{isUrdu ? 'خلاصہ' : 'Summary'}</h4>
                    {[{ label: isUrdu ? 'نام' : 'Name', value: form.name }, { label: isUrdu ? 'پکوان' : 'Cuisine', value: form.cuisine }, { label: isUrdu ? 'پتہ' : 'Address', value: form.address }, { label: isUrdu ? 'اوقات' : 'Hours', value: form.openingHours }, { label: isUrdu ? 'قیمت' : 'Price', value: form.priceRange }].filter(i => i.value).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm"><span className="text-white/40">{item.label}</span><span className="text-white font-medium truncate max-w-[200px]">{item.value}</span></div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-8 pt-6 border-t border-white/8">
              {step > 1 && <button type="button" onClick={prev} className="btn-ghost rounded-xl gap-2 px-6"><ArrowLeft className="w-4 h-4" />{isUrdu ? 'واپس' : 'Back'}</button>}
              {step < 3
                ? <button type="button" onClick={next} className="btn-primary rounded-xl gap-2 ml-auto px-8">{isUrdu ? 'آگے بڑھیں' : 'Continue'} <ArrowRight className="w-4 h-4" /></button>
                : <button type="submit" disabled={loading} className="btn-primary rounded-xl gap-2 ml-auto px-8 disabled:opacity-60">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUrdu ? 'رجسٹر ہو رہا ہے...' : 'Registering...'}</> : <><CheckCircle className="w-4 h-4" />{t('registerRestaurant')}</>}
                  </button>
              }
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default RestaurantRegistration
