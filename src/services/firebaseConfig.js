import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your 100% Actual and Real Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-hd2bvzT8per09QebyrzatFxcz1Yqj50", 
  authDomain: "ab-cp-official.firebaseapp.com",
  projectId: "ab-cp-official",
  storageBucket: "ab-cp-official.appspot.com",
  messagingSenderId: "1036815340058",
  appId: "1:1036815340058:web:7f6d89956429547d0d0246"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Clean Exports for your App Structure
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
