import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  PhoneAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
            
            if (firebaseUser.email === MASTER_ADMIN_EMAIL) {
              data.role = "admin";
            }
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

  const sendOTP = async (phoneNumber) => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      return await phoneProvider.verifyPhoneNumber(phoneNumber);
    } catch (error) {
      throw new Error("OTP_DISPATCH_FAILURE");
    }
  };

  const register = async (email, password, role, additionalData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userProfile = {
        uid: res.user.uid,
        email,
        role,
        isoCode: additionalData.isoCode,
        currencyCode: additionalData.currencyCode,
        city: additionalData.city,
        phone: additionalData.phone,
        verification: {
          method: additionalData.verificationMethod, 
          idNumber: additionalData.idNumber,
          verifiedAt: new Date().toISOString()
        },
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
      throw new Error("ADMIN_CREDENTIAL_MISMATCH");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout, register, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
