// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUanYfXpd8ZgHxr3KWyF1gvw1PpPdAaKc",
  authDomain: "street-rebuild-projec.firebaseapp.com",
  projectId: "street-rebuild-projec",
  storageBucket: "street-rebuild-projec.firebasestorage.app",
  messagingSenderId: "247471383903",
  appId: "1:247471383903:web:cce5ac9457dc40d1a4c2ea",
  measurementId: "G-XHBQ1DSY7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export auth instance
export const db = getFirestore(app); // Export firestore instance