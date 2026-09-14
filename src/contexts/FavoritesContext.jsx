import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('peshawar_fav_restaurants')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('peshawar_fav_restaurants', JSON.stringify(favorites))
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e)
    }
  }, [favorites])

  const toggleFavorite = (restaurantId) => {
    setFavorites(prev => {
      if (prev.includes(restaurantId)) {
        return prev.filter(id => id !== restaurantId)
      } else {
        return [...prev, restaurantId]
      }
    })
  }

  const isFavorite = (restaurantId) => {
    return favorites.includes(restaurantId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
