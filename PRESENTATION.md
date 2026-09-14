# 🍖 Peshawar Foods & Shinwari Explorer
## Complete Project Presentation
### Developed by: Maaz Khan | Frontend Developer Intern

---

## 📌 SLIDE 1 — PROJECT OVERVIEW

### Project Title
**Peshawar Foods & Shinwari Explorer**
*A Full-Stack Restaurant Discovery & Management Platform*

### One-Line Description
> "A professional web platform that connects food lovers with Peshawar's finest restaurants — while giving restaurant owners powerful tools to manage their business online."

### Category
Full-Stack Web Application

### Developer
**Maaz Khan** — Frontend Developer
- Email: imaazdev00@gmail.com
- GitHub: github.com/mzmaaz08-commits
- LinkedIn: linkedin.com/in/maaz-khan-155559407

---

## 📌 SLIDE 2 — PROBLEM STATEMENT

### The Problem
Peshawar is famous for its legendary cuisine — Charsi Tikka, Shinwari Karahi, Chapli Kebab, Dumpukht. But:

- ❌ No dedicated digital platform for Peshawar restaurants
- ❌ Food lovers have no way to discover restaurants online
- ❌ Restaurant owners have no digital presence
- ❌ No online menu, reviews, or booking system
- ❌ Tourists and visitors struggle to find authentic food spots

### The Solution
**Peshawar Foods & Shinwari Explorer** — a complete digital ecosystem for Peshawar's food industry.

---

## 📌 SLIDE 3 — WHAT WE BUILT

### Platform Type
Multi-tenant Full-Stack Web Application

### Three Types of Users

| User Type | What They Can Do |
|-----------|-----------------|
| 🍽️ **Customer/Visitor** | Browse restaurants, read reviews, search by cuisine, view menus |
| 🏪 **Restaurant Owner** | Register restaurant, manage menu, view reviews, update info |
| 👑 **Admin (Maaz Khan)** | Manage all restaurants, all users, platform analytics |

---

## 📌 SLIDE 4 — TECHNOLOGY STACK

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js 18** | UI Framework — component-based architecture |
| **Vite** | Build tool — fast development server |
| **Tailwind CSS** | Utility-first styling framework |
| **Framer Motion** | Smooth animations and page transitions |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| **Firebase Authentication** | User registration, login, security |
| **Firebase Firestore** | Real-time NoSQL database |
| **Firebase Storage** | Image/file storage |

### Additional Libraries
| Library | Purpose |
|---------|---------|
| **React Router DOM** | Client-side routing |
| **Lucide React** | Icon library |
| **React Context API** | Global state management |

### Architecture Pattern
**JAMstack** — JavaScript + APIs + Markup
- Serverless backend via Firebase
- Real-time data sync
- Role-based access control

---

## 📌 SLIDE 5 — KEY FEATURES

### 🔐 Authentication System
- Email/password registration
- Role-based accounts (Admin / Owner / Customer)
- Protected routes — unauthorized users redirected
- Persistent login sessions

### 🏠 Home Page
- Professional dark theme with animated grid background
- Vertical shimmer effect on grid lines
- Hero section with search bar
- Real-time restaurant listing
- Cuisine category filters
- Statistics counter (150+ restaurants, 5000+ users)
- Features showcase

### 🔍 Restaurant Discovery
- Browse all restaurants with grid/list view toggle
- Advanced filters: Cuisine, Price Range, Open Now
- Sort by: Rating, Reviews, Name
- Real-time search
- Restaurant cards with: Image, Rating, Location, Price Range, Open/Closed status

### 🍽️ Restaurant Detail Page
- Full restaurant information
- Menu with dish categories
- Customer reviews with star ratings
- Review submission (authenticated users)
- Rating breakdown chart
- WhatsApp contact integration
- Google Maps direction link
- Share restaurant feature

### 🏪 Restaurant Owner Dashboard
- Register restaurant (3-step wizard)
- Edit restaurant info (hours, description, contact)
- Add/remove dishes from menu
- Toggle dish availability
- View customer reviews
- Restaurant status (Open/Closed toggle)

### 👑 Admin Dashboard
- Platform-wide statistics
- All restaurants management
- Activate/Deactivate restaurants
- Delete restaurants
- All users list with roles
- Review analytics

### 🎨 Design System
- Dark professional theme (#0a0a0f background)
- Orange (#FF6B35) as primary brand color
- Glassmorphism card effects
- Animated grid background
- Slow vertical shimmer on grid lines
- Smooth page transitions
- Fully responsive (Mobile + Tablet + Desktop)

---

## 📌 SLIDE 6 — DATABASE STRUCTURE

### Firebase Firestore Collections

```
📁 restaurants/
   ├── id (auto)
   ├── name
   ├── cuisine
   ├── location / address
   ├── phone / whatsapp / email
   ├── rating / totalReviews
   ├── openingHours
   ├── priceRange ($, $$, $$$)
   ├── specialDish / specialDishPrice
   ├── image (URL)
   ├── isOpen (boolean)
   ├── isActive (boolean)
   ├── ownerId (reference to user)
   └── createdAt

📁 users/
   ├── uid (Firebase Auth UID)
   ├── name / email
   ├── role (admin / owner / customer)
   └── createdAt

📁 dishes/
   ├── restaurantId (reference)
   ├── name / price / category
   ├── available (boolean)
   └── image (URL)

📁 reviews/
   ├── restaurantId (reference)
   ├── userId / userName
   ├── rating (1-5)
   ├── comment
   └── createdAt
```

---

## 📌 SLIDE 7 — REAL DATA

### 10 Real Peshawar Restaurants Added

| # | Restaurant | Cuisine | Location | Rating |
|---|-----------|---------|----------|--------|
| 1 | Charsi Tikka | Pakistani/BBQ | Namak Mandi | ⭐ 4.8 |
| 2 | Shinwari Hotel | Shinwari/Afghan | Karkhano | ⭐ 4.7 |
| 3 | Kabul Restaurant | Afghan | University Road | ⭐ 4.6 |
| 4 | Namak Mandi Karahi | Pakistani | Namak Mandi | ⭐ 4.7 |
| 5 | Khyber Restaurant | Fine Dining | Saddar | ⭐ 4.5 |
| 6 | Chapli Kebab House | Street Food | Charsadda Road | ⭐ 4.9 |
| 7 | Hayatabad Biryani | Biryani | Hayatabad | ⭐ 4.5 |
| 8 | Qissa Khwani Café | Café | Qissa Khwani | ⭐ 4.4 |
| 9 | Pizza Point | Fast Food | University Road | ⭐ 4.2 |
| 10 | Landi Kotal Dumpukht | Tribal/Traditional | Khyber Road | ⭐ 4.8 |

---

## 📌 SLIDE 8 — PROJECT STRUCTURE

```
peshawar-restaurants/
├── src/
│   ├── App.jsx              ← Main routing
│   ├── main.jsx             ← Entry point
│   ├── index.css            ← Global styles
│   │
│   ├── pages/
│   │   ├── Home.jsx                  ← Landing page
│   │   ├── RestaurantList.jsx        ← Browse restaurants
│   │   ├── RestaurantDetail.jsx      ← Single restaurant
│   │   ├── Login.jsx                 ← Sign in
│   │   ├── Register.jsx              ← Sign up
│   │   ├── RestaurantRegistration.jsx← Owner registers restaurant
│   │   ├── OwnerDashboard.jsx        ← Restaurant owner panel
│   │   └── AdminDashboard.jsx        ← Platform admin panel
│   │
│   ├── components/
│   │   ├── Navbar.jsx                ← Navigation bar
│   │   ├── CartDrawer.jsx            ← Shopping cart
│   │   ├── BookingModal.jsx          ← Table booking
│   │   ├── PeshawarMap.jsx           ← Restaurant map
│   │   └── ErrorBoundary.jsx        ← Error handling
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx           ← User authentication state
│   │   ├── CartContext.jsx           ← Cart state
│   │   ├── FavoritesContext.jsx      ← Favorites state
│   │   └── LanguageContext.jsx       ← Urdu/English toggle
│   │
│   └── firebase/
│       ├── config.js                 ← Firebase configuration
│       ├── services.js               ← All database functions
│       └── seedData.js               ← Sample data
│
├── index.html               ← HTML entry
├── vite.config.js           ← Build config
├── tailwind.config.js       ← CSS config
└── package.json             ← Dependencies
```

---

## 📌 SLIDE 9 — SECURITY FEATURES

### Authentication Security
- Firebase Authentication — industry standard
- JWT tokens automatically managed
- Passwords encrypted by Firebase

### Role-Based Access Control (RBAC)
```
Admin  → Can access everything
Owner  → Can only access their own restaurant
Customer → Can browse and review only
```

### Protected Routes
- `/admin` → Only admins
- `/dashboard` → Only owners + admins
- `/register-restaurant` → Must be logged in
- Reviews → Must be logged in

### Data Security
- Users can only edit their own data
- Restaurant owners can only edit their own restaurant
- Admin has full control

---

## 📌 SLIDE 10 — BUSINESS VALUE

### For Restaurant Owners
- ✅ **Free digital presence** — no website needed
- ✅ **Menu management** — update dishes online
- ✅ **Customer feedback** — see reviews instantly
- ✅ **WhatsApp integration** — direct customer contact

### For Customers
- ✅ **Discover** authentic Peshawar restaurants
- ✅ **Read reviews** before visiting
- ✅ **Find location** via Google Maps
- ✅ **Browse menu** before going

### For Business (Platform)
- ✅ **Commission model** possible — charge owners monthly fee
- ✅ **Advertising** — featured restaurant placements
- ✅ **Data insights** — Peshawar food industry analytics

### Market Opportunity
- Peshawar population: 2.5 million+
- No existing dedicated platform
- Growing smartphone usage in KPK
- Tourism potential (Khyber Pass, historic sites)

---

## 📌 SLIDE 11 — LEARNING OUTCOMES

### Technical Skills Demonstrated

| Skill | Implementation |
|-------|---------------|
| React.js | Component architecture, hooks, context |
| Firebase | Auth, Firestore, real-time data |
| CSS/Tailwind | Dark theme, glassmorphism, animations |
| Framer Motion | Page transitions, scroll animations |
| Routing | Protected routes, role-based navigation |
| State Management | Context API, useState, useEffect |
| Responsive Design | Mobile-first approach |
| UI/UX | Professional dark theme, user flows |

### Soft Skills
- Problem solving — debugging complex issues
- Project management — feature prioritization
- Design thinking — user experience focus
- Documentation — clear code comments

---

## 📌 SLIDE 12 — FUTURE ROADMAP

### Phase 2 Features (Next 3 months)
- [ ] Online food ordering system
- [ ] Table reservation/booking
- [ ] Payment integration (JazzCash/Easypaisa)
- [ ] Push notifications
- [ ] Restaurant analytics charts
- [ ] Photo upload (not just URL)

### Phase 3 Features (6 months)
- [ ] Mobile app (React Native)
- [ ] Delivery tracking
- [ ] Loyalty points system
- [ ] Multi-language (Pashto/Urdu/English)
- [ ] AI-powered recommendations

### Scaling Plan
- Deploy on Vercel/Firebase Hosting
- Custom domain: peshawarfoods.pk
- SEO optimization for Google ranking
- Social media marketing

---

## 📌 SLIDE 13 — DEMO CREDENTIALS

### Admin Account (Platform Manager)
```
Email:    imaazdev00@gmail.com
Password: maaz@3172007
URL:      /admin
```

### Demo Pages
```
Home:        http://localhost:5173/
Restaurants: http://localhost:5173/restaurants
Login:       http://localhost:5173/login
Register:    http://localhost:5173/register
Admin:       http://localhost:5173/admin
Dashboard:   http://localhost:5173/dashboard
```

---

## 📌 SLIDE 14 — CONCLUSION

### What Was Achieved
✅ Complete full-stack web application  
✅ Real Firebase backend with live data  
✅ Professional dark UI with animations  
✅ Three-tier user system (Admin/Owner/Customer)  
✅ 10 real Peshawar restaurants in database  
✅ Mobile responsive design  
✅ Secure authentication system  

### Project Impact
This platform has the potential to **digitize Peshawar's food industry** — connecting thousands of food lovers with authentic local restaurants while giving restaurant owners a free, powerful online presence.

### Personal Growth
As a **Frontend Developer** learning HTML, CSS, and JavaScript, this project demonstrates my ability to:
- Learn new technologies quickly (React, Firebase)
- Build real-world applications
- Think like a product developer
- Deliver professional-quality work

---

## 📌 THANK YOU

**Maaz Khan**  
Frontend Developer | Computer Science Student  
📧 imaazdev00@gmail.com  
🐙 github.com/mzmaaz08-commits  
💼 linkedin.com/in/maaz-khan-155559407  

> *"From learning HTML to building a full-stack platform — this project represents my growth, dedication, and passion for web development."*

---
*Peshawar Foods & Shinwari Explorer — Built with ❤️ for Peshawar*
