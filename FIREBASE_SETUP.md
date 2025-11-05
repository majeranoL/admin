# Firebase Integration for Animal 911 Admin

## Overview

Firebase has been successfully integrated into the Animal 911 Admin system, providing authentication, database, and storage capabilities.

## Firebase Services Configured

### 1. **Authentication** (`firebase/auth`)

- User sign-in, sign-up, and logout
- Password reset functionality
- Auth state management

### 2. **Firestore Database** (`firebase/firestore`)

- Real-time NoSQL database
- Collections for: rescueReports, volunteers, animals, adoptionRequests, shelters, admins

### 3. **Storage** (`firebase/storage`)

- File and image uploads
- Photo storage for animals, volunteers, reports, and shelters

### 4. **Analytics** (`firebase/analytics`)

- User behavior tracking and insights

## Project Structure

```
src/
├── config/
│   └── firebase.js              # Firebase initialization and configuration
├── contexts/
│   └── FirebaseContext.jsx      # Firebase context provider
├── hooks/
│   └── useAuth.js               # Custom hook for authentication
└── services/
    ├── firestoreService.js      # Firestore database operations
    └── storageService.js        # Storage/file upload operations
```

## Usage Examples

### 1. Using Firebase Context

```jsx
import { useFirebase } from './contexts/FirebaseContext'

function MyComponent() {
  const { currentUser, login, logout, db, storage } = useFirebase()

  // Access current user
  console.log(currentUser)

  // Login
  await login('email@example.com', 'password')

  // Logout
  await logout()
}
```

### 2. Using Authentication Hook

```jsx
import { useAuth } from "./hooks/useAuth";

function LoginComponent() {
  const { login, logout, currentUser, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login("admin@animal911.com", "password123");
      console.log("Logged in!");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 3. Firestore Database Operations

```jsx
import {
  rescueReportsService,
  volunteersService,
} from "./services/firestoreService";

// Get all rescue reports
const reports = await rescueReportsService.getAll();

// Get rescue reports by status
const pendingReports = await rescueReportsService.getByStatus("pending");

// Create a new rescue report
const newReport = await rescueReportsService.create({
  location: "Bacoor, Cavite",
  description: "Injured dog needs help",
  status: "pending",
  reportedBy: "user123",
});

// Update a rescue report
await rescueReportsService.update("reportId", {
  status: "in-progress",
  assignedVolunteer: "volunteer123",
});

// Delete a rescue report
await rescueReportsService.delete("reportId");

// Get all volunteers
const volunteers = await volunteersService.getAll();

// Create a new volunteer
const newVolunteer = await volunteersService.create({
  name: "John Doe",
  email: "john@example.com",
  phone: "+639123456789",
  status: "active",
});
```

### 4. Storage/File Upload Operations

```jsx
import { imageUploadService, storageService } from "./services/storageService";

// Upload an animal photo
const handleAnimalPhotoUpload = async (file) => {
  try {
    const result = await imageUploadService.uploadAnimalPhoto(file);
    console.log("Photo URL:", result.url);
    console.log("Storage path:", result.path);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Upload with progress tracking
const handleUploadWithProgress = async (file) => {
  const result = await storageService.uploadFile(
    file,
    "reports/image.jpg",
    (progress) => {
      console.log(`Upload progress: ${progress}%`);
    }
  );
};

// Upload multiple files
const files = [file1, file2, file3];
const results = await storageService.uploadMultiple(files, "animals");

// Delete a file
await storageService.deleteFile("animals/image123.jpg");

// Get file URL
const url = await storageService.getFileURL("animals/image123.jpg");
```

### 5. Generic Firestore Operations

```jsx
import { firestoreService } from "./services/firestoreService";
import { where, orderBy, limit } from "firebase/firestore";

// Query with conditions
const activeVolunteers = await firestoreService.query("volunteers", [
  where("status", "==", "active"),
  orderBy("createdAt", "desc"),
  limit(10),
]);

// Pagination
const { docs, lastVisible, hasMore } = await firestoreService.getPaginated(
  "rescueReports",
  20, // page size
  null // last document (null for first page)
);

// Next page
if (hasMore) {
  const nextPage = await firestoreService.getPaginated(
    "rescueReports",
    20,
    lastVisible
  );
}
```

## Firebase Collections Structure

### rescueReports

```javascript
{
  location: string,
  description: string,
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  reportedBy: string,
  assignedVolunteer: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### volunteers

```javascript
{
  name: string,
  email: string,
  phone: string,
  status: 'active' | 'inactive',
  assignedReports: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### animals

```javascript
{
  name: string,
  species: string,
  breed: string,
  age: number,
  status: 'rescued' | 'recovering' | 'adoptable' | 'adopted',
  description: string,
  photoURL: string,
  shelter: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### adoptionRequests

```javascript
{
  animalId: string,
  adopter: {
    name: string,
    email: string,
    phone: string,
    address: string
  },
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### shelters

```javascript
{
  name: string,
  location: string,
  contact: string,
  email: string,
  verified: boolean,
  logoURL: string,
  capacity: number,
  currentAnimals: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### admins

```javascript
{
  userId: string,
  name: string,
  email: string,
  role: 'admin' | 'superadmin',
  shelterId: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Installation

Firebase is already configured. To install Firebase SDK (if needed):

```bash
npm install firebase
```

## Environment Variables (Optional)

For added security, Firebase config uses environment variables:

Create `.env` file (already done - see `.env.example` for template):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then update `firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other configs
};
```

## Security Rules

Remember to set up Firebase Security Rules in the Firebase Console:

### Firestore Rules Example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules Example:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Next Steps

1. ✅ Install Firebase package: `npm install firebase`
2. ✅ Firebase is configured and integrated
3. 🔄 Start using Firestore services in your components
4. 🔄 Implement authentication flow with Firebase Auth
5. 🔄 Set up Firebase Security Rules in Firebase Console
6. 🔄 Test file uploads with Storage service

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
