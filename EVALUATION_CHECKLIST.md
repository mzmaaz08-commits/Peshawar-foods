# 🔍 Evaluation Checklist - 100% Ready Guide

## ⚠️ CRITICAL: Firebase Console Setup (Do This First!)

### **Step 1: Firestore Database Rules**
1. Firebase Console: https://console.firebase.google.com/
2. Project: `peshawar-restaurant`
3. Firestore Database → Rules
4. Paste these rules for evaluation (Test Mode):
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
5. Click "Publish"

### **Step 2: Authentication Enable**
1. Build → Authentication → Sign-in method
2. Enable "Email/Password"
3. Save

---

## ✅ Pre-Evaluation Test Steps

### **1. User Registration Test**
- [ ] Go to `/register`
- [ ] Select "Restaurant Owner" role
- [ ] Fill: Name, Email, Password (min 6 chars)
- [ ] Submit registration
- [ ] Check Firebase Console → Authentication → Users (user should appear)
- [ ] Check Firestore → users collection (user document should appear)

### **2. Restaurant Registration Test**
- [ ] After registration, should redirect to `/register-restaurant`
- [ ] Fill restaurant details (use image URL for speed)
- [ ] Submit registration
- [ ] Check Firestore → restaurants collection (restaurant should appear)
- [ ] Should redirect to `/dashboard`

### **3. Owner Dashboard Test**
- [ ] Login as owner
- [ ] Navigate to `/dashboard`
- [ ] Check Overview tab (stats should show)
- [ ] Check Restaurant Info tab (details should load)
- [ ] Check Menu tab (add a dish)
- [ ] Check Orders tab (empty initially)
- [ ] Check Reviews tab (empty initially)

### **4. Customer Registration Test**
- [ ] Logout
- [ ] Register as "Food Lover & Guest"
- [ ] Should redirect to `/restaurants`

### **5. Order Placement Test**
- [ ] Go to restaurant detail page
- [ ] Add dish to cart
- [ ] Click "Place Order"
- [ ] Fill order form (Name, Phone, Address)
- [ ] Submit order
- [ ] Check Firestore → orders collection (order should appear)
- [ ] Check owner dashboard → Orders tab (order should appear)

### **6. Navigation Test**
- [ ] Test all navbar links
- [ ] Test footer links
- [ ] Test restaurant cards
- [ ] Test profile page
- [ ] Test about/contact pages

---

## 🐛 Common Issues & Solutions

### **Issue: Account not persisting**
**Solution:**
- Check Firebase Console → Authentication → Users
- Check browser console for errors
- Ensure Firestore rules are set to allow all

### **Issue: Restaurant not saving**
**Solution:**
- Check Firestore → restaurants collection
- Ensure user is logged in as owner
- Check browser console for errors

### **Issue: Orders not appearing**
**Solution:**
- Check Firestore → orders collection
- Ensure user is logged in
- Check owner dashboard refresh

### **Issue: Dashboard access denied**
**Solution:**
- Check user role in Firestore → users collection
- Ensure role is set to 'owner'
- Logout and login again

---

## 📱 Evaluation Demo Flow

### **Demo 1: Restaurant Owner Flow**
1. Register as owner
2. Register restaurant
3. Add dishes to menu
4. Show dashboard features
5. Show order management

### **Demo 2: Customer Flow**
1. Register as customer
2. Browse restaurants
3. Add to cart
4. Place order
5. Show order tracking

### **Demo 3: Admin Flow (if needed)**
1. Login as admin
2. Show admin dashboard
3. Show restaurant approvals
4. Show user management

---

## 🔧 Quick Fixes During Evaluation

### **If Firebase connection fails:**
- Check internet connection
- Verify Firebase project ID: `peshawar-restaurant`
- Check Firebase Console status

### **If authentication fails:**
- Check email/password
- Check Firebase Console → Authentication
- Try clearing browser cache

### **If data not saving:**
- Check Firestore rules
- Check browser console errors
- Refresh page and try again

---

## 📊 Final Verification

Before evaluation starts, verify:

- [ ] Firebase Console rules are set to Test Mode
- [ ] Authentication is enabled
- [ ] All console errors are resolved
- [ ] All pages load without errors
- [ ] All forms submit successfully
- [ ] All navigation works
- [ ] Data persists in Firestore

---

## 🎯 Success Criteria

✅ User can register and login
✅ Owner can register restaurant
✅ Owner can manage menu
✅ Customer can place orders
✅ Owner can see orders
✅ All data persists in Firebase
✅ No console errors
✅ All navigation works

---

**Follow this checklist for 100% evaluation success!** 🚀
