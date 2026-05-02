import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext({});

/**
 * GLOBAL CART & LOGISTICS SYNC
 * Features: Market-Locking, Auto-Purge, and Delivery Range Foundation.
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { marketISO, userData } = useAuth();

  /**
   * SECURITY: AUTOMATIC PURGE ON REGION SWITCH
   * Ensures items from one market (e.g., THA) do not persist when switching to another (e.g., USA).
   */
  useEffect(() => {
    clearCart();
  }, [marketISO]);

  const addToCart = (product) => {
    // FOUNDATION: Geofencing Check
    // This will eventually validate if the restaurant's city matches the user's range.
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
 
