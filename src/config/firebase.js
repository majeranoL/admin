// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy6eCKGOc5v8xutP6hZugZYsJIleNdOOY",
  authDomain: "animal911-29427.firebaseapp.com",
  projectId: "animal911-29427",
  storageBucket: "animal911-29427.firebasestorage.app",
  messagingSenderId: "941199997725",
  appId: "1:941199997725:web:352cc94eb1b3f8a8317ff4",
  measurementId: "G-ZBR87VS88V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize core Firebase services (required)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is optional and often blocked by ad blockers
// We'll initialize it dynamically only if needed
let analytics = null;

// Export Firebase services for use in other files
export { app, analytics, auth, db, storage };
