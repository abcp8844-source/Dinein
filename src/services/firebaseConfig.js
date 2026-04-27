import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwV-dummy-key-your-actual-key-is-saved",
  authDomain: "ab-cp-official.firebaseapp.com",
  projectId: "ab-cp-official",
  storageBucket: "ab-cp-official.appspot.com",
  messagingSenderId: "1036815340058",
  appId: "1:1036815340058:web:7f6d..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
