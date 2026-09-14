import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from './config'

export const PESHAWAR_RESTAURANTS = [
  {
    id: 'charsi-tikka',
    name: 'Charsi Tikka',
    cuisine: 'Pakistani / BBQ',
    location: 'Namak Mandi, Peshawar',
    address: 'Namak Mandi Chowk, Qissa Khwani Bazaar, Peshawar',
    phone: '+92-91-2560100',
    whatsapp: '923009001234',
    email: 'charsitikka@gmail.com',
    openingHours: '12:00 PM - 12:00 AM',
    priceRange: '$$',
    rating: 4.8,
    reviews: 1250,
    totalReviews: 1250,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Charsi Mutton Tikka',
    specialDishPrice: 'Rs. 1,200',
    description: 'Peshawar\'s most iconic tikka restaurant, nestled in the heart of Namak Mandi. Famous for its charcoal-grilled Charsi Tikka — a secret spice blend passed down through generations. The smoky aroma of fresh mutton tikka has made this a must-visit destination for food lovers from across Pakistan.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    tags: ['BBQ', 'Mutton', 'Traditional', 'Landmark'],
    area: 'Namak Mandi',
    featured: true,
  },
  {
    id: 'shinwari-hotel',
    name: 'Shinwari Hotel',
    cuisine: 'Shinwari / Afghan',
    location: 'Karkhano Market, Peshawar',
    address: 'Karkhano Market, GT Road, Peshawar',
    phone: '+92-91-2580200',
    whatsapp: '923009002345',
    email: 'shinwarihotel@gmail.com',
    openingHours: '11:00 AM - 11:00 PM',
    priceRange: '$$',
    rating: 4.7,
    reviews: 980,
    totalReviews: 980,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Shinwari Karahi',
    specialDishPrice: 'Rs. 1,800',
    description: 'Authentic Shinwari cuisine at its finest. Known for the legendary Shinwari Karahi cooked in pure desi ghee with fresh tomatoes, this restaurant brings the flavors of the Khyber tribal belt to the heart of Peshawar. A favorite among locals and visitors alike.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    tags: ['Karahi', 'Shinwari', 'Ghee', 'Traditional'],
    area: 'Karkhano',
    featured: true,
  },
  {
    id: 'kabul-restaurant',
    name: 'Kabul Restaurant',
    cuisine: 'Afghan / Central Asian',
    location: 'University Road, Peshawar',
    address: 'Opposite Islamia College, University Road, Peshawar',
    phone: '+92-91-5702300',
    whatsapp: '923009003456',
    email: 'kabulrestaurant@gmail.com',
    openingHours: '12:00 PM - 11:30 PM',
    priceRange: '$$',
    rating: 4.6,
    reviews: 720,
    totalReviews: 720,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Kabuli Pulao',
    specialDishPrice: 'Rs. 900',
    description: 'Bringing authentic Afghan flavors to Peshawar since 1985. Our Kabuli Pulao is made from the finest Basmati rice slow-cooked with tender lamb, caramelized carrots, and raisins. Also famous for Mantu dumplings and Afghan green tea.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    tags: ['Afghan', 'Pulao', 'Mantu', 'Traditional'],
    area: 'University Road',
    featured: true,
  },
  {
    id: 'namak-mandi-karahi',
    name: 'Namak Mandi Karahi',
    cuisine: 'Pakistani / Karahi',
    location: 'Namak Mandi, Peshawar',
    address: 'Main Namak Mandi Bazaar, Old City, Peshawar',
    phone: '+92-91-2561400',
    whatsapp: '923009004567',
    email: 'namakmandikarahi@gmail.com',
    openingHours: '12:00 PM - 01:00 AM',
    priceRange: '$$',
    rating: 4.7,
    reviews: 890,
    totalReviews: 890,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Mutton Karahi',
    specialDishPrice: 'Rs. 2,200',
    description: 'Located in the famous Namak Mandi food street, this restaurant has been serving authentic Peshawari Karahi for over 40 years. Our Mutton Karahi is cooked live on demand in a traditional iron wok over a wood fire. The secret? Pure desi ghee and freshly ground spices.',
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=800&q=80',
    tags: ['Karahi', 'Mutton', 'Live Cooking', 'Famous'],
    area: 'Namak Mandi',
    featured: true,
  },
  {
    id: 'khyber-restaurant',
    name: 'Khyber Restaurant',
    cuisine: 'Pakistani / Multi-cuisine',
    location: 'Saddar, Peshawar',
    address: 'Fakhr-e-Alam Road, Saddar, Peshawar',
    phone: '+92-91-5270500',
    whatsapp: '923009005678',
    email: 'khyberrestaurant@gmail.com',
    openingHours: '11:00 AM - 11:00 PM',
    priceRange: '$$$',
    rating: 4.5,
    reviews: 650,
    totalReviews: 650,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Dumpukht',
    specialDishPrice: 'Rs. 2,800',
    description: 'Peshawar\'s premier fine dining destination. Khyber Restaurant offers an elegant atmosphere combined with authentic Peshawari cuisine. The signature Dumpukht — slow-cooked lamb sealed in a dough pot — is a culinary masterpiece. Perfect for family gatherings and special occasions.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    tags: ['Fine Dining', 'Dumpukht', 'Family', 'Premium'],
    area: 'Saddar',
    featured: true,
  },
  {
    id: 'chapli-kebab-house',
    name: 'Chapli Kebab House',
    cuisine: 'Pakistani / Street Food',
    location: 'Charsadda Road, Peshawar',
    address: 'Main Charsadda Road, Near Tehkal, Peshawar',
    phone: '+92-91-2590600',
    whatsapp: '923009006789',
    email: 'chaplikebab@gmail.com',
    openingHours: '10:00 AM - 12:00 AM',
    priceRange: '$',
    rating: 4.9,
    reviews: 2100,
    totalReviews: 2100,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Original Chapli Kebab',
    specialDishPrice: 'Rs. 150/piece',
    description: 'The original Chapli Kebab — a Peshawar institution. Made from hand-minced beef mixed with pomegranate seeds, fresh tomatoes, and secret spices, then pan-fried in pure tallow. Each kebab is crispy on the outside, juicy inside. Served with fresh naan, salad and chutney.',
    image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
    tags: ['Chapli Kebab', 'Street Food', 'Budget', 'Famous'],
    area: 'Charsadda Road',
    featured: true,
  },
  {
    id: 'hayatabad-biryani',
    name: 'Hayatabad Biryani Center',
    cuisine: 'Pakistani / Biryani',
    location: 'Hayatabad, Peshawar',
    address: 'Phase 3, Hayatabad, Peshawar',
    phone: '+92-91-5810700',
    whatsapp: '923009007890',
    email: 'hayatabadbiyani@gmail.com',
    openingHours: '12:00 PM - 11:00 PM',
    priceRange: '$',
    rating: 4.5,
    reviews: 560,
    totalReviews: 560,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Peshawari Chicken Biryani',
    specialDishPrice: 'Rs. 450',
    description: 'Serving Peshawar-style Biryani since 2005. Our rice is cooked with aromatic whole spices, saffron, and tender chicken pieces marinated for 24 hours. Different from Karachi or Lahori biryani — lighter, more fragrant, and uniquely Peshawari.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    tags: ['Biryani', 'Chicken', 'Rice', 'Popular'],
    area: 'Hayatabad',
    featured: false,
  },
  {
    id: 'qissa-khwani-cafe',
    name: 'Qissa Khwani Café',
    cuisine: 'Café / Snacks',
    location: 'Qissa Khwani Bazaar, Peshawar',
    address: 'Qissa Khwani Bazaar, Old City, Peshawar',
    phone: '+92-91-2562800',
    whatsapp: '923009008901',
    email: 'qissakhwanicafe@gmail.com',
    openingHours: '09:00 AM - 11:00 PM',
    priceRange: '$',
    rating: 4.4,
    reviews: 430,
    totalReviews: 430,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Peshawari Kahwa',
    specialDishPrice: 'Rs. 120',
    description: 'Located on the historic Qissa Khwani Bazaar — the Street of Storytellers — this café preserves the ancient tradition of Peshawari hospitality. Famous for aromatic Peshawari Kahwa (green tea with saffron, cardamom and almonds), fresh naan, and traditional sweets.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    tags: ['Café', 'Kahwa', 'Traditional', 'Historic'],
    area: 'Qissa Khwani',
    featured: false,
  },
  {
    id: 'pizza-point-pesh',
    name: 'Pizza Point Peshawar',
    cuisine: 'Fast Food / Pizza',
    location: 'University Road, Peshawar',
    address: 'Near Peshawar University Gate, University Road',
    phone: '+92-91-5703900',
    whatsapp: '923009009012',
    email: 'pizzapoint.pesh@gmail.com',
    openingHours: '11:00 AM - 02:00 AM',
    priceRange: '$$',
    rating: 4.2,
    reviews: 380,
    totalReviews: 380,
    isOpen: true,
    isActive: true,
    status: 'approved',
    specialDish: 'Peshawari Spicy Pizza',
    specialDishPrice: 'Rs. 850',
    description: 'Fusion at its best — traditional Peshawari flavors meet Italian pizza. Our Peshawari Spicy Pizza features chapli kebab toppings, green chutney base, and mozzarella cheese. Also serving burgers, pasta, and milkshakes. Popular with students and young professionals.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    tags: ['Pizza', 'Fast Food', 'Fusion', 'Students'],
    area: 'University Road',
    featured: false,
  },
  {
    id: 'landi-kotal-dumpukht',
    name: 'Landi Kotal Dumpukht',
    cuisine: 'Tribal / Traditional',
    location: 'Khyber Road, Peshawar',
    address: 'Khyber Road, Near Board Stop, Peshawar',
    phone: '+92-91-2564100',
    whatsapp: '923009010123',
    email: 'landikotal.pesh@gmail.com',
    openingHours: '01:00 PM - 11:00 PM',
    priceRange: '$$$',
    rating: 4.8,
    reviews: 340,
    totalReviews: 340,
    isOpen: false,
    isActive: true,
    status: 'approved',
    specialDish: 'Lamb Dumpukht',
    specialDishPrice: 'Rs. 3,500',
    description: 'Authentic tribal cuisine from the Khyber region. The Dumpukht is prepared using the ancient "dum" cooking technique — lamb sealed with dough in a heavy pot and slow-cooked for 6 hours over charcoal. The result is fall-off-the-bone tender meat infused with aromatic herbs.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    tags: ['Dumpukht', 'Tribal', 'Slow Cooked', 'Premium'],
    area: 'Khyber Road',
    featured: false,
  },
]

export const PESHAWAR_DISHES = {
  'charsi-tikka': [
    { name: 'Charsi Mutton Tikka', price: 'Rs. 1,200', category: 'BBQ', available: true, description: 'Signature charcoal-grilled mutton tikka with secret spice blend' },
    { name: 'Chicken Tikka', price: 'Rs. 800', category: 'BBQ', available: true, description: 'Juicy chicken pieces marinated and grilled to perfection' },
    { name: 'Seekh Kebab', price: 'Rs. 600', category: 'BBQ', available: true, description: 'Minced mutton kebabs with fresh herbs' },
    { name: 'Naan', price: 'Rs. 30', category: 'Bread', available: true, description: 'Freshly baked traditional naan' },
    { name: 'Raita', price: 'Rs. 80', category: 'Side', available: true, description: 'Yogurt with mint and spices' },
  ],
  'shinwari-hotel': [
    { name: 'Shinwari Karahi', price: 'Rs. 1,800', category: 'Karahi', available: true, description: 'Classic Shinwari karahi in pure desi ghee' },
    { name: 'Mutton Pulao', price: 'Rs. 1,200', category: 'Rice', available: true, description: 'Fragrant rice with tender mutton pieces' },
    { name: 'Lamb Chops', price: 'Rs. 1,500', category: 'BBQ', available: true, description: 'Grilled lamb chops with Shinwari spices' },
    { name: 'Afghan Naan', price: 'Rs. 50', category: 'Bread', available: true, description: 'Thick traditional Afghan-style naan' },
  ],
}

// Seed function — call this once to populate Firebase
export const seedRestaurants = async () => {
  try {
    console.log('Starting seed...')
    let added = 0

    // Provision connected test accounts (Admin, Owner, Customer)
    let adminUid = null
    let ownerUid = null
    let customerUid = null

    try {
      const { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('./config')

      // Helper function to create or fetch account UID
      const getOrCreateUser = async (email, password, displayName, role) => {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password)
          if (displayName) await updateProfile(cred.user, { displayName })
          await setDoc(doc(db, 'users', cred.user.uid), {
            uid: cred.user.uid,
            name: displayName,
            email,
            role,
            createdAt: new Date(),
          })
          console.log(`✅ Created test account: ${email} (${role})`)
          return cred.user.uid
        } catch (err) {
          if (err.code === 'auth/email-already-in-use') {
            try {
              const cred = await signInWithEmailAndPassword(auth, email, password)
              await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                name: displayName,
                email,
                role,
                updatedAt: new Date(),
              }, { merge: true })
              console.log(`ℹ️ Account ${email} already exists — updated Firestore role (${role})`)
              return cred.user.uid
            } catch (loginErr) {
              console.warn(`Could not sign in existing user ${email}:`, loginErr.message)
            }
          } else {
            console.warn(`Auth error for ${email}:`, err.message)
          }
          return null
        }
      }

      adminUid = await getOrCreateUser('imaazdev00@gmail.com', 'maaz@3172007', 'Maaz Khan (Admin)', 'admin')
      ownerUid = await getOrCreateUser('owner@peshawareats.com', 'owner123', 'Charsi Tikka Manager', 'owner')
      customerUid = await getOrCreateUser('customer@peshawareats.com', 'customer123', 'Peshawar Foodie', 'customer')

    } catch (authError) {
      console.warn('Auth provisioning warning:', authError.message)
    }

    // Seed restaurants with ownerId assigned for charsi-tikka
    for (const restaurant of PESHAWAR_RESTAURANTS) {
      const { id, ...data } = restaurant
      const restaurantData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Assign ownerId for Charsi Tikka to the test owner account
      if (id === 'charsi-tikka' && ownerUid) {
        restaurantData.ownerId = ownerUid
      }

      await setDoc(doc(db, 'restaurants', id), restaurantData)
      added++
      console.log(`✅ Added: ${restaurant.name}`)
    }

    // Link restaurantId to owner user document
    if (ownerUid) {
      await setDoc(doc(db, 'users', ownerUid), { restaurantId: 'charsi-tikka' }, { merge: true })
    }

    // Add dishes
    for (const [restaurantId, dishes] of Object.entries(PESHAWAR_DISHES)) {
      for (const dish of dishes) {
        await addDoc(collection(db, 'dishes'), {
          ...dish,
          restaurantId,
          createdAt: new Date(),
        })
      }
      console.log(`✅ Added dishes for: ${restaurantId}`)
    }

    // Seed connected test orders if customerUid exists
    if (customerUid) {
      const sampleOrders = [
        {
          customerId: customerUid,
          customerName: 'Peshawar Foodie',
          customerEmail: 'customer@peshawareats.com',
          customerPhone: '+92-300-1122334',
          deliveryAddress: 'House 45, Street 12, Phase 3, Hayatabad, Peshawar',
          restaurantId: 'charsi-tikka',
          restaurantName: 'Charsi Tikka',
          items: [
            { name: 'Charsi Mutton Tikka', price: 1200, quantity: 2, subtotal: 2400 },
            { name: 'Fresh Naan', price: 30, quantity: 4, subtotal: 120 }
          ],
          totalAmount: 2520,
          paymentMethod: 'Cash on Delivery',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          customerId: customerUid,
          customerName: 'Peshawar Foodie',
          customerEmail: 'customer@peshawareats.com',
          customerPhone: '+92-300-1122334',
          deliveryAddress: 'House 45, Street 12, Phase 3, Hayatabad, Peshawar',
          restaurantId: 'charsi-tikka',
          restaurantName: 'Charsi Tikka',
          items: [
            { name: 'Seekh Kebab', price: 600, quantity: 2, subtotal: 1200 }
          ],
          totalAmount: 1200,
          paymentMethod: 'Cash on Delivery',
          status: 'preparing',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(),
        }
      ]

      for (const orderData of sampleOrders) {
        await addDoc(collection(db, 'orders'), orderData)
      }
      console.log('✅ Added connected sample orders between Customer and Charsi Tikka Owner')
    }

    console.log(`✅ Seed complete! Added ${added} restaurants and test accounts.`)
    return { success: true, count: added }
  } catch (error) {
    console.error('Seed error:', error)
    return { success: false, error: error.message }
  }
}
