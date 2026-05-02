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

/**
 * GLOBAL DATABASE SERVICE
 * Handles: Products, Orders, and Financial Settlements across 20 countries.
 * Feature: Automatic Admin Commission & Country Filtering.
 */
export const dbService = {
  // --- 1. GLOBAL PRODUCT MANAGEMENT ---
  // Filters products by country ISO code to ensure localized business.
  getMenuItems: async (countryCode, category = "all") => {
    try {
      const menuRef = collection(db, "products");
      let q = query(
        menuRef,
        where("country", "==", countryCode), // Essential for 20-country setup
        orderBy("createdAt", "desc"),
      );

      if (category !== "all") {
        q = query(q, where("category", "==", category));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("MENU_FETCH_FAILURE:", error);
      throw error;
    }
  },

  // --- 2. ADVANCED ORDER SYSTEM ---
  placeOrder: async (orderData) => {
    try {
      const orderRef = collection(db, "orders");
      // Calculating Admin Commission (e.g., 10%)
      const commissionAmount = orderData.totalAmount * 0.1;
      const ownerNetEarning = orderData.totalAmount - commissionAmount;

      const docRef = await addDoc(orderRef, {
        ...orderData,
        commission: commissionAmount,
        ownerEarning: ownerNetEarning,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("ORDER_PLACEMENT_FAILURE:", error);
      throw error;
    }
  },

  // --- 3. FINANCIAL SETTLEMENTS & ADMIN TREASURY ---
  /**
   * Settles payments and transfers commission to Admin Wallet.
   */
  processSettlement: async (orderId, amount, currency, ownerId) => {
    try {
      const adminFinanceRef = doc(db, "admin_stats", "global_revenue");
      const ownerRef = doc(db, "users", ownerId);

      // 1. Update Admin Treasury (Commission & Promotion Fees)
      await setDoc(
        adminFinanceRef,
        {
          [`commissionEarnings_${currency}`]: increment(amount * 0.1),
          lastSettlement: serverTimestamp(),
        },
        { merge: true },
      );

      // 2. Update Owner Wallet (Net after commission)
      await updateDoc(ownerRef, {
        walletBalance: increment(amount * 0.9),
      });

      return { success: true };
    } catch (error) {
      console.error("FINANCIAL_SETTLEMENT_ERROR:", error);
      throw error;
    }
  },

  // --- 4. SUPPORT & TICKETING ---
  sendSupportTicket: async (ticketData) => {
    try {
      const ticketRef = collection(db, "support_tickets");
      await addDoc(ticketRef, {
        ...ticketData,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("SUPPORT_TICKET_ERROR:", error);
      throw error;
    }
  },
};
