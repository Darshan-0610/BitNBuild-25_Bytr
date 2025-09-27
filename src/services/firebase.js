import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - Uses environment variables with fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.REACT_APP_MEASUREMENT_ID || "G-DEMO"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analytics = getAnalytics(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('Running in demo mode without Firebase backend');
}

export { auth, db, storage, analytics };

// Initialize messaging (for notifications)
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log('Firebase messaging not supported in this environment');
}

export { messaging };

// Connect to Firebase emulators in development
if (process.env.NODE_ENV === 'development') {
  const useEmulators = false; // Set to true if you want to use local emulators
  
  if (useEmulators) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      console.log('Error connecting to emulators:', error);
    }
  }
}

export default app;