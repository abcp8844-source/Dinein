import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const theme = {
        colors: {
            background: '#000000',
            primary: '#800000',
            secondary: '#D4AF37',
            cardOwner: '#B22222',
            cardCustomer: '#FFC0CB',
            textMain: '#FFFFFF',
            textDim: '#A9A9A9',
            error: '#FF0000'
        },
        fonts: {
            premium: 'serif',
            main: 'sans-serif'
        },
        spacing: {
            small: 8,
            medium: 16,
            large: 24
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
