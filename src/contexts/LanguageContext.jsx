import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

// Dictionary of translations for English and Urdu
const translations = {
  en: {
    // Nav & Common
    home: 'Home',
    restaurants: 'Restaurants',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    register: 'Register',
    registerRestaurant: 'Register Restaurant',
    favorites: 'Favorites',
    cart: 'Cart',
    logout: 'Sign Out',
    myOrders: 'My Orders',
    profile: 'My Profile',
    about: 'About',
    contact: 'Contact',
    quickLinks: 'Quick Links',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    
    // Home
    heroTitle: 'Discover Authentic Peshawar Flavors',
    heroSubtitle: 'From Namak Mandi Shinwari Karahi to Traditional Charsi Tikka — explore the finest dining experiences in Peshawar.',
    heroBadge: 'Peshawar 3D Gastronomy & Shinwari Explorer',
    searchPlaceholder: 'Search by restaurant name, dish, or cuisine (e.g. Chapli Kabab)...',
    exploreAll: 'Explore All Restaurants',
    featuredTitle: 'Featured Restaurants',
    featuredSubtitle: 'Hand-picked top dining destinations in Peshawar',
    categoriesTitle: 'Browse by Category',
    mapTitle: 'Explore Peshawar Food Locations',
    viewDetails: 'View Details',
    bookTable: 'Book a Table',
    addToCart: 'Add to Cart',

    // Restaurant List
    allCuisines: 'All Cuisines',
    allAreas: 'All Areas',
    allPrices: 'All Prices',
    searchRestaurants: 'Search restaurants...',
    favoritesOnly: 'Favorites Only',
    noRestaurantsFound: 'No restaurants match your filters.',
    clearFilters: 'Clear Filters',

    // Detail
    menu: 'Menu',
    reviews: 'Reviews',
    locationInfo: 'Location & Timing',
    getDirections: 'Get Directions on Map',
    openingHours: 'Opening Hours',
    address: 'Address',
    phone: 'Phone',
    averagePrice: 'Avg. Price',
    rating: 'Rating',
    addReview: 'Write a Review',
    yourRating: 'Your Rating',
    yourComment: 'Your Comment...',
    submitReview: 'Submit Review',
    placeOrderNow: 'Place Order Now',
    whatsappContact: 'WhatsApp Direct',
    allRestaurantsLink: 'All Restaurants',
    quickInfo: 'Quick Info',
    chefsSpecial: "Chef's Special",
    aboutRestaurant: 'About Restaurant',

    // Booking
    tableBooking: 'Table Reservation',
    selectDate: 'Select Date',
    selectTime: 'Select Time Slot',
    guestsCount: 'Number of Guests',
    specialRequests: 'Special Occasion / Requests',
    customerName: 'Your Full Name',
    customerPhone: 'Phone Number',
    confirmBooking: 'Confirm Reservation',
    bookingSuccess: 'Reservation Confirmed!',
    bookingRef: 'Reference Code',
    close: 'Close',

    // Cart & Orders
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    deliveryAddress: 'Delivery Address in Peshawar',
    contactNumber: 'Contact Number',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    onlineCard: 'Credit / Debit Card',
    placeOrder: 'Place Order',
    orderSuccess: 'Order Placed Successfully!',
    orderRef: 'Order Reference',

    // My Orders Page
    orderHistory: 'Order History',
    trackOrders: 'Track all your orders from Peshawar restaurants',
    noOrdersYet: 'No Orders Yet',
    noOrdersDesc: "You haven't placed any orders yet.",
    browseRestaurantsBtn: 'Browse Restaurants',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusPreparing: 'Preparing',
    statusReady: 'Ready',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',

    // Profile Page
    accountDetails: 'Account Details',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    accountRole: 'Account Role',
    memberSince: 'Member Since',
    adminPanel: 'Admin Panel',
    myDashboard: 'My Dashboard',
    listRestaurantBtn: 'List Restaurant',

    // Auth Pages
    welcomeBack: 'Welcome Back',
    signInDesc: 'Sign in to your account',
    password: 'Password',
    rememberMe: 'Remember me',
    signIn: 'Sign In',
    dontHaveAccount: "Don't have an account?",
    createOneFree: 'Create one free',
    createAccount: 'Create Account',
    joinSaaS: "Join Peshawar's premier multi-tenant 3D food platform",

    // Owner Dashboard
    ownerDashboardTitle: 'Restaurant Management Console',
    tabOverview: 'Overview',
    tabInfo: 'Restaurant Info',
    tabMenu: 'Menu Management',
    tabOrders: 'Orders',
    tabBookings: 'Bookings',
    tabReviews: 'Reviews',
    pendingBookings: 'Table Reservations',
    activeOrders: 'Online Food Orders',
    status: 'Status',
    accept: 'Accept',
    reject: 'Reject',
    startPreparing: 'Start Preparing',
    markReady: 'Mark Ready',
    markDelivered: 'Mark Delivered',
    addDishBtn: '+ Add New Dish',

    // Admin Dashboard
    adminPanelTitle: 'Admin System Control',
    totalRestaurants: 'Total Restaurants',
    totalUsers: 'Total Users',
    ordersPlaced: 'Orders Placed',
    bookingsMade: 'Bookings Made',

    // Misc
    signedInAs: 'Signed in as',
    openStatus: '● Open',
    closedStatus: '● Closed',
    interactiveMap: 'Interactive Map',
    footerRights: '© 2025 Peshawar Foods & Shinwari Explorer. Built for food lovers of Peshawar.',
    peshawarSpecialties: 'Peshawar Specialties',
    happyFoodLovers: 'Happy Food Lovers',
    reviewsAndRatings: 'Reviews & Ratings',
    areasCovered: 'Areas Covered',
    searchBtn: 'Search',
    all: 'All',
    liveTracking: 'Live Tracking',
    liveOrderProgress: 'Live Order Progress',
    orderCancelled: 'This order has been cancelled.',
    inProgress: 'In Progress...',
    peshawarAreas: {
      namakMandi: 'Namak Mandi',
      universityRoad: 'University Road',
      saddar: 'Saddar Cantt',
      hayatabad: 'Hayatabad',
      ringRoad: 'Ring Road',
      gulberg: 'Gulberg',
      khyberBazaar: 'Khyber Bazaar'
    }
  },
  ur: {
    // Nav & Common
    home: 'ہوم',
    restaurants: 'ریسٹورنٹس',
    dashboard: 'ڈیش بورڈ',
    admin: 'ایڈمن',
    login: 'لاگ ان',
    register: 'رجسٹر',
    registerRestaurant: 'ریسٹورنٹ رجسٹر کریں',
    favorites: 'پسندیدہ',
    cart: 'کارٹ',
    logout: 'سائن آؤٹ',
    myOrders: 'میرے آرڈرز',
    profile: 'میرا پروفائل',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    quickLinks: 'فوری لنکس',
    back: 'واپس',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    edit: 'ترمیم کریں',

    // Home
    heroTitle: 'پشاور کے اصل اور خالص ذائقے تلاش کریں',
    heroSubtitle: 'نمک منڈی شنواری کڑاہی سے لے کر روایتی چارسی تکہ اور چپلی کباب تک — پشاور کے بہترین کھانے دریافت کریں۔',
    heroBadge: 'پشاور 3D فوڈ اور شنواری ایکسپلورر',
    searchPlaceholder: 'ریسٹورنٹ، ڈش یا پکوان تلاش کریں (مثلاً چپلی کباب)...',
    exploreAll: 'تمام ریسٹورنٹس دیکھیں',
    featuredTitle: 'نمایاں ریسٹورنٹس',
    featuredSubtitle: 'پشاور کے بہترین اور مقبول ترین کھانے کے مراکز',
    categoriesTitle: 'اقسام کے لحاظ سے براؤز کریں',
    mapTitle: 'پشاور کے فوڈ لوکیشنز دیکھیں',
    viewDetails: 'تفصیلات دیکھیں',
    bookTable: 'ٹیبل بُک کریں',
    addToCart: 'کارٹ میں شامل کریں',

    // Restaurant List
    allCuisines: 'تمام پکوان',
    allAreas: 'تمام علاقے',
    allPrices: 'تمام قیمتیں',
    searchRestaurants: 'ریسٹورنٹس تلاش کریں...',
    favoritesOnly: 'صرف پسندیدہ',
    noRestaurantsFound: 'کوئی ریسٹورنٹ نہیں ملا۔',
    clearFilters: 'فلٹر صاف کریں',

    // Detail
    menu: 'مینو',
    reviews: 'رائے / ریویوز',
    locationInfo: 'مقام اور اوقات',
    getDirections: 'نقشے پر لوکیشن دیکھیں',
    openingHours: 'اوقاتِ کار',
    address: 'پتہ',
    phone: 'فون نمبر',
    averagePrice: 'اوسط قیمت',
    rating: 'ریٹنگ',
    addReview: 'اپنی رائے تحریر کریں',
    yourRating: 'آپ کی ریٹنگ',
    yourComment: 'آپ کا تبصرہ...',
    submitReview: 'رائے جمع کرائیں',
    placeOrderNow: 'ابھی آرڈر کریں',
    whatsappContact: 'واٹس ایپ پر رابطہ کریں',
    allRestaurantsLink: 'تمام ریسٹورنٹس',
    quickInfo: 'فوری معلومات',
    chefsSpecial: 'شیف کی خاص ڈش',
    aboutRestaurant: 'ریسٹورنٹ کے بارے میں',

    // Booking
    tableBooking: 'ٹیبل بکنگ',
    selectDate: 'تاریخ منتخب کریں',
    selectTime: 'وقت منتخب کریں',
    guestsCount: 'مہمانوں کی تعداد',
    specialRequests: 'خاص درخواست / موقع',
    customerName: 'آپ کا پورا نام',
    customerPhone: 'فون نمبر',
    confirmBooking: 'بکنگ کی تصدیق کریں',
    bookingSuccess: 'بکنگ ہو گئی ہے!',
    bookingRef: 'ریفرنس کوڈ',
    close: 'بند کریں',

    // Cart & Orders
    yourCart: 'آپ کا کارٹ',
    cartEmpty: 'آپ کا کارٹ خالی ہے',
    subtotal: 'سب ٹوٹل',
    deliveryFee: 'ڈیلیوری چارجز',
    total: 'کل رقم',
    deliveryAddress: 'پشاور میں ڈیلیوری کا پتہ',
    contactNumber: 'رابطہ نمبر',
    paymentMethod: 'ادائیگی کا طریقہ',
    cashOnDelivery: 'کیش آن ڈیلیوری',
    onlineCard: 'کریڈٹ / ڈیبٹ کارڈ',
    placeOrder: 'آرڈر کنفرم کریں',
    orderSuccess: 'آرڈر موصول ہو گیا!',
    orderRef: 'آرڈر نمبر',

    // My Orders Page
    orderHistory: 'آرڈر ہسٹری',
    trackOrders: 'پشاور کے ریسٹورنٹس سے اپنے تمام آرڈرز کو ٹریک کریں',
    noOrdersYet: 'ابھی کوئی آرڈر نہیں',
    noOrdersDesc: 'آپ نے ابھی تک کوئی آرڈر نہیں دیا ہے۔',
    browseRestaurantsBtn: 'ریسٹورنٹس براؤز کریں',
    statusPending: 'زیرِ التواء',
    statusConfirmed: 'منظور شدہ',
    statusPreparing: 'تَیاری جاری',
    statusReady: 'تَیار ہے',
    statusDelivered: 'ڈیلیور ہو گیا',
    statusCancelled: 'منسوخ',

    // Profile Page
    accountDetails: 'اکاؤنٹ کی تفصیلات',
    fullName: 'پورا نام',
    emailAddress: 'ای میل پتہ',
    accountRole: 'اکاؤنٹ کا کردار',
    memberSince: 'رکنیت کا سال',
    adminPanel: 'ایڈمن پینل',
    myDashboard: 'میرا ڈیش بورڈ',
    listRestaurantBtn: 'ریسٹورنٹ شامل کریں',

    // Auth Pages
    welcomeBack: 'خوش آمدید',
    signInDesc: 'اپنے اکاؤنٹ میں لاگ ان کریں',
    password: 'پاس ورڈ',
    rememberMe: 'مجھے یاد رکھیں',
    signIn: 'لاگ ان کریں',
    dontHaveAccount: 'کیا اکاؤنٹ نہیں ہے؟',
    createOneFree: 'مفت اکاؤنٹ بنائیں',
    createAccount: 'اکاؤنٹ بنائیں',
    joinSaaS: 'پشاور کے 3D فوڈ پلیٹ فارم میں شامل ہوں',

    // Owner Dashboard
    ownerDashboardTitle: 'ریسٹورنٹ مینجمنٹ ڈیش بورڈ',
    tabOverview: 'اوور ویو',
    tabInfo: 'ریسٹورنٹ معلومات',
    tabMenu: 'مینو مینجمنٹ',
    tabOrders: 'آن لائن آرڈرز',
    tabBookings: 'ٹیبل بکنگز',
    tabReviews: 'کسٹمر ریویوز',
    pendingBookings: 'ٹیبل بکنگز',
    activeOrders: 'آن لائن فوڈ آرڈرز',
    status: 'سٹیٹس',
    accept: 'منظور کریں',
    reject: 'مسترد کریں',
    startPreparing: 'تَیاری شروع کریں',
    markReady: 'تَیار مارک کریں',
    markDelivered: 'ڈیلیور مارک کریں',
    addDishBtn: '+ نئی ڈش شامل کریں',

    // Admin Dashboard
    adminPanelTitle: 'ایڈمن سسٹم ڈیش بورڈ',
    totalRestaurants: 'کل ریسٹورنٹس',
    totalUsers: 'کل صارفین',
    ordersPlaced: 'کل آرڈرز',
    bookingsMade: 'کل ٹیبل بکنگز',

    // Misc
    signedInAs: 'بطور سائن ان',
    openStatus: '● کُھلا ہے',
    closedStatus: '● بند ہے',
    interactiveMap: 'انٹرایکٹیو نقشہ',
    footerRights: '© 2025 پشاور فوڈز اینڈ شنواری ایکسپلورر۔ پشاور کے شائقینِ طعام کے لیے خاص طور پر تیار کردہ۔',
    peshawarSpecialties: 'پشاور کی خاص ڈشز',
    happyFoodLovers: 'خوش کسٹمرز',
    reviewsAndRatings: 'ریویوز اور ریٹنگز',
    areasCovered: 'احاطہ شدہ علاقے',
    searchBtn: 'تلاش کریں',
    all: 'سب',
    liveTracking: 'لائیو ٹریکنگ',
    liveOrderProgress: 'لائیو آرڈر کی صورتحال',
    orderCancelled: 'یہ آرڈر منسوخ کر دیا گیا ہے۔',
    inProgress: '۔۔کا انتظار کریں',
    peshawarAreas: {
      namakMandi: 'نمک منڈی',
      universityRoad: 'یونیورسٹی روڈ',
      saddar: 'صدر کینٹ',
      hayatabad: 'حیات آباد',
      ringRoad: 'رنگ روڈ',
      gulberg: 'گلبدگ',
      khyberBazaar: 'خیبر بازار'
    }
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('peshawar_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('peshawar_lang', language)
    if (language === 'ur') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ur'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = 'en'
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'))
  }

  const t = (path) => {
    const keys = path.split('.')
    let current = translations[language]
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key]
      } else {
        // Fallback to English if translation key missing
        let fallback = translations['en']
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey]
          } else {
            return path
          }
        }
        return fallback
      }
    }
    return current
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isUrdu: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
