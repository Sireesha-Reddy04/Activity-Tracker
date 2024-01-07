// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9uZ3xO9P-0FfutKLw6z673aLZPCyUglk",
  authDomain: "activity-tracker-226ff.firebaseapp.com",
  projectId: "activity-tracker-226ff",
  storageBucket: "activity-tracker-226ff.appspot.com",
  messagingSenderId: "399368566788",
  appId: "1:399368566788:web:f31d6f6cdfde040c195d51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore();  // Add parentheses here
