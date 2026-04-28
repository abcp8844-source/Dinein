import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
   * 🚀 ENHANCED GLOBAL REGISTER
   * Markets: 15 Strategic Regions (Sync with Master List)
   */
  const register = async (email, password, role, additionalData) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Creating the Global Profile with Region & Currency Lock
    const userProfile = {
      uid: res.user.uid,
      email,
      role,
      ...additionalData, // Includes countryName, isoCode, currencyCode from our 15-list
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", res.user.uid), userProfile);
    return res;
  };

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
      logout,
      register // 👈 Now with Global Market support
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
