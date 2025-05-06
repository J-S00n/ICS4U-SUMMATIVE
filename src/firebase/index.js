// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const auth = getAuth(firebaseConfig);
const firestore = getFirestore(firebaseConfig);

export { auth, firestore };