import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Utensils, Users, Star, MapPin, Shield, Heart, ArrowRight, CheckCircle, Globe, TrendingUp } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const About = () => {
  const { t, isUrdu } = useLanguage()

  const stats = [
    { value: '10+', label: isUrdu ? 'ریسٹورنٹس' : 'Restaurants Listed', icon: <Utensils className="w-5 h-5" />, color: 'text-amber-400' },
    { value: '3', label: isUrdu ? 'علاقے' : 'Areas Covered', icon: <MapPin className="w-5 h-5" />, color: 'text-blue-400' },
    { value: '100%', label: isUrdu ? 'مفت' : 'Free for Owners', icon: <Heart className="w-5 h-5" />, color: 'text-rose-400' },
    { value: '24/7', label: isUrdu ? 'ہمیشہ آن لائن' : 'Always Online', icon: <Globe className="w-5 h-5" />, color: 'text-emerald-400' },
  ]

  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: isUrdu ? 'اعتماد اور صداقت' : 'Trust & Authenticity',
      desc: isUrdu ? 'ہر ریسٹورنٹ تصدیق شدہ ہے۔ صرف اصل پشاوری کھانے کے مراکز ہی ہمارے پلیٹ فارم پر ہیں۔' : 'Every restaurant is verified. Only real, authentic Peshawar eateries on our platform.',
      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: isUrdu ? 'پشاور سے محبت' : 'Love for Peshawar',
      desc: isUrdu ? 'ایک پشاوری نے پشاوریوں کے لیے بنایا۔ ہمیں اپنی مقامی کھانے کی وراثت سے بے حد محبت ہے۔' : 'Built by a Peshawari, for Peshawaris. We deeply care about our local food heritage.',
      color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: isUrdu ? 'مالکان کو طاقت' : 'Empowering Owners',
      desc: isUrdu ? 'ہم ریسٹورنٹ مالکان کو مفت ڈیجیٹل ٹولز فراہم کرتے ہیں تاکہ وہ اپنا کاروبار آن لائن بڑھا سکیں۔' : 'We give restaurant owners free digital tools to grow their business online.',
      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: isUrdu ? 'کمیونٹی اول' : 'Community First',
      desc: isUrdu ? 'کھانا لوگوں کو جوڑتا ہے۔ ہم پشاور کی فوڈ کلچر کے گرد ایک کمیونٹی بنا رہے ہیں۔' : 'Food connects people. We are building a community around Peshawar\'s food culture.',
      color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-20" dir={isUrdu ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <section className="relative py-20 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-6">
              <Utensils className="w-3.5 h-3.5" />
              {isUrdu ? 'ہماری کہانی' : 'Our Story'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              {isUrdu ? 'پشاور فوڈز' : 'About Peshawar Foods'}<br />
              <span className="text-amber-400">{isUrdu ? 'اور شنواری ایکسپلورر' : '& Shinwari Explorer'}</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
              {isUrdu
                ? 'ہم پشاور کی خالص اور روایتی فوڈ کلچر کو ڈیجیٹل کرنے کے مشن پر ہیں — فوڈ لورز کو اصل ریسٹورنٹس سے ملا کر اور مالکان کو آن لائن بڑھنے کے ٹولز دے کر۔'
                : 'We are on a mission to digitize Peshawar\'s legendary food culture — connecting food lovers with authentic restaurants and giving owners the tools to grow online.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-slate-900 rounded-2xl border border-slate-800">
                <div className={`inline-flex mb-3 ${s.color}`}>{s.icon}</div>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-3">
                {isUrdu ? 'ہمارا مشن' : 'Our Mission'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                {isUrdu ? 'پشاور کے کھانے کو' : 'Putting Peshawar\'s Food'}<br />
                <span className="text-amber-400">{isUrdu ? 'ڈیجیٹل نقشے پر لانا' : 'on the Digital Map'}</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                {isUrdu
                  ? 'پشاور پاکستان کی سب سے مشہور ڈشز کا گھر ہے — چارسی تکہ، شنواری کڑاہی، چپلی کباب، ڈم پخت۔ مگر زیادہ تر ریسٹورنٹس کا کوئی آن لائن وجود نہیں تھا۔'
                  : 'Peshawar is home to some of Pakistan\'s most iconic dishes — Charsi Tikka, Shinwari Karahi, Chapli Kebab, Dumpukht. Yet most restaurants had no online presence.'}
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                {isUrdu
                  ? 'ہم نے یہ پلیٹ فارم اسی لیے بنایا۔ ہر ریسٹورنٹ مالک مفت ڈیجیٹل ٹولز کا حقدار ہے، اور ہر فوڈ لور کو پشاور کے بہترین کھانے آسانی سے ملنے چاہئیں۔'
                  : 'We built this platform to change that. Every restaurant owner deserves free digital tools, and every food lover deserves to discover the best of Peshawar easily.'}
              </p>
              <div className="space-y-3">
                {[
                  isUrdu ? 'تمام مالکان کے لیے مفت رجسٹریشن' : 'Free restaurant listings for all owners',
                  isUrdu ? 'ریئل ٹائم مینو مینجمنٹ ڈیش بورڈ' : 'Real-time menu management dashboard',
                  isUrdu ? 'کسٹمر ریویوز اور ریٹنگز' : 'Customer reviews and ratings',
                  isUrdu ? 'واٹس ایپ براہ راست رابطہ' : 'WhatsApp direct contact integration',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white">{isUrdu ? 'پشاور فوڈز' : 'Peshawar Foods'}</h3>
                <p className="text-amber-400 text-sm font-bold">{isUrdu ? 'اینڈ شنواری ایکسپلورر' : '& Shinwari Explorer'}</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: isUrdu ? 'پلیٹ فارم کی قسم' : 'Platform Type', value: isUrdu ? 'فل اسٹیک ویب ایپ' : 'Full-Stack Web App' },
                  { label: isUrdu ? 'ٹیکنالوجی' : 'Technology', value: 'React + Firebase' },
                  { label: isUrdu ? 'فوکس شہر' : 'Focus City', value: isUrdu ? 'پشاور، کے پی کے' : 'Peshawar, KPK' },
                  { label: isUrdu ? 'مالکان کے لیے' : 'For Owners', value: isUrdu ? '100% مفت' : '100% Free' },
                  { label: isUrdu ? 'آغاز' : 'Launched', value: '2025' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.label === (isUrdu ? 'مالکان کے لیے' : 'For Owners') ? 'text-emerald-400' : 'text-white'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-3">
              {isUrdu ? 'ہم کس چیز کے قائل ہیں' : 'What We Stand For'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {isUrdu ? 'ہماری اقدار' : 'Our Values'}
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${v.bg}`}>
                <div className={`mb-4 ${v.color}`}>{v.icon}</div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-3">
              {isUrdu ? 'ٹیم' : 'The Team'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {isUrdu ? 'جذبے کے ساتھ بنایا' : 'Built With Passion'}
            </h2>
          </motion.div>
          <div className="flex justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center max-w-sm w-full">
              <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-slate-950">
                MK
              </div>
              <h3 className="text-xl font-black text-white">Maaz Khan</h3>
              <p className="text-amber-400 text-sm font-bold mt-1">
                {isUrdu ? 'بانی اور لیڈ ڈویلپر' : 'Founder & Lead Developer'}
              </p>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                {isUrdu
                  ? 'فرنٹ اینڈ ڈویلپر جو پشاور کی فوڈ کلچر کو ڈیجیٹل کرنے کا خواب رکھتا ہے۔'
                  : 'Frontend developer passionate about digitizing Peshawar\'s food culture.'}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <a href="https://github.com/mzmaaz08-commits" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all">GitHub</a>
                <a href="https://www.linkedin.com/in/maaz-khan-155559407/" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all">LinkedIn</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {isUrdu ? 'ہماری فوڈ' : 'Join Our Food'}{' '}
              <span className="text-amber-400">{isUrdu ? 'کمیونٹی میں شامل ہوں' : 'Community'}</span>
            </h2>
            <p className="text-slate-400 mb-8">
              {isUrdu
                ? 'چاہے آپ فوڈ لور ہوں یا ریسٹورنٹ مالک — یہاں آپ کے لیے جگہ ہے۔'
                : 'Whether you\'re a food lover or a restaurant owner — there\'s a place for you here.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/restaurants"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all">
                <Utensils className="w-5 h-5" />
                {isUrdu ? 'ریسٹورنٹس دیکھیں' : 'Explore Restaurants'}
              </Link>
              <Link to="/register-restaurant"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl transition-all">
                {isUrdu ? 'ریسٹورنٹ رجسٹر کریں' : 'List Your Restaurant'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default About
