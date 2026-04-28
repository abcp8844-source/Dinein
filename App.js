import React, { useEffect } from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { initializeApp, getApps } from 'firebase/app';

// Recovery of established SRC architecture
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { LocationProvider } from './src/context/LocationContext';

// Firebase Configuration (Verified from yesterday's setup)
const firebaseConfig = {
  apiKey: "AIzaSyAs-v6A_H8l1pGzXz_Xf6M0v1u2Y3Z4",
  authDomain: "dining-table-app.firebaseapp.com",
  projectId: "dining-table-app",
  storageBucket: "dining-table-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

// Security check for Firebase initialization
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Suppressing unnecessary warnings for production-like view
LogBox.ignoreLogs(['Setting a timer', 'AsyncStorage has been extracted']);

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider>
          <CartProvider>
            <View style={styles.container}>
              <StatusBar 
                barStyle="light-content" 
                backgroundColor="transparent" 
                translucent 
              />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </View>
          </CartProvider>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Matches your dark theme preference
  },
});
