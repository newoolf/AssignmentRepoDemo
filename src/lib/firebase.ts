// lib/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBzLZfEOQqDb0QpQdaUMDTZsc84B7a-5J4",
  authDomain: "medicationadherencesystem.firebaseapp.com",
  projectId: "medicationadherencesystem",
  storageBucket: "medicationadherencesystem.appspot.com",
  messagingSenderId: "642660533844",
  appId: "1:642660533844:web:90d4e4c8be078c16e14fc1",
  measurementId: "G-9GDEBRD0CL",
  databaseURL: "https://medicationadherencesystem.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
