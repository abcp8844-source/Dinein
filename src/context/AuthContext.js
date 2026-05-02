import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { MARKET_REGISTRY } from "../constants/market-registry";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marketISO, setMarketISO] = useState(null);
  const [appLang, setAppLang] = useState("EN");

  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com";
  const MASTER_ADMIN_PASS = "abcp7863811";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let data = docSnap.data();

            // Administrative Privilege Verification
            if (firebaseUser.email === MASTER_ADMIN_EMAIL) {
              data.role = "admin";
            }

            // Sync with Global Market Registry
            if (data.isoCode) setMarketISO(data.isoCode);
            if (data.preferredLang) setAppLang(data.preferredLang);

            setUserData(data);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth Synchronization Error:", error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, role, additionalData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Enforcing 20-Country Market Protocol
      const userProfile = {
        uid: res.user.uid,
        email,
        role,
        isoCode: additionalData.isoCode || "THA",
        currencyCode: additionalData.currencyCode || "THB",
        preferredLang: additionalData.preferredLang || "EN",
        city: additionalData.city || "", // Critical for logistics range
        ...additionalData,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", res.user.uid), userProfile);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    if (email === MASTER_ADMIN_EMAIL && password !== MASTER_ADMIN_PASS) {
      throw new Error("AUTH_FAILED");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateGlobalPreference = async (updates) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updates);

      if (updates.isoCode) setMarketISO(updates.isoCode);
      if (updates.preferredLang) setAppLang(updates.preferredLang);

      setUserData((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Preference Update Failed:", error);
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        marketISO,
        appLang,
        updateGlobalPreference,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
