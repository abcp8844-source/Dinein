import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

export const dbService = {
  // Save new menu item (For Owner)
  addMenuItem: async (ownerId, itemData) => {
    try {
      const docRef = await addDoc(collection(db, "menuItems"), {
        ownerId,
        ...itemData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get all menu items (For Customer)
  getMenuItems: async () => {
    try {
      const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },

  // NEW: Place an order (For Customer)
  placeOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }
};
