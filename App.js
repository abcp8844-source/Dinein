import React from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp, getApps } from 'firebase/app';

// Corrected Paths based on your SRC structure
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/theme/ThemeContext'; // Path fixed
import { CartProvider } from './src/context/CartContext'; // Path fixed
import { LocationProvider } from './src/context/LocationContext'; // Path fixed

const firebaseConfig = {
  apiKey: "AIzaSyAs-v6A_H8l1pGzXz_Xf6M0v1u2Y3Z4",
  authDomain: "dining-table-app.firebaseapp.com",
  projectId: "dining-table-app",
  storageBucket: "dining-table-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider>
            <CartProvider>
              <View style={styles.root}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </View>
            </CartProvider>
          </ThemeProvider>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
