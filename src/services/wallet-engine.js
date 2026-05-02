/**
 * GLOBAL FINANCIAL SETTLEMENT ENGINE
 * Core Logic: Market Isolation & Revenue Routing
 * Target: 15 International Operational Nodes
 */

import { db } from "./firebaseConfig";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
} from "firebase/firestore";

export const WalletEngine = {
  /**
   * 1. PROMOTION BILLING (Owner to Master Admin)
   * Deducts from Owner balance and routes to Admin Global Revenue.
   */
  processPromotionBilling: async (ownerId, amount, currency, countryCode) => {
    try {
      const transactionId = `PROMO-${Date.now()}`;
      const timestamp = new Date().toISOString();

      const ownerRef = doc(db, `markets/${countryCode}/owners`, ownerId);
      const adminRevenueRef = doc(db, "admin_finance", "global_revenue");

      await updateDoc(ownerRef, {
        balance: increment(-amount),
      });

      await updateDoc(adminRevenueRef, {
        [`total_earnings_${currency}`]: increment(amount),
        total_transactions: increment(1),
      });

      const ledgerRef = collection(db, "admin_audit_ledger");
      await addDoc(ledgerRef, {
        transactionId,
        from: ownerId,
        type: "PROMOTION_FEE",
        value: amount,
        unit: currency,
        region: countryCode,
        timestamp,
      });

      return { success: true, ref: transactionId };
    } catch (error) {
      console.error("[FINANCIAL_ERROR]: Billing Failed", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 2. REGIONAL SETTLEMENT (Customer to Owner)
   * Strictly isolated within the country node.
   */
  processOrderPayment: async (transactionData) => {
    const { customerId, ownerId, amount, currency, countryCode } =
      transactionData;
    const refId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      const transactionRef = collection(
        db,
        `markets/${countryCode}/transactions`,
      );

      const settlementRecord = {
        refId,
        sender: customerId,
        receiver: ownerId,
        value: amount,
        unit: currency,
        region: countryCode,
        timestamp: new Date().toISOString(),
        status: "SETTLED",
      };

      await addDoc(transactionRef, settlementRecord);

      const ownerRef = doc(db, `markets/${countryCode}/owners`, ownerId);
      await updateDoc(ownerRef, {
        balance: increment(amount),
      });

      return { success: true, receipt: settlementRecord };
    } catch (error) {
      return {
        success: false,
        message: "Settlement Failed: Regional Network Error",
      };
    }
  },

  /**
   * 3. MASTER CURRENCY FORMATTER
   */
  displayBalance: (value, currencyCode) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(value);
  },
};
