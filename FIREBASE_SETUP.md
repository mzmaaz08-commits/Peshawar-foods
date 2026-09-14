# Firebase Setup Guide

## Option 1: Firebase Console (Recommended for beginners)

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Login with your Google account

2. **Create New Project**
   - Click "Add project"
   - Project name: `peshawar-restaurants`
   - Disable Google Analytics (optional)
   - Click "Create project"
   - Wait for project to be ready

3. **Setup Firestore Database**
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose location (select nearest to your users)
   - Choose "Start in Test mode" (for development)
   - Click "Enable"

4. **Setup Authentication**
   - Go to "Build" → "Authentication"
   - Click "Get Started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password":
     - Click on "Email/Password"
     - Enable the toggle
     - Click "Save"

5. **Setup Storage**
   - Go to "Build" → "Storage"
   - Click "Get Started"
   - Choose "Start in Test mode"
   - Select default location
   - Click "Done"

6. **Get Firebase Config**
   - Click on project settings (gear icon)
   - Scroll to "Your apps" section
   - Click on "</>" (Web) icon
   - App nickname: `peshawar-restaurants-web`
   - Click "Register app"
   - Copy the `firebaseConfig` object
   - Click "Continue to console"

7. **Update Config in Project**
   - Open `src/firebase/config.js`
   - Replace the placeholder config with your actual config
   - Save the file

## Option 2: Firebase CLI (For advanced users)

### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Login to Firebase:
```bash
firebase login
```

### Initialize Firebase:
```bash
cd peshawar-restaurants
firebase init
```

Follow the prompts:
- Select "Firestore"
- Select "Authentication" 
- Select "Storage"
- Select "Hosting" (optional)
- Use existing project or create new one

### Deploy (if using hosting):
```bash
npm run build
firebase deploy
```

## Firestore Security Rules

### Development Rules (Test Mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules:
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

## Storage Security Rules

### Development Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /restaurants/{restaurantId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /dishes/{dishId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### "Permission denied" errors:
- Check Firestore rules in Firebase Console
- Make sure Authentication is properly configured
- Verify user is logged in

### "Network error" issues:
- Check your internet connection
- Verify Firebase project location
- Check if Firebase services are enabled

### Config not working:
- Double-check API key and project ID
- Make sure config is properly formatted
- Check for typos in config values

## Next Steps After Setup

1. Update `src/firebase/config.js` with your config
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Test authentication (login/register)
5. Test database operations (create restaurant)
6. Test image upload functionality
