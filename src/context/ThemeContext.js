import React, { createContext, useContext } from "react";

const ThemeContext = createContext({});

/**
 * GLOBAL THEME ARCHITECTURE
 * Primary: Dark Navy Blue (#0A111F)
 * Highlight: Premium Gold (#D4AF37)
 */
export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      background: "#0A111F",
      primary: "#D4AF37",
      secondary: "#FFFFFF",
      textMain: "#FDFDFD",
      textDim: "#A0AEC0",
      cardBg: "#161E2E",
      accent: "#C41E3A",
      border: "rgba(212, 175, 55, 0.15)",
      inputBg: "#1F2937",
      success: "#27AE60",
    },
    borderRadius: {
      small: 6,
      medium: 14,
      button: 25,
    },
    spacing: {
      padding: 20,
      gap: 12,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
