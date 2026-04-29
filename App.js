import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-hd2bvzT8per09QebyrzatFxcz1Yqj50",
  authDomain: "dining-table-official.firebaseapp.com",
  projectId: "dining-table-official",
  storageBucket: "dining-table-official.firebasestorage.app",
  messagingSenderId: "817071467031",
  appId: "1:817071467031:android:d99aa1d244c981163bca52",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
