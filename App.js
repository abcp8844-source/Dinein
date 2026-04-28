import React from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp, getApps } from 'firebase/app';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import { CartProvider } from './src/context/CartContext';
import { LocationProvider } from './src/context/LocationContext';

const firebaseConfig = {
  apiKey: "AIzaSyC-hd2bvzT8per09QebyrzatFxcz1Yqj50",
  authDomain: "dining-table-official.firebaseapp.com",
  projectId: "dining-table-official",
  storageBucket: "dining-table-official.firebasestorage.app",
  messagingSenderId: "817071467031",
  appId: "1:817071467031:android:d99aa1d244c981163bca52"
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
                <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
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
