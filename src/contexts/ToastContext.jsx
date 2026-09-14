import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info')
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 50 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold ${
                t.type === 'success'
                  ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
                  : t.type === 'error'
                  ? 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-950/40'
                  : 'bg-slate-900/95 border-amber-500/40 text-amber-300 shadow-amber-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition p-1 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export default ToastContext
