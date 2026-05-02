import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // SECURE MASTER ACCESS
  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com";
  const MASTER_ADMIN_PASS = "abcp7863811";

  useEffect(() => {
    let unsubscribeSnapshot = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // REAL-TIME SYNC: Global Node Monitoring
        const docRef = doc(db, "users", firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            let data = docSnap.data();

            // 1. FORCED LOGOUT: If Admin blocks the user
            if (data.status === "suspended" || data.status === "blocked") {
              logout();
              return;
            }

            // 2. ROLE PROTECTION: Ensure Master Admin is recognized
            if (
              firebaseUser.email.toLowerCase() ===
              MASTER_ADMIN_EMAIL.toLowerCase()
            ) {
              data.role = "admin";
            }

            setUserData(data);

            // 3. ACTIVITY TRACKER: Update last active status silently
            updateDoc(docRef, { lastActive: new Date().toISOString() }).catch(
              () => {},
            );
          }
        });
      } else {
        setUser(null);
        setUserData(null);
        unsubscribeSnapshot();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const register = async (email, password, role, additionalData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // PRODUCTION PROFILE STRUCTURE (20 Countries Compatible)
      const userProfile = {
        uid: res.user.uid,
        email: email.toLowerCase(),
        role: role, // owner or customer
        fullName: additionalData.fullName || "User Node",
        country: additionalData.country || "Unknown",
        isoCode: additionalData.isoCode || "US",
        currency: additionalData.currencyCode || "USD",
        phone: additionalData.phone || "N/A",
        status: "active", // Default status

        // FINANCIAL CORE
        walletBalance: 0,
        pendingCommission: 0,
        promotionBalance: 0,

        // VERIFICATION NODE (Requires Admin Approval)
        verification: {
          method: additionalData.verificationMethod || "none",
          idNumber: additionalData.idNumber || "none",
          idOrigin: additionalData.idOrigin || additionalData.country,
          isApproved: false,
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", res.user.uid), userProfile);
      return res;
    } catch (error) {
      console.error("REGISTRATION_CRITICAL_FAILURE:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    // Admin Security Check
    if (
      email.toLowerCase() === MASTER_ADMIN_EMAIL &&
      password !== MASTER_ADMIN_PASS
    ) {
      throw new Error("UNAUTHORIZED_ADMIN_ATTEMPT");
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
