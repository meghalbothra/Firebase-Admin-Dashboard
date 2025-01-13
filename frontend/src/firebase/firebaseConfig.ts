import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, setFirestoreSettings } from "firebase/firestore";
import { getPerformance } from 'firebase/performance';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics, Performance Monitoring, Auth, and Firestore
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cache: {
    enabled: true, // Enable offline persistence
  }
});
export const performance = getPerformance(app);

// No need for the `enableOfflinePersistence` function anymore

export default app;
