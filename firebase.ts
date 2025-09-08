// Fix: Switched to Firebase v8 compat API to resolve potential versioning issues.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// Set session persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });