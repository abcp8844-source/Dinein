import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [marketISO, setMarketISO] = useState('THA'); 
  const [appLang, setAppLang] = useState('EN');      

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
              data.role = 'admin'; 
            }

            if (data.isoCode) setMarketISO(data.isoCode);
            if (data.preferredLang) setAppLang(data.preferredLang);

            setUserData(data);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("[AUTH_SYNC_ERROR]:", error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, role, additionalData) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    const userProfile = {
      uid: res.user.uid,
      email,
      role,
      isoCode: additionalData.isoCode || 'THA',
      currencyCode: additionalData.currencyCode || 'THB',
      preferredLang: additionalData.preferredLang || 'EN',
      ...additionalData,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", res.user.uid), userProfile);
    return res;
  };

  const login = async (email, password) => {
    if (email === MASTER_ADMIN_EMAIL && password !== MASTER_ADMIN_PASS) {
      throw new Error("AUTH_FAILED: INVALID_ADMIN_CREDENTIALS");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateMarketPreference = (iso) => setMarketISO(iso);
  const updateLanguagePreference = (lang) => setAppLang(lang);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      marketISO, 
      appLang,
      updateMarketPreference,
      updateLanguagePreference,
      login, 
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
