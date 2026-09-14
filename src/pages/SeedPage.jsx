import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { registerRestaurant } from '../firebase/services'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE } from '../utils/imageHelper'
import { seedRestaurants, PESHAWAR_RESTAURANTS } from '../firebase/seedData'
import { Database, CheckCircle, AlertCircle, Loader, Store } from 'lucide-react'

const SeedPage = () => {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSeed = async () => {
    setStatus('loading')
    setMessage('Adding restaurants to Firebase...')
    const result = await seedRestaurants()
    if (result.success) {
      setStatus('success')
      setMessage(`✅ Successfully added ${result.count} restaurants to Firebase!`)
    } else {
      setStatus('error')
      setMessage(`❌ Error: ${result.error}`)
    }
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      <div className="page-container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/30"
              style={{ background: 'rgba(255,107,53,0.15)' }}>
              <Database className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-head">Database Seeder</h1>
              <p className="text-white/50 text-sm">Add real Peshawar restaurants to Firebase</p>
            </div>
          </div>

          {/* Restaurant Preview */}
          <div className="glass-card p-6 mb-6">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              {PESHAWAR_RESTAURANTS.length} Restaurants + Admin Account Ready
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PESHAWAR_RESTAURANTS.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/8"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getValidImageUrl(r, DEFAULT_RESTAURANT_IMAGE)}
                      alt={r.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, DEFAULT_RESTAURANT_IMAGE)}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{r.name}</p>
                    <p className="text-white/40 text-xs truncate">{r.location}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-yellow-400 text-xs">★ {r.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border mb-6 flex items-center gap-3 ${
                status === 'success' ? 'border-emerald-500/30 text-emerald-400' :
                status === 'error' ? 'border-red-500/30 text-red-400' :
                'border-blue-500/30 text-blue-400'
              }`}
              style={{
                background: status === 'success' ? 'rgba(16,185,129,0.1)' :
                  status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)'
              }}>
              {status === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> :
               status === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> :
               <Loader className="w-5 h-5 flex-shrink-0 animate-spin" />}
              {message}
            </motion.div>
          )}

          {/* Seed Button */}
          <button onClick={handleSeed} disabled={status === 'loading' || status === 'success'}
            className="btn-primary w-full py-4 rounded-xl text-base gap-3 disabled:opacity-60">
            {status === 'loading'
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding to Firebase...</>
              : status === 'success'
              ? <><CheckCircle className="w-5 h-5" />Data Added Successfully!</>
              : <><Database className="w-5 h-5" />Add {PESHAWAR_RESTAURANTS.length} Restaurants to Firebase</>
            }
          </button>

          {status === 'success' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/40 text-sm mt-4">
              Now go to <a href="/restaurants" className="text-primary hover:underline">/restaurants</a> to see the data!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SeedPage
