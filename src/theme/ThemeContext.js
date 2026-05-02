import React, { createContext, useContext } from "react";

const ThemeContext = createContext({});

/**
 * GLOBAL THEME ARCHITECTURE: DINING TABLE
 * Main Palette: Midnight Navy (#020B18) & Premium Gold (#D4AF37)
 * Purpose: Unified UI across Admin, Owner, and Customer nodes.
 */
export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      // Backgrounds: Midnight Dark for Gold to Pop
      background: "#020B18", 
      cardBg: "#051121",
      inputBg: "#0A1A2F",

      // Primary Branding: Luxury Gold
      primary: "#D4AF37", 
      secondary: "#FFFFFF",

      // Typography
      textMain: "#FDFDFD",
      textDim: "#5D6D7E", // Grayish Blue for sub-labels

      // States & Accents
      accent: "#C41E3A",
      success: "#27AE60",
      
      // Borders & Glows (Optimized for Animated Components)
      border: "rgba(212, 175, 55, 0.12)", // Dimmed Gold Border
      glow: "rgba(212, 175, 55, 0.4)",   // Focus Glow
      
      // Treasury/Financial Colors
      commission: "#2ECC71",
      promotion: "#F1C40F",
    },
    borderRadius: {
      small: 8,
      medium: 16,
      button: 18, // Modern curved but not fully round
      card: 25,
    },
    spacing: {
      padding: 25,
      gap: 15,
    },
    shadows: {
      goldGlow: {
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
