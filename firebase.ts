// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoITDs95o0MFzhMt-zAL9REJfBeRUas5c",
  authDomain: "gespadel-app.firebaseapp.com",
  projectId: "gespadel-app",
  storageBucket: "gespadel-app.firebasestorage.app",
  messagingSenderId: "1023199260270",
  appId: "1:1023199260270:web:9454bcaccac5e63d86807f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
