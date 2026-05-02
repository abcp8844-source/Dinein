import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

export const dbService = {
  // --- 1. PRODUCT & MENU MANAGEMENT ---
  /**
   * Fetches products globally or by category.
   * Centralized in the 'products' collection for high performance.
   */
  getMenuItems: async (category = "all") => {
    try {
      const menuRef = collection(db, "products");
      const q =
        category === "all"
          ? query(menuRef, orderBy("createdAt", "desc"))
          : query(
              menuRef,
              where("category", "==", category),
              orderBy("createdAt", "desc"),
            );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Global Menu Fetch Error:", error);
      throw error;
    }
  },

  // --- 2. GLOBAL ORDER SYSTEM ---
  /**
   * Places an order in a centralized 'orders' collection.
   * Uses serverTimestamp to ensure global synchronization.
   */
  placeOrder: async (orderData) => {
    try {
      const orderRef = collection(db, "orders");
      const docRef = await addDoc(orderRef, {
        ...orderData,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Order Placement Error:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Status Update Error:", error);
      throw error;
    }
  },

  // --- 3. FINANCIALS & SETTLEMENTS ---
  /**
   * Fetches real-time wallet balance from the user profile.
   * Aligned with AuthContext live synchronization.
   */
  getWalletBalance: async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) return userSnap.data().walletBalance || 0;
      return 0;
    } catch (error) {
      console.error("Wallet Sync Error:", error);
      throw error;
    }
  },

  /**
   * Processes business promotion fees.
   * Deducts from owner and records in global revenue treasury.
   */
  processPromotionPayment: async (ownerId, amount, currency) => {
    try {
      const ownerRef = doc(db, "users", ownerId);
      const adminTreasuryRef = doc(db, "admin_finance", "global_revenue");

      await updateDoc(ownerRef, { walletBalance: increment(-amount) });

      await setDoc(
        adminTreasuryRef,
        {
          [`total_revenue_${currency}`]: increment(amount),
          lastSettlement: serverTimestamp(),
        },
        { merge: true },
      );

      return { success: true };
    } catch (error) {
      console.error("Financial Settlement Error:", error);
      throw error;
    }
  },
};
