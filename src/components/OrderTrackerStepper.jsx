import { motion } from 'framer-motion'
import { Clock, ChefHat, Bike, CheckCircle2, AlertCircle } from 'lucide-react'

const STEPS = [
  { id: 'pending', labelEn: 'Order Placed', labelUr: 'آرڈر موصول ہوا', icon: Clock },
  { id: 'preparing', labelEn: 'Preparing', labelUr: 'تیاری جاری ہے', icon: ChefHat },
  { id: 'ready', labelEn: 'On the Way', labelUr: 'راستے میں ہے', icon: Bike },
  { id: 'delivered', labelEn: 'Delivered', labelUr: 'ڈلیور ہو گیا', icon: CheckCircle2 }
]

const getStepIndex = (status) => {
  switch (status) {
    case 'pending': return 0
    case 'confirmed': return 0
    case 'preparing': return 1
    case 'ready': return 2
    case 'delivered':
    case 'completed': return 3
    case 'cancelled': return -1
    default: return 0
  }
}

export const OrderTrackerStepper = ({ status, isUrdu }) => {
  const currentStep = getStepIndex(status)

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-xs font-bold">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{isUrdu ? 'یہ آرڈر منسوخ کر دیا گیا ہے' : 'This order has been cancelled.'}</span>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
          {isUrdu ? 'لائیو آرڈر کی صورتحال' : 'Live Order Progress'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {isUrdu ? 'لائیو اپ ڈیٹ' : 'Live Tracking'}
        </span>
      </div>

      {/* Stepper Bar */}
      <div className="relative flex items-center justify-between pt-2 pb-1">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />

        {/* Active Animated Progress Line */}
        <motion.div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 rounded-full z-0 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, (currentStep / (STEPS.length - 1)) * 90 + 5)}%`
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Pulse Loading Indicator over line if not finished */}
        {currentStep < STEPS.length - 1 && (
          <div
            style={{ left: `${(currentStep / (STEPS.length - 1)) * 80 + 10}%` }}
            className="absolute top-1/2 -translate-y-1/2 z-10 w-6 h-1 bg-white/80 rounded-full animate-pulse blur-[1px]"
          />
        )}

        {/* Steps Nodes */}
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const isPassed = idx <= currentStep
          const isCurrent = idx === currentStep
          const isNextLoading = idx === currentStep + 1

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isPassed ? '#10b981' : isNextLoading ? '#1e293b' : '#0f172a',
                  borderColor: isCurrent ? '#f59e0b' : isPassed ? '#10b981' : '#334155'
                }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${
                  isCurrent
                    ? 'border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : isPassed
                    ? 'border-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'border-slate-700 text-slate-500'
                }`}
              >
                {isPassed && !isCurrent ? (
                  <CheckCircle2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="text-center mt-2">
                <p className={`text-[11px] font-bold ${isCurrent ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isUrdu ? step.labelUr : step.labelEn}
                </p>
                {isCurrent && currentStep < STEPS.length - 1 && (
                  <span className="inline-block text-[9px] text-amber-400/80 animate-pulse font-medium mt-0.5">
                    {isUrdu ? '۔۔کا انتظار کریں' : 'In Progress...'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
