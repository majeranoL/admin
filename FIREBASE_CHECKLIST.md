# Firebase Setup Checklist for Shelter Registration

## ✅ Code Implementation

- [x] Firebase SDK installed
- [x] Firebase config added
- [x] Auth, Firestore, Storage initialized
- [x] ShelterRegistration component created
- [x] Form validation implemented
- [x] File upload handling
- [x] Routes configured

## 🔧 Firebase Console Setup Required

To make the registration work, you need to configure these in your Firebase Console:

### 1. Enable Firebase Authentication

1. Go to: https://console.firebase.google.com/project/animal911-29427/authentication
2. Click "Get Started" if not already enabled
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Save changes

### 2. Create Firestore Database

1. Go to: https://console.firebase.google.com/project/animal911-29427/firestore
2. Click "Create database"
3. Choose "Start in production mode" or "Test mode"
   - **Test mode** (for development): Allows all reads/writes temporarily
   - **Production mode**: Requires security rules (see below)
4. Select a region (closest to your users)
5. Click "Enable"

### 3. Configure Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Shelters collection - anyone can create (register), only authenticated can read own
    match /shelters/{shelterId} {
      allow create: if request.auth == null; // Allow unauthenticated registration
      allow read, update: if request.auth != null && request.auth.uid == shelterId;
      allow delete: if false; // Only admins should delete (via admin SDK)
    }

    // Admins collection - only authenticated admins can read
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if false; // Only via admin SDK
    }

    // Other collections can be added as needed
    match /{document=**} {
      allow read, write: if false; // Deny all by default
    }
  }
}
```

### 4. Enable Firebase Storage

1. Go to: https://console.firebase.google.com/project/animal911-29427/storage
2. Click "Get Started"
3. Choose "Start in production mode" or "Test mode"
4. Select same region as Firestore
5. Click "Done"

### 5. Configure Storage Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Shelters can upload documents during registration
    match /shelters/{shelterId}/{allPaths=**} {
      allow create: if request.auth == null || request.auth.uid == shelterId;
      allow read: if request.auth != null; // Only authenticated users can view
      allow write, delete: if request.auth != null && request.auth.uid == shelterId;
    }

    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 🧪 Testing the Registration

### Test Registration Flow:

1. Navigate to `/register-shelter`
2. Fill in all required fields:
   - Shelter Name: "Test Animal Shelter"
   - Contact Person: "John Doe"
   - Address: "123 Main St, City"
   - Contact Number: "+639123456789"
   - Email: "test@shelter.com"
   - Password: "testpass123"
   - Confirm Password: "testpass123"
3. Upload test documents (JPG, PNG, or PDF files under 5MB)
4. Check "I agree to the terms and conditions"
5. Click "Register Shelter"

### Expected Results:

- ✅ Progress bar shows: 0% → 20% → 40% → 60% → 80% → 100%
- ✅ Success message: "Registration successful! Your application is pending admin approval."
- ✅ Redirects to login page after 3 seconds

### Verify in Firebase Console:

#### Check Authentication:

1. Go to: https://console.firebase.google.com/project/animal911-29427/authentication/users
2. You should see the new user with email "test@shelter.com"
3. Note the UID

#### Check Firestore:

1. Go to: https://console.firebase.google.com/project/animal911-29427/firestore/data
2. Look for collection: `shelters`
3. Look for document with ID matching the user's UID
4. Verify fields:
   ```
   - userId: [UID]
   - shelterName: "Test Animal Shelter"
   - contactPerson: "John Doe"
   - address: "123 Main St, City"
   - contactNumber: "+639123456789"
   - email: "test@shelter.com"
   - verified: false
   - status: "pending"
   - veterinarian: { name, contact, license }
   - documents: { permit: [URL], validId: [URL] }
   - timestamps: registeredAt, createdAt, updatedAt
   ```

#### Check Storage:

1. Go to: https://console.firebase.google.com/project/animal911-29427/storage
2. Look for folder: `shelters/[UID]/`
3. You should see 2 files:
   - `permit_[timestamp].[ext]`
   - `id_[timestamp].[ext]`

## 🐛 Troubleshooting

### Error: "auth/operation-not-allowed"

- **Cause**: Email/Password authentication not enabled
- **Fix**: Enable Email/Password in Firebase Console → Authentication → Sign-in method

### Error: "PERMISSION_DENIED"

- **Cause**: Firestore security rules blocking access
- **Fix**: Update Firestore rules as shown above or use Test mode temporarily

### Error: "storage/unauthorized"

- **Cause**: Storage security rules blocking upload
- **Fix**: Update Storage rules as shown above or use Test mode temporarily

### Error: "auth/email-already-in-use"

- **Cause**: Email already registered
- **Fix**: Use a different email or delete the user from Firebase Console

### Files not uploading

- **Check**: File size < 5MB
- **Check**: File type is JPG, PNG, or PDF
- **Check**: Browser console for errors

## 📊 Current Registration Data Structure

```javascript
// Firestore: /shelters/{userId}
{
  userId: string,                    // Firebase Auth UID
  shelterName: string,               // Shelter name
  contactPerson: string,             // Contact person name
  address: string,                   // Full address
  contactNumber: string,             // Phone (+639XXXXXXXXX)
  email: string,                     // Email address
  veterinarian: {
    name: string | null,             // Optional
    contact: string | null,          // Optional
    license: string | null           // Optional
  },
  documents: {
    permit: string,                  // Storage URL
    validId: string                  // Storage URL
  },
  verified: false,                   // Admin approval status
  status: 'pending',                 // 'pending' | 'approved' | 'rejected'
  registeredAt: string,              // ISO timestamp
  createdAt: string,                 // ISO timestamp
  updatedAt: string                  // ISO timestamp
}
```

## 🎯 Next Steps After Registration Works

1. **Create Admin Dashboard View** for shelter applications
2. **Implement Approval Workflow** (verify shelters)
3. **Add Email Notifications** for registration and approval
4. **Create Shelter Dashboard** for verified shelters
5. **Add Document Preview** for admins to review uploads

---

**Note**: The code is fully implemented and ready. You just need to enable the Firebase services in the console!
