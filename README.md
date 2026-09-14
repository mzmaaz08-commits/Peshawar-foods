# Peshawar Restaurants - Full Stack Restaurant Discovery Platform

A modern, animated restaurant discovery platform for Peshawar, featuring restaurant listings, owner dashboards, and user reviews. Built with React, Firebase, and modern UI libraries.

## 🚀 Features

### For Users (Tourists & Food Lovers)
- **Restaurant Discovery**: Browse all Peshawar restaurants with beautiful animations
- **Advanced Search**: Filter by cuisine type, price range, and location
- **Restaurant Details**: View detailed information, special dishes, and reviews
- **Reviews & Ratings**: Read and write authentic restaurant reviews
- **Favorites**: Save favorite restaurants for quick access

### For Restaurant Owners
- **Easy Registration**: Simple 3-step restaurant registration process
- **CRUD Dashboard**: Complete control over restaurant information
- **Menu Management**: Add, edit, and remove dishes with pricing
- **Analytics**: Track views, orders, and customer engagement
- **Review Management**: Monitor and respond to customer reviews

### Technical Features
- **Modern Animations**: Smooth transitions using Framer Motion
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Database**: Firebase Firestore for instant updates
- **Secure Authentication**: Firebase Auth for user management
- **Image Storage**: Firebase Storage for restaurant and dish images
- **Single Page Application**: Fast navigation with React Router

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS, Custom CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Database**: NoSQL (Firestore)

## 📋 Prerequisites

Before you begin, ensure you have the following:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Firebase project (free tier works)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/peshawar-restaurants.git
   cd peshawar-restaurants
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Enable Storage
   - Get your Firebase config object
   - Replace the config in `src/firebase/config.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
peshawar-restaurants/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.jsx
│   ├── firebase/           # Firebase configuration
│   │   └── config.js
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── RestaurantList.jsx
│   │   ├── RestaurantDetail.jsx
│   │   ├── OwnerDashboard.jsx
│   │   ├── RestaurantRegistration.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔥 Firebase Configuration

### Database Schema

#### Restaurants Collection
```javascript
{
  id: "restaurant_id",
  name: "Restaurant Name",
  cuisine: "Pakistani",
  description: "Restaurant description",
  address: "Full address",
  phone: "+92 300 1234567",
  email: "restaurant@email.com",
  openingHours: "11:00 AM - 11:00 PM",
  priceRange: "$$",
  image: "image_url",
  ownerId: "user_id",
  rating: 4.5,
  totalReviews: 100,
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Dishes Collection
```javascript
{
  id: "dish_id",
  restaurantId: "restaurant_id",
  name: "Dish Name",
  description: "Dish description",
  price: "Rs. 800",
  category: "BBQ",
  image: "image_url",
  isAvailable: true,
  isSpecial: true,
  createdAt: timestamp
}
```

#### Users Collection
```javascript
{
  id: "user_id",
  name: "User Name",
  email: "user@email.com",
  role: "owner" | "customer",
  restaurantId: "restaurant_id", // for owners
  favoriteRestaurants: ["restaurant_id1", "restaurant_id2"],
  createdAt: timestamp
}
```

#### Reviews Collection
```javascript
{
  id: "review_id",
  restaurantId: "restaurant_id",
  userId: "user_id",
  userName: "User Name",
  rating: 5,
  comment: "Review text",
  createdAt: timestamp
}
```

### Firestore Rules

Basic security rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    
    match /dishes/{dishId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#FF6B35',    // Orange
      secondary: '#004E89',  // Blue
      accent: '#F7C59F',      // Light orange
      dark: '#1A1A2E',        // Dark blue
      light: '#F8F9FA'       // Light gray
    }
  }
}
```

### Firebase Config
Update `src/firebase/config.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The built files in `dist/` can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 📱 Features Roadmap

- [ ] Google Maps integration for restaurant locations
- [ ] Table reservation system
- [ ] Online ordering integration
- [ ] Payment gateway (Stripe)
- [ ] Multi-language support (Urdu/English)
- [ ] Admin panel for platform management
- [ ] Advanced analytics dashboard
- [ ] Push notifications
- [ ] Social sharing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@peshawareats.com or create an issue in the repository.

## 🙏 Acknowledgments

- Peshawar restaurant community
- Firebase for the amazing backend services
- React community for excellent libraries

---

Built with ❤️ for Peshawar's food scene
