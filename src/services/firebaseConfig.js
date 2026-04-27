import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs-v6A_H8l1pGzXz_Xf6M0v1u2Y3Z4",
  authDomain: "dinein-8844.firebaseapp.com",
  projectId: "dinein-8844",
  storageBucket: "dinein-8844.appspot.com",
  messagingSenderId: "1056585055465",
  appId: "1:1056585055465:web:866847864f14798305c6d3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
