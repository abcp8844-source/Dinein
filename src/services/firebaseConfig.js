import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Actual Firebase Configuration from the JSON file
const firebaseConfig = {
  apiKey: "AIzaSyC-hd2bvzT8per09QebyrzatFxcz1Yqj50",
  authDomain: "dining-table-official.firebaseapp.com",
  projectId: "dining-table-official",
  storageBucket: "dining-table-official.firebasestorage.app",
  messagingSenderId: "817071467031",
  appId: "1:817071467031:android:d99aa1d244c981163bca52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Clean Exports for your App
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
