import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0nSqjBeNVKG69PA9PC2xnHgXzuhIX2aU",
  authDomain: "portfolio-3a73b.firebaseapp.com",
  projectId: "portfolio-3a73b",
  storageBucket: "portfolio-3a73b.firebasestorage.app",
  messagingSenderId: "1043650383506",
  appId: "1:1043650383506:web:0380b090c0874befb1204b",
  measurementId: "G-3H7RLVS390"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
