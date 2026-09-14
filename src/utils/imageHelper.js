export const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
export const DEFAULT_DISH_IMAGE = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'

export const getValidImageUrl = (imageOrRestaurant, fallback) => {
  if (typeof imageOrRestaurant === 'string') {
    return imageOrRestaurant || fallback
  }
  if (typeof imageOrRestaurant === 'object' && imageOrRestaurant !== null) {
    return imageOrRestaurant.image || fallback
  }
  return fallback
}

export const handleImageError = (e, fallback) => {
  e.target.src = fallback || DEFAULT_RESTAURANT_IMAGE
}
