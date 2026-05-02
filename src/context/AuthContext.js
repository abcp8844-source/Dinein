import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com";
  const MASTER_ADMIN_PASS = "abcp7863811";

  useEffect(() => {
    let unsubscribeSnapshot = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          // REAL-TIME SYNC: Listens to any changes in balance or orders instantly
          const docRef = doc(db, "users", firebaseUser.uid);
          unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              let data = docSnap.data();
              if (firebaseUser.email === MASTER_ADMIN_EMAIL) {
                data.role = "admin";
              }
              setUserData(data);
            }
          });

        } else {
          setUser(null);
          setUserData(null);
          unsubscribeSnapshot();
        }
      } catch (error) {
        console.error("Critical Auth Sync Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const register = async (email, password, role, additionalData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // REAL PRODUCTION PROFILE: Ensuring no dummy keys exist
      const userProfile = {
        uid: res.user.uid,
        email: email.toLowerCase(),
        role: role, // owner or customer
        fullName: additionalData.fullName || "New User",
        isoCode: additionalData.isoCode,
        currencyCode: additionalData.currencyCode,
        phone: additionalData.phone,
        
        // FINANCIAL CORE: Initialized at zero for real tracking
        walletBalance: 0,
        recentTransactions: [],
        
        verification: {
          method: additionalData.verificationMethod,
          idNumber: additionalData.idNumber,
          idOrigin: additionalData.idOrigin,
          verifiedAt: new Date().toISOString(),
          isApproved: false // Requires admin check for real business
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", res.user.uid), userProfile);
      return res;
    } catch (error) {
      console.error("Registration Core Failure:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    if (email.toLowerCase() === MASTER_ADMIN_EMAIL && password !== MASTER_ADMIN_PASS) {
      throw new Error("ADMIN_ACCESS_DENIED");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
