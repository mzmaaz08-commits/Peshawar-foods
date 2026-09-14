// Translation helper for dynamic data objects like Restaurants, Dishes, Categories, and Locations

const RESTAURANT_NAME_MAP = {
  'Charsi Tikka': 'چارسی تکہ',
  'Shinwari Hotel': 'شنواری ہوٹل',
  'Kabul Restaurant': 'کابل ریسٹورنٹ',
  'Namak Mandi Karahi': 'نمک منڈی کڑاہی',
  'Khyber Restaurant': 'خیبر ریسٹورنٹ',
  'Chapli Kebab House': 'چپلی کباب ہاؤس',
  'Chief Burger': 'چیف برگر',
  'Habibi Restaurant': 'حبیبی ریسٹورنٹ',
  'Khyber Pass Restaurant': 'خیبر پاس ریسٹورنٹ',
  'Namak Mandi Tikka House': 'نمک منڈی تکہ ہاؤس',
}

const CUISINE_MAP = {
  'Pakistani / BBQ': 'پاکستانی / باربی کیو',
  'Shinwari / Afghan': 'شنواری / افغانی',
  'Afghan / Central Asian': 'افغانی / سینٹرل ایشین',
  'Pakistani / Karahi': 'پاکستانی / کڑاہی',
  'Pakistani / Multi-cuisine': 'پاکستانی / مکسڈ پکوان',
  'Pakistani / Street Food': 'پاکستانی / اسٹریٹ فوڈ',
  'Fast Food / Burgers': 'فاسٹ فوڈ / برگرز',
  'Arabian / BBQ': 'عربی / باربی کیو',
  'Pakistani': 'پاکستانی',
  'Afghan': 'افغانی',
  'Chinese': 'چینی',
  'Fast Food': 'فاسٹ فوڈ',
  'BBQ': 'باربی کیو',
  'Traditional': 'روایتی',
  'Desserts': 'میٹھے پکوان',
  'Italian': 'اطالوی',
  'Continental': 'کانٹینینٹل',
  'Other': 'دیگر'
}

const SPECIAL_DISH_MAP = {
  'Charsi Mutton Tikka': 'چارسی مٹن تکہ',
  'Shinwari Karahi': 'شنواری کڑاہی',
  'Kabuli Pulao': 'کابلی پلاؤ',
  'Mutton Karahi': 'مٹن کڑاہی',
  'Dumpukht': 'دم پخت',
  'Original Chapli Kebab': 'اصلی چپلی کباب',
  'Chief Special Zinger Burger': 'چیف سپیشل زنگر برگر',
  'Mandi Platter': 'مندی پلیٹر',
}

const LOCATION_MAP = {
  'Namak Mandi, Peshawar': 'نمک منڈی، پشاور',
  'Karkhano Market, Peshawar': 'کارخانو مارکیٹ، پشاور',
  'University Road, Peshawar': 'یونیورسٹی روڈ، پشاور',
  'Saddar, Peshawar': 'صدر کینٹ، پشاور',
  'Charsadda Road, Peshawar': 'چارسدہ روڈ، پشاور',
  'Hayatabad, Peshawar': 'حیات آباد، پشاور',
  'Namak Mandi Chowk, Qissa Khwani Bazaar, Peshawar': 'نمک منڈی چوک، قصہ خوانی بازار، پشاور',
  'Karkhano Market, GT Road, Peshawar': 'کارخانو مارکیٹ، جی ٹی روڈ، پشاور',
  'Opposite Islamia College, University Road, Peshawar': 'اسلامیہ کالج کے سامنے، یونیورسٹی روڈ، پشاور',
  'Main Namak Mandi Bazaar, Old City, Peshawar': 'مین نمک منڈی بازار، پرانا شہر، پشاور',
  'Fakhr-e-Alam Road, Saddar, Peshawar': 'فخرِ عالم روڈ، صدر کینٹ، پشاور',
  'Main Charsadda Road, Near Tehkal, Peshawar': 'مین چارسدہ روڈ، نزدیک تحکال، پشاور',
  'Phase 3, Hayatabad, Peshawar': 'فیز 3، حیات آباد، پشاور',
  'Jamrud Road, Near University of Peshawar': 'جمرود روڈ، نزد یونیورسٹی آف پشاور'
}

const DISH_NAME_MAP = {
  'Special Charsi Mutton Tikka (1KG)': 'خاص چارسی مٹن تکہ (1 کلو)',
  'Shinwari Chicken Karahi (1KG)': 'شنواری چکن کڑاہی (1 کلو)',
  'Authentic Kabuli Pulao': 'خالص کابلی پلاؤ',
  'Peshawari Chapli Kebab (2 Pcs)': 'پشاوری چپلی کباب (2 عدد)',
  'Namak Mandi Mutton Dampukht': 'نمک منڈی مٹن دم پخت',
  'Fresh Mutton Tikka': 'تازہ مٹن تکہ',
  'Charsi Beef Tikka': 'چارسی بیف تکہ',
  'Desi Ghee Karahi': 'دیسی گھی کڑاہی',
  'Shinwari Mutton Karahi': 'شنواری مٹن کڑاہی',
  'Mantu Dumplings (10 Pcs)': 'منتو ڈمپلنگز (10 عدد)',
  'Afghani Green Tea (Kehwa)': 'افغانی سبز چائے (قہوہ)',
  'Special Zinger Burger': 'خاص زنگر برگر',
  'Double Beef Burger': 'ڈبل بیف برگر',
  'Loaded Fries': 'لوڈڈ فرائز',
  'Mutton Mandi': 'مٹن مندی',
  'Chicken Mandi Platter': 'چکن مندی پلیٹر',
}

const CATEGORY_MAP = {
  'BBQ': 'باربی کیو',
  'Rice': 'چاول',
  'Curry': 'سالن / کڑاہی',
  'Fast Food': 'فاسٹ فوڈ',
  'Drinks': 'مشروبات',
  'Desserts': 'میٹھے پکوان',
  'Starters': 'سٹارٹرز',
  'Other': 'دیگر',
  'All': 'تمام'
}

export const translateText = (text, isUrdu) => {
  if (!text || !isUrdu) return text
  return RESTAURANT_NAME_MAP[text] ||
         CUISINE_MAP[text] ||
         SPECIAL_DISH_MAP[text] ||
         LOCATION_MAP[text] ||
         DISH_NAME_MAP[text] ||
         CATEGORY_MAP[text] ||
         text
}

export const translateRestaurant = (restaurant, isUrdu) => {
  if (!restaurant || !isUrdu) return restaurant
  return {
    ...restaurant,
    name: RESTAURANT_NAME_MAP[restaurant.name] || restaurant.name,
    cuisine: CUISINE_MAP[restaurant.cuisine] || restaurant.cuisine,
    location: LOCATION_MAP[restaurant.location] || restaurant.location,
    address: LOCATION_MAP[restaurant.address] || restaurant.address,
    specialDish: SPECIAL_DISH_MAP[restaurant.specialDish] || restaurant.specialDish,
  }
}

export const translateDish = (dish, isUrdu) => {
  if (!dish || !isUrdu) return dish
  return {
    ...dish,
    name: DISH_NAME_MAP[dish.name] || dish.name,
    category: CATEGORY_MAP[dish.category] || dish.category,
  }
}
