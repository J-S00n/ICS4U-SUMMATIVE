import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmneMT85pSP_knAZFRfwsCOpdJWUI8U-I",
  authDomain: "ics4u-e6485.firebaseapp.com",
  projectId: "ics4u-e6485",
  storageBucket: "ics4u-e6485.firebasestorage.app",
  messagingSenderId: "691115731061",
  appId: "1:691115731061:web:8dcc5a71455ac3eeaef03c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };