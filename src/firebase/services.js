import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from 'firebase/auth'
import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, setDoc, onSnapshot
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from './config'

const firestoreInstance = db

// ===== SAMPLE DATA =====
export const FAMOUS_PESHAWARI_RECIPES = [
  {
    id: 'r1',
    name: 'Charsi Tikka',
    origin: 'Namak Mandi',
    prepTime: '45 Mins',
    difficulty: 'Master Heritage',
    description: 'Famous charcoal-grilled lamb tikka seasoned with coarse sea salt and animal fat.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ingredients: ['Fresh Lamb Meat', 'Coarse Sea Salt', 'Charcoal Pit Heat', 'Lamb Fat'],
    steps: ['Select fresh lamb ribs and leg meat.', 'Thread onto iron skewers with fat.', 'Grill over hot wood charcoal embers.', 'Season exclusively with natural salt.']
  },
  {
    id: 'r2',
    name: 'Kabuli Pulao',
    origin: 'Afghan Heritage',
    prepTime: '60 Mins',
    difficulty: 'Heritage Classic',
    description: 'Slow-cooked Sella basmati rice with tender lamb shank, caramelized carrots and sweet raisins.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    ingredients: ['Sella Basmati Rice', 'Mutton Shank', 'Caramelized Carrots', 'Black Raisins', 'Green Cardamom'],
    steps: ['Braise lamb shanks until melt-in-mouth soft.', 'Caramelize julienned carrots & raisins in ghee.', 'Layer spiced rice over broth & steam on low heat (Dum).']
  },
  {
    id: 'r3',
    name: 'Shinwari Karahi',
    origin: 'Landi Kotal',
    prepTime: '30 Mins',
    difficulty: 'High Flame',
    description: 'Authentic wok-fried mutton karahi prepared with fresh tomatoes, green chilies, and pure ghee.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    ingredients: ['Fresh Goat Mutton', 'Ripe Tomatoes', 'Pure Desi Ghee', 'Green Chilies', 'Black Pepper'],
    steps: ['Shear mutton chunks in piping hot ghee.', 'Cover with whole tomatoes until skins peel off.', 'Reduce gravy on high flame with salt & green chilis.']
  },
  {
    id: 'r4',
    name: 'Chapli Kebab',
    origin: 'Peshawar Saddar',
    prepTime: '40 Mins',
    difficulty: 'Street Master',
    description: 'Flat minced beef kebab infused with pomegranate seeds, crushed coriander, and tomato slices.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    ingredients: ['Minced Beef', 'Anardana (Pomegranate)', 'Crushed Coriander', 'Sliced Tomatoes', 'Beef Tallow'],
    steps: ['Knead beef mince with ground spices & eggs.', 'Press flat by hand into large discs.', 'Shallow fry in sizzling beef tallow until crisp.']
  },
]

export const SAMPLE_RESTAURANTS = [
  { id:'1', name:'Charsi Tikka', image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', cuisine:'Pakistani', rating:4.8, reviews:567, location:'Namak Mandi, Peshawar', address:'Namak Mandi Market, Old City, Peshawar', phone:'+92 300 1234567', email:'info@charsitikka.com', priceRange:'$$', isOpen:true, openingHours:'11:00 AM - 11:00 PM', specialDish:'Charsi Tikka', specialDishPrice:'Rs. 800', description:'Experience the authentic taste of Peshawar.', isActive:true, status:'approved' },
  { id:'2', name:'Kabul Restaurant', image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', cuisine:'Afghan', rating:4.5, reviews:234, location:'University Road, Peshawar', address:'Opposite Islamia College, University Road', phone:'+92 301 9876543', email:'contact@kabul.pk', priceRange:'$$', isOpen:true, openingHours:'12:00 PM - 11:30 PM', specialDish:'Kabuli Pulao', specialDishPrice:'Rs. 750', description:'Authentic Afghan cuisine.', isActive:true, status:'approved' },
  { id:'3', name:'Dragon Palace', image:'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', cuisine:'Chinese', rating:4.2, reviews:189, location:'Hayatabad, Peshawar', address:'Phase 3 Chowk, Hayatabad', phone:'+92 333 4455667', email:'info@dragonpalace.pk', priceRange:'$$$', isOpen:true, openingHours:'01:00 PM - 11:00 PM', specialDish:'Kung Pao Chicken', specialDishPrice:'Rs. 900', description:'Premium Chinese dining.', isActive:true, status:'approved' },
  { id:'4', name:'Peshawar Karahi', image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', cuisine:'Traditional', rating:4.6, reviews:345, location:'Cantt, Peshawar', address:'Saddar Road, Peshawar Cantt', phone:'+92 321 5544332', email:'pkr@peshawarkarahi.com', priceRange:'$$', isOpen:false, openingHours:'12:00 PM - 12:00 AM', specialDish:'Mutton Karahi', specialDishPrice:'Rs. 1300', description:'Famous for karahi cooked in pure ghee.', isActive:true, status:'approved' },
  { id:'5', name:'Burger Hub', image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', cuisine:'Fast Food', rating:4.3, reviews:412, location:'University Town, Peshawar', address:'Main Jamrud Road, University Town', phone:'+92 345 1122334', email:'orders@burgerhub.pk', priceRange:'$', isOpen:true, openingHours:'11:00 AM - 02:00 AM', specialDish:'Classic Burger', specialDishPrice:'Rs. 450', description:'Juicy handcrafted burgers.', isActive:true, status:'approved' },
  { id:'6', name:'Lahori Grill', image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', cuisine:'Pakistani', rating:4.7, reviews:678, location:'Sadar, Peshawar', address:'Fakhr-e-Alam Road, Sadar', phone:'+92 312 9988776', email:'info@lahorigrill.com', priceRange:'$$', isOpen:true, openingHours:'12:00 PM - 11:00 PM', specialDish:'Chicken Biryani', specialDishPrice:'Rs. 500', description:'Bringing flavors of Lahore to Peshawar.', isActive:true, status:'approved' },
]

const SAMPLE_USERS = [
  { id:'u1', name:'Ahmed Khan', email:'ahmed@example.com', role:'customer' },
  { id:'u2', name:'Sara Ali', email:'sara@example.com', role:'owner' },
  { id:'u3', name:'Admin User', email:'admin@peshawareats.com', role:'admin' },
]

const SAMPLE_DISHES = [
  { id:'d1', restaurantId:'1', name:'Charsi Tikka', price:'Rs. 800', category:'BBQ', available:true, image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
  { id:'d2', restaurantId:'1', name:'Kabuli Pulao', price:'Rs. 600', category:'Rice', available:true },
  { id:'d3', restaurantId:'1', name:'Mutton Karahi', price:'Rs. 1200', category:'Curry', available:true },
  { id:'d4', restaurantId:'2', name:'Afghan Lamb Kebab', price:'Rs. 950', category:'BBQ', available:true },
  { id:'d5', restaurantId:'3', name:'Kung Pao Chicken', price:'Rs. 900', category:'Curry', available:true },
]

// ===== AUTH =====
export const registerUser = async (email, password, name, role = 'customer') => {
  try {
    console.log('Starting registration for:', email)
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    console.log('Firebase Auth user created:', cred.user.uid)

    await updateProfile(cred.user, { displayName: name })
    console.log('Profile updated with name:', name)

    const userDoc = { uid: cred.user.uid, name, email, role, createdAt: serverTimestamp() }
    await setDoc(doc(firestoreInstance, 'users', cred.user.uid), userDoc)
    console.log('User document saved to Firestore:', userDoc)

    // Verify the document was saved
    const docSnap = await getDoc(doc(firestoreInstance, 'users', cred.user.uid))
    if (docSnap.exists()) {
      console.log('✅ User document verified in Firestore')
    } else {
      console.error('❌ User document NOT found in Firestore after save!')
    }

    return { success: true, user: cred.user }
  } catch (error) {
    console.error('❌ Registration error:', error.code, error.message)
    return { success: false, error: error.message }
  }
}

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login for:', email)
    const cred = await signInWithEmailAndPassword(auth, email, password)
    console.log('✅ Firebase Auth login successful:', cred.user.email, cred.user.uid)

    // Verify user data exists in Firestore
    const docSnap = await getDoc(doc(firestoreInstance, 'users', cred.user.uid))
    if (docSnap.exists()) {
      console.log('✅ User data found in Firestore')
    } else {
      console.error('❌ User data NOT found in Firestore after login!')
    }

    return { success: true, user: cred.user }
  } catch (error) {
    console.error('❌ Login error:', error.code, error.message)
    return { success: false, error: error.message }
  }
}

export const logoutUser = async () => {
  try { await signOut(auth); return { success: true } }
  catch (error) { return { success: false, error: error.message } }
}

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)
export const getCurrentUser = () => auth.currentUser

// ===== USER DATA =====
export const getUserData = async (uid) => {
  try {
    const snap = await getDoc(doc(firestoreInstance, 'users', uid))
    if (snap.exists()) return { success: true, userData: { id: snap.id, ...snap.data() } }
    const basic = { uid, role: 'customer', name: auth.currentUser?.displayName || '', email: auth.currentUser?.email || '' }
    await setDoc(doc(firestoreInstance, 'users', uid), { ...basic, createdAt: serverTimestamp() })
    return { success: true, userData: basic }
  } catch { return { success: true, userData: { uid, role: 'customer' } } }
}

export const getAllUsers = async () => {
  try {
    console.log('🔄 Fetching all users from Firestore...')
    const snap = await getDocs(collection(firestoreInstance, 'users'))
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    console.log(`✅ Retrieved ${list.length} users from Firestore`)
    return { success: true, users: list }
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    return { success: false, error: error.message, users: [] }
  }
}

// ===== RESTAURANTS =====
export const getApprovedRestaurants = async () => {
  try {
    const snap = await getDocs(collection(firestoreInstance, 'restaurants'))
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    return { success: true, restaurants: list.length > 0 ? list : SAMPLE_RESTAURANTS }
  } catch { return { success: true, restaurants: SAMPLE_RESTAURANTS } }
}

export const getAllRestaurants = async () => {
  try {
    const snap = await getDocs(collection(firestoreInstance, 'restaurants'))
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    return { success: true, restaurants: list.length > 0 ? list : SAMPLE_RESTAURANTS }
  } catch { return { success: true, restaurants: SAMPLE_RESTAURANTS } }
}

export const getRestaurantById = async (id) => {
  try {
    const snap = await getDoc(doc(firestoreInstance, 'restaurants', id))
    if (snap.exists()) return { success: true, restaurant: { id: snap.id, ...snap.data() } }
    const sample = SAMPLE_RESTAURANTS.find(r => r.id === id)
    return sample ? { success: true, restaurant: sample } : { success: false, error: 'Not found' }
  } catch {
    const sample = SAMPLE_RESTAURANTS.find(r => r.id === id)
    return sample ? { success: true, restaurant: sample } : { success: false, error: 'Not found' }
  }
}

export const getRestaurantsByOwner = async (ownerId) => {
  try {
    const q = query(collection(firestoreInstance, 'restaurants'), where('ownerId', '==', ownerId))
    const snap = await getDocs(q)
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    return { success: true, restaurants: list }
  } catch (error) { return { success: false, error: error.message, restaurants: [] } }
}

export const registerRestaurant = async (data, ownerId) => {
  try {
    const docRef = await addDoc(collection(firestoreInstance, 'restaurants'), { ...data, ownerId, rating: 0, reviews: 0, totalReviews: 0, isActive: true, status: 'approved', createdAt: serverTimestamp() })
    const userSnap = await getDoc(doc(firestoreInstance, 'users', ownerId))
    const existingRole = userSnap.exists() ? userSnap.data()?.role : 'customer'
    const finalRole = existingRole === 'admin' ? 'admin' : 'owner'
    await updateDoc(doc(firestoreInstance, 'users', ownerId), { role: finalRole, restaurantId: docRef.id })
    return { success: true, restaurantId: docRef.id }
  } catch (error) { return { success: false, error: error.message } }
}

export const updateUserProfile = async (uid, data) => {
  try {
    if (auth.currentUser && data.name) {
      await updateProfile(auth.currentUser, { displayName: data.name })
    }
    await updateDoc(doc(firestoreInstance, 'users', uid), { ...data, updatedAt: serverTimestamp() })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const registerNewRestaurant = async (ownerId, data) => {
  return registerRestaurant(data, ownerId)
}

export const updateRestaurantInfo = async (id, data) => {
  try {
    await updateDoc(doc(firestoreInstance, 'restaurants', id), { ...data, updatedAt: serverTimestamp() })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export const updateRestaurantStatus = async (id, isActive) => {
  try {
    await updateDoc(doc(firestoreInstance, 'restaurants', id), { isActive })
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

export const deleteRestaurantAdmin = async (id) => {
  try {
    await deleteDoc(doc(firestoreInstance, 'restaurants', id))
    return { success: true }
  } catch (error) { return { success: false, error: error.message } }
}

// ===== DISHES =====
export const getDishesByRestaurant = async (restaurantId) => {
  try {
    const q = query(collection(firestoreInstance, 'dishes'), where('restaurantId', '==', restaurantId))
    const snap = await getDocs(q)
    const list = []
    snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    if (list.length > 0) return { success: true, dishes: list }
    return { success: true, dishes: SAMPLE_DISHES.filter(d => d.restaurantId === restaurantId) }
  } catch { return { success: true, dishes: SAMPLE_DISHES.filter(d => d.restaurantId === restaurantId) } }
}

export const addDish = async (dish, restaurantId) => {
  try {
    const ref = await addDoc(collection(firestoreInstance, 'dishes'), { ...dish, restaurantId, createdAt: serverTimestamp() })
    return { success: true, dishId: ref.id }
  } catch (error) { return { success: false, error: error.message } }
}

export const deleteDish = async (dishId) => {
  try { await deleteDoc(doc(firestoreInstance, 'dishes', dishId)); return { success: true } }
  catch (error) { return { success: false, error: error.message } }
}

export const toggleDishAvailability = async (dishId, currentState) => {
  try { await updateDoc(doc(firestoreInstance, 'dishes', dishId), { available: !currentState }); return { success: true } }
  catch (error) { return { success: false, error: error.message } }
}

// ===== REVIEWS =====
export const getReviewsByRestaurant = async (restaurantId) => {
  try {
    let list = []
    try {
      const q = query(collection(firestoreInstance, 'reviews'), where('restaurantId', '==', restaurantId), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
    } catch (idxErr) {
      // Fallback without orderBy if composite index missing
      const q = query(collection(firestoreInstance, 'reviews'), where('restaurantId', '==', restaurantId))
      const snap = await getDocs(q)
      snap.forEach(d => list.push({ id: d.id, ...d.data() }))
      list.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return dateB - dateA
      })
    }
    return { success: true, reviews: list }
  } catch (error) {
    return { success: false, error: error.message, reviews: [] }
  }
}

export const addReview = async ({ restaurantId, userId, userName, rating, comment }) => {
  try {
    const numRating = Number(rating) || 5
    await addDoc(collection(firestoreInstance, 'reviews'), {
      restaurantId,
      userId,
      name: userName || 'Food Lover',
      rating: numRating,
      comment,
      createdAt: serverTimestamp()
    })
    
    // Recalculate average rating for restaurant
    const revSnap = await getDocs(query(collection(firestoreInstance, 'reviews'), where('restaurantId', '==', restaurantId)))
    const revs = revSnap.docs.map(d => d.data())
    if (revs.length > 0) {
      const totalSum = revs.reduce((a, r) => a + (Number(r.rating) || 0), 0)
      const avg = (totalSum / revs.length).toFixed(1)
      await updateDoc(doc(firestoreInstance, 'restaurants', restaurantId), {
        rating: parseFloat(avg),
        totalReviews: revs.length,
        reviews: revs.length,
        updatedAt: serverTimestamp()
      })
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== IMAGE UPLOAD =====
export const uploadRestaurantImage = async (file, restaurantId) => {
  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `restaurant_${restaurantId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `restaurants/${restaurantId}/${fileName}`)
    
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const uploadDishImage = async (file, restaurantId, dishId) => {
  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `dish_${dishId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `restaurants/${restaurantId}/dishes/${fileName}`)
    
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const uploadUserProfileImage = async (file, userId) => {
  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `user_${userId}_${Date.now()}.${fileExtension}`
    const storageRef = ref(storage, `users/${userId}/${fileName}`)
    
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== ORDER MANAGEMENT =====
export const createOrder = async (orderData) => {
  try {
    console.log('🔄 Creating order with data:', orderData)
    const orderRef = await addDoc(collection(firestoreInstance, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    console.log('✅ Order created successfully with ID:', orderRef.id)
    return { success: true, orderId: orderRef.id }
  } catch (error) {
    console.error('❌ Error creating order:', error)
    return { success: false, error: error.message }
  }
}

export const getOrdersByRestaurant = async (restaurantId) => {
  try {
    let orders = []
    try {
      const q = query(
        collection(firestoreInstance, 'orders'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (idxError) {
      // Fallback without orderBy if composite index missing
      const q = query(
        collection(firestoreInstance, 'orders'),
        where('restaurantId', '==', restaurantId)
      )
      const snapshot = await getDocs(q)
      orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return dateB - dateA
      })
    }
    return { success: true, orders }
  } catch (error) {
    return { success: false, error: error.message, orders: [] }
  }
}

export const getOrdersByCustomer = async (userId) => {
  try {
    console.log('🔄 Fetching orders for customer:', userId)
    const q = query(
      collection(firestoreInstance, 'orders'),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || a.createdAt || 0
      const dateB = b.createdAt?.toDate?.() || b.createdAt || 0
      return dateB - dateA
    })
    console.log(`✅ Retrieved ${orders.length} orders for customer`)
    return { success: true, orders }
  } catch (error) {
    console.error('❌ Error fetching customer orders:', error)
    return { success: false, error: error.message, orders: [] }
  }
}

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(firestoreInstance, 'orders', orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== REAL-TIME LISTENERS =====
export const listenToOrdersByRestaurant = (restaurantId, callback) => {
  try {
    const q = query(
      collection(firestoreInstance, 'orders'),
      where('restaurantId', '==', restaurantId)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return dateB - dateA
      })
      callback(orders)
    }, (error) => {
      console.error('❌ Error listening to orders:', error)
      callback([])
    })
    return unsubscribe
  } catch (error) {
    console.error('❌ Error setting up order listener:', error)
    return () => {}
  }
}

export const listenToOrdersByCustomer = (userId, callback) => {
  try {
    const q = query(
      collection(firestoreInstance, 'orders'),
      where('userId', '==', userId)
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || a.createdAt || 0
        const dateB = b.createdAt?.toDate?.() || b.createdAt || 0
        return dateB - dateA
      })
      callback(orders)
    }, (error) => {
      console.error('❌ Error listening to customer orders:', error)
      callback([])
    })
    return unsubscribe
  } catch (error) {
    console.error('❌ Error setting up customer order listener:', error)
    return () => {}
  }
}

export const getOrderById = async (orderId) => {
  try {
    const docSnap = await getDoc(doc(firestoreInstance, 'orders', orderId))
    if (docSnap.exists()) {
      return { success: true, order: { id: docSnap.id, ...docSnap.data() } }
    }
    return { success: false, error: 'Order not found' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== BOOKINGS MANAGEMENT =====
export const createBooking = async (bookingData) => {
  try {
    console.log('🔄 Creating table booking:', bookingData)
    const ref = await addDoc(collection(firestoreInstance, 'bookings'), {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp()
    })
    console.log('✅ Booking created with ID:', ref.id)
    return { success: true, bookingId: ref.id }
  } catch (error) {
    console.error('❌ Error creating booking:', error)
    return { success: false, error: error.message }
  }
}

export const getBookingsByRestaurant = async (restaurantId) => {
  try {
    const q = query(
      collection(firestoreInstance, 'bookings'),
      where('restaurantId', '==', restaurantId)
    )
    const snapshot = await getDocs(q)
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
      return dateB - dateA
    })
    return { success: true, bookings }
  } catch (error) {
    return { success: false, error: error.message, bookings: [] }
  }
}

export const getBookingsByCustomer = async (userId) => {
  try {
    const q = query(
      collection(firestoreInstance, 'bookings'),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
      return dateB - dateA
    })
    return { success: true, bookings }
  } catch (error) {
    return { success: false, error: error.message, bookings: [] }
  }
}

export const updateBookingStatus = async (bookingId, status) => {
  try {
    await updateDoc(doc(firestoreInstance, 'bookings', bookingId), {
      status,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
