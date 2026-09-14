import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { browserLocalPersistence, initializeAuth, getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuYJCMEH12-BPwaMzd-PZ3qodsxfjnol8",
  authDomain: "peshawar-restaurant.firebaseapp.com",
  projectId: "peshawar-restaurant",
  storageBucket: "peshawar-restaurant.firebasestorage.app",
  messagingSenderId: "187443319280",
  appId: "1:187443319280:web:504a6f22885d6e94e2cd35",
  measurementId: "G-9XTLWVX1H8"
}

// Initialize Firebase
let app, db, auth, storage, analytics

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  db = getFirestore(app)
  storage = getStorage(app)

  try {
    auth = initializeAuth(app, { persistence: browserLocalPersistence })
  } catch (e) {
    auth = getAuth(app)
  }

  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app)
    } catch (err) {}
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export { db, auth, storage, analytics, app }

