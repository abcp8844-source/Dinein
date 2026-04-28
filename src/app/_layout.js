import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CartProvider } from '../context/CartContext';
import { LocationProvider } from '../context/LocationContext';

LogBox.ignoreAllLogs();

function RootLayoutNav() {
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    const inOwnerGroup = segments[0] === '(owner)';

    if (!user) {
      if (!inAuthGroup) router.replace('/(auth)/login');
    } 
    else if (user && userData) {
      if (inAdminGroup && userData.role !== 'admin') {
        router.replace('/(customer)/home');
      }
      else if (inOwnerGroup && userData.role !== 'owner') {
        router.replace('/(customer)/home');
      }
      else if (inAuthGroup) {
        if (userData.role === 'admin') router.replace('/(admin)/dashboard');
        else if (userData.role === 'owner') router.replace('/(owner)/owner-wallet');
        else router.replace('/(customer)/home');
      }
    }
  }, [user, userData, loading, segments]);

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#000' },
      animation: 'fade'
    }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(owner)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(customer)" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider>
            <CartProvider>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
              <RootLayoutNav />
            </CartProvider>
          </ThemeProvider>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
