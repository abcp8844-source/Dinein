import { db } from './firebaseConfig';
import { 
  collection, addDoc, getDocs, query, where, 
  orderBy, doc, updateDoc, getDoc, setDoc, increment 
} from 'firebase/firestore';

export const dbService = {

  // --- SUPPORT SYSTEM LOGIC ---
  sendSupportTicket: async (ticketData) => {
    try {
      const supportRef = collection(db, 'support_tickets');
      const docRef = await addDoc(supportRef, {
        ...ticketData,
        status: 'open',
        priority: 'normal',
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // --- MENU MANAGEMENT ---
  addMenuItem: async (ownerId, itemData, marketISO) => {
    try {
      const collectionPath = `markets/${marketISO}/menuItems`;
      const docRef = await addDoc(collection(db, collectionPath), {
        ownerId,
        ...itemData,
        marketISO,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  getMenuItems: async (marketISO) => {
    try {
      const q = query(
        collection(db, `markets/${marketISO}/menuItems`), 
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { 
      throw error; 
    }
  },

  // --- FINANCIALS & WALLET ---
  getWalletBalance: async (userId, marketISO) => {
    try {
      const walletRef = doc(db, `markets/${marketISO}/wallets`, userId);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) return walletSnap.data().balance;
      await setDoc(walletRef, { balance: 0, lastSync: new Date().toISOString() }); 
      return 0;
    } catch (error) { 
      throw error; 
    }
  },

  processPromotionPayment: async (ownerId, amount, marketISO, currency) => {
    try {
      const ownerWalletRef = doc(db, `markets/${marketISO}/wallets`, ownerId);
      const adminTreasuryRef = doc(db, 'admin_finance', 'global_revenue');
      await updateDoc(ownerWalletRef, { balance: increment(-amount) });
      await setDoc(adminTreasuryRef, {
        [`total_revenue_${currency}`]: increment(amount),
        [`market_contribution_${marketISO}`]: increment(amount),
        lastSettlement: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // --- ORDER SYSTEM ---
  placeOrder: async (orderData, marketISO) => {
    try {
      const orderRef = collection(db, `markets/${marketISO}/orders`);
      const docRef = await addDoc(orderRef, {
        ...orderData,
        status: 'pending',
        marketISO,
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) { 
      throw error; 
    }
  },

  updateOrderStatus: async (orderId, marketISO, newStatus) => {
    try {
      const orderDoc = doc(db, `markets/${marketISO}/orders`, orderId);
      await updateDoc(orderDoc, { status: newStatus });
      return true;
    } catch (error) { 
      throw error; 
    }
  },

  getCustomerOrders: async (customerId, marketISO) => {
    try {
      const q = query(
        collection(db, `markets/${marketISO}/orders`), 
        where("customerId", "==", customerId), 
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { 
      throw error; 
    }
  }
};
