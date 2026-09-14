import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('peshawar_cart')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('peshawar_cart', JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart', e)
    }
  }, [cartItems])

  const addToCart = (dish, restaurant) => {
    setCartItems(prev => {
      // Check if item from same or different restaurant
      const existing = prev.find(item => item.id === dish.id)
      if (existing) {
        return prev.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [
          ...prev,
          {
            ...dish,
            quantity: 1,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
          }
        ]
      }
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (dishId) => {
    setCartItems(prev => prev.filter(item => item.id !== dishId))
  }

  const updateQuantity = (dishId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === dishId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Parse numeric price from string e.g. "Rs. 800" or 800
  const getItemPrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal
    if (!priceVal) return 0
    const num = parseInt(priceVal.toString().replace(/[^0-9]/g, ''), 10)
    return isNaN(num) ? 0 : num
  }

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + getItemPrice(item.price) * item.quantity, 0)
  }

  const getTotalCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotalCount,
        getItemPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
