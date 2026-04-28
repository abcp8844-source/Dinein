import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

/**
 * GLOBAL AUTHENTICATION & ROLE ENGINE
 * Security: Master Admin Logic (Email + Hardcoded Password)
 * Context: 15-Market Regional Synchronization
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // MASTER SECURITY CREDENTIALS
  const MASTER_ADMIN_EMAIL = "abcp8844@gmail.com"; 
  const MASTER_ADMIN_PASS = "7863811"; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            let data = docSnap.data();

            // ROLE CLASSIFICATION
            // Force 'admin' role if the Master Email is detected
            if (firebaseUser.email === MASTER_ADMIN_EMAIL) {
              data.role = 'admin'; 
            }

            setUserData(data);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("[AUTH ERROR]: Regional Node Sync Failure", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  } , []);

  /**
   * ENHANCED LOGIN GATEWAY
   * Prevents unauthorized access to Admin nodes via password validation
   */
  const login = async (email, password) => {
    if (email === MASTER_ADMIN_EMAIL && password !== MASTER_ADMIN_PASS) {
      throw new Error("Invalid Administrative Credentials");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
