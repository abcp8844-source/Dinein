import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

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
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }
};
