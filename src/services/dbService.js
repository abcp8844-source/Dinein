import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc, setDoc, increment } from 'firebase/firestore';

export const dbService = {
  // Menu Management
  addMenuItem: async (ownerId, itemData) => {
    try {
      const docRef = await addDoc(collection(db, "menuItems"), {
        ownerId,
        ...itemData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) { throw error; }
  },

  getMenuItems: async () => {
    try {
      const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { throw error; }
  },

  // Wallet Management (Secure Banking Logic)
  getWalletBalance: async (userId) => {
    try {
      const walletRef = doc(db, "wallets", userId);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) {
        return walletSnap.data().balance;
      } else {
        await setDoc(walletRef, { balance: 0 }); 
        return 0;
      }
    } catch (error) { throw error; }
  },

  deductFromWallet: async (userId, amount) => {
    try {
      const walletRef = doc(db, "wallets", userId);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists() && walletSnap.data().balance >= amount) {
        await updateDoc(walletRef, {
          balance: increment(-amount)
        });
        return true;
      }
      throw new Error("Insufficient Wallet Balance");
    } catch (error) { throw error; }
  },

  // Order Management
  placeOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) { throw error; }
  },

  getCustomerOrders: async (customerId) => {
    try {
      const q = query(
        collection(db, "orders"), 
        where("customerId", "==", customerId),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { throw error; }
  }
};
