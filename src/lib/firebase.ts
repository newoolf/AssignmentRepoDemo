// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBr-...",
  authDomain: "medicationadherencesystem.firebaseapp.com",
  projectId: "medicationadherencesystem",
  storageBucket: "medicationadherencesystem.appspot.com",
  messagingSenderId: "642660533844",
  appId: "1:642660533844:web:90d4e4c8be078c16e14fc1",
  measurementId: "G-9GDEBRD0CL",
  databaseURL: "https://medicationadherencesystem-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics only if supported (avoids SSR issues)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
