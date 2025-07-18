// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this for Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAunCx8saYqAti1GO9nibfWO9pAjYwyJYg",
  authDomain: "nexcoinapp-39db0.firebaseapp.com",
  projectId: "nexcoinapp-39db0",
  storageBucket: "nexcoinapp-39db0.appspot.com", // ✅ This is correct
  messagingSenderId: "657615794384",
  appId: "1:657615794384:web:f55a6f6d3fa5864009aed5",
  measurementId: "G-9P1ENB1TTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export storage
