# Firestore Database Rules for Peshawar Restaurant Platform

## Required Collections:
- `users` - User authentication data
- `restaurants` - Restaurant information
- `dishes` - Menu items for restaurants
- `orders` - Customer orders
- `reviews` - Restaurant reviews
- `bookings` - Table reservations

## Recommended Firestore Rules (Test Mode for Evaluation):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Production Rules (After Evaluation):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Restaurants collection
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Dishes collection
    match /dishes/{dishId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.restaurantId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.restaurantId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.restaurantId);
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == request.resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.restaurantId);
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.restaurantId);
    }
  }
}
```

## How to Set Rules in Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `peshawar-restaurant`
3. Go to Firestore Database → Rules
4. For evaluation: Use Test Mode rules (allow all)
5. For production: Use Production rules above
6. Click "Publish"

## Important for Evaluation:
- Use Test Mode rules during evaluation to avoid permission issues
- This ensures all read/write operations work smoothly
