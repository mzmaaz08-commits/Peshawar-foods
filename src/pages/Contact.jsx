import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Contact = () => {
  const { isUrdu } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('success')
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: isUrdu ? 'ای میل کریں' : 'Email Us',
      value: 'imaazdev00@gmail.com',
      link: 'mailto:imaazdev00@gmail.com',
      color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: isUrdu ? 'کال کریں' : 'Call Us',
      value: '+92 333 9334031',
      link: 'tel:+923339334031',
      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'WhatsApp',
      value: '+92 333 9334031',
      link: 'https://wa.me/923339334031',
      color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: isUrdu ? 'مقام' : 'Location',
      value: isUrdu ? 'پشاور، کے پی کے، پاکستان' : 'Peshawar, KPK, Pakistan',
      link: 'https://maps.google.com/?q=Peshawar,Pakistan',
      color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-20" dir={isUrdu ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <section className="py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-6">
              <Mail className="w-3.5 h-3.5" />
              {isUrdu ? 'رابطہ کریں' : 'Get In Touch'}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {isUrdu ? 'ہم سے' : 'Contact'}{' '}
              <span className="text-amber-400">{isUrdu ? 'رابطہ کریں' : 'Us'}</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              {isUrdu
                ? 'کوئی سوال ہو، ریسٹورنٹ رجسٹر کرنا ہو، یا بس ہیلو کہنا ہو — ہم آپ کا انتظار کر رہے ہیں۔'
                : 'Have a question, want to list your restaurant, or just want to say hello? We\'d love to hear from you.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-black text-white mb-2">
                {isUrdu ? 'بات کرتے ہیں' : 'Let\'s Talk'}
              </h2>
              <p className="text-slate-400 mb-8">
                {isUrdu
                  ? 'ان میں سے کسی بھی طریقے سے رابطہ کریں — ہم عموماً 24 گھنٹوں میں جواب دیتے ہیں۔'
                  : 'Reach out through any of these channels — we usually respond within 24 hours.'}
              </p>

              <div className="space-y-4 mb-10">
                {contactInfo.map((item, i) => (
                  <a key={i} href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-2xl border ${item.bg} hover:scale-[1.02] transition-all`}>
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="font-black text-amber-400 mb-2 flex items-center gap-2">
                  🍖 {isUrdu ? 'ریسٹورنٹ مالک؟' : 'Restaurant Owner?'}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {isUrdu
                    ? 'کیا آپ اپنا ریسٹورنٹ مفت میں ہمارے پلیٹ فارم پر لسٹ کرنا چاہتے ہیں؟ ہم آپ کا پروفائل، مینو اور ڈیش بورڈ سیٹ اپ کریں گے۔'
                    : 'Want to list your restaurant on our platform for free? We\'ll set up your profile, menu, and dashboard — no technical knowledge needed.'}
                </p>
                <a href="/register-restaurant"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all">
                  {isUrdu ? 'ریسٹورنٹ رجسٹر کریں ←' : 'Register Your Restaurant →'}
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
                <h2 className="text-xl font-black text-white mb-6">
                  {isUrdu ? 'پیغام بھیجیں' : 'Send Us a Message'}
                </h2>

                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {isUrdu ? 'پیغام کامیابی سے بھیج دیا گیا! ہم جلد جواب دیں گے۔' : 'Message sent successfully! We\'ll get back to you soon.'}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">
                        {isUrdu ? 'آپ کا نام *' : 'Your Name *'}
                      </label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder={isUrdu ? 'احمد خان' : 'Ahmed Khan'} required
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">
                        {isUrdu ? 'ای میل *' : 'Email *'}
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@email.com" required
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">
                      {isUrdu ? 'موضوع *' : 'Subject *'}
                    </label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange}
                      placeholder={isUrdu ? 'مثلاً: ریسٹورنٹ رجسٹریشن' : 'e.g. Restaurant listing inquiry'} required
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1.5">
                      {isUrdu ? 'پیغام *' : 'Message *'}
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder={isUrdu ? 'ہمیں بتائیں کہ ہم آپ کی کس طرح مدد کر سکتے ہیں...' : 'Tell us how we can help you...'} required rows={5}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" />
                  </div>

                  <button type="submit" disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-black rounded-xl transition-all">
                    {status === 'loading'
                      ? <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />{isUrdu ? 'بھیجا جا رہا ہے...' : 'Sending...'}</>
                      : <><Send className="w-4 h-4" />{isUrdu ? 'پیغام بھیجیں' : 'Send Message'}</>
                    }
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact
