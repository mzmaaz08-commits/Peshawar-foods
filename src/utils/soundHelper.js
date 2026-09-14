// Web Audio API Sound Synthesizer for Notifications
// Works in all browsers without external audio files

let audioCtx = null

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Auto-unlock AudioContext on first user interaction (bypasses browser autoplay policy)
if (typeof window !== 'undefined') {
  const initAudioOnFirstUserGesture = () => {
    try {
      const ctx = getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        ctx.resume()
      }
    } catch (e) {}
  }
  window.addEventListener('click', initAudioOnFirstUserGesture, { once: true })
  window.addEventListener('keydown', initAudioOnFirstUserGesture, { once: true })
  window.addEventListener('touchstart', initAudioOnFirstUserGesture, { once: true })
}

// 🔔 Pleasant chime sound for Owner when a new order arrives
export const playNewOrderSound = () => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // First note (E5 = 659.25Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, now)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    // Second note (G5 = 783.99Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(783.99, now + 0.15)
    gain2.gain.setValueAtTime(0.4, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    // Third note (C6 = 1046.50Hz)
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(1046.50, now + 0.3)
    gain3.gain.setValueAtTime(0.5, now + 0.3)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    osc3.connect(gain3)
    gain3.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.3)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.6)
    osc3.start(now + 0.3)
    osc3.stop(now + 0.9)
  } catch (err) {
    console.warn('Audio play error:', err)
  }
}

// 🎵 Victory/Update chime sound for Customer when order status changes
export const playOrderStatusUpdateSound = () => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Note 1 (C5 = 523.25Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(523.25, now)
    gain1.gain.setValueAtTime(0.25, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    // Note 2 (E5 = 659.25Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(659.25, now + 0.12)
    gain2.gain.setValueAtTime(0.3, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.25)
    osc2.start(now + 0.12)
    osc2.stop(now + 0.5)
  } catch (err) {
    console.warn('Audio play error:', err)
  }
}
