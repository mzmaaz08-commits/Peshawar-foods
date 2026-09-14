import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { onAuthChange, logoutUser, getUserData } from '../firebase/services'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthContext: Setting up auth state listener')

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user')

      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch role & extra data from Firestore
        try {
          const result = await getUserData(firebaseUser.uid)
          if (result?.success && result.userData) {
            setUserData(result.userData)
          } else {
            // Firestore blocked — use Firebase Auth data as fallback
            setUserData({
              uid: firebaseUser.uid,
              role: 'customer',
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || ''
            })
          }
        } catch (e) {
          // Always keep user logged in even if Firestore fails
          setUserData({
            uid: firebaseUser.uid,
            role: 'customer',
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || ''
          })
        }
      } else {
        console.log('🔒 No user logged in')
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
      console.log('✅ AuthContext loading complete')
    })

    return () => {
      console.log('🔄 AuthContext: Cleaning up auth listener')
      unsubscribe()
    }
  }, [])

  const logout = async () => {
    console.log('🔄 Logging out user')
    const result = await logoutUser()
    if (result.success) {
      setUser(null)
      setUserData(null)
      console.log('✅ User logged out successfully')
    }
    return result
  }

  const refreshUserData = async () => {
    if (user) {
      console.log('🔄 Refreshing user data for:', user.uid)
      const result = await getUserData(user.uid)
      if (result.success) {
        setUserData(result.userData)
        console.log('✅ User data refreshed')
      }
    }
  }

  const value = useMemo(() => ({
    user,
    userData,
    loading,
    logout,
    refreshUserData,
    isAuthenticated: !!user,
    isOwner: userData?.role === 'owner',
    isAdmin: userData?.role === 'admin',
    role: userData?.role || 'customer',
    currentUser: user,
    userRole: userData?.role || 'customer',
  }), [user, userData, loading])

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold tracking-wider text-[#c5a059]">Loading Peshawar Foods...</p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export default AuthContext
