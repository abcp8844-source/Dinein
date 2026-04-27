import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      background: '#0A0A0A',
      primary: '#D4AF37',   
      secondary: '#FFFFFF', 
      textMain: '#F2F2F7',  
      textDim: '#8E8E93',   
      cardBg: '#1C1C1E',    
      accent: '#FF3B30',    
      border: '#2C2C2E',    
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
