import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inAdminGroup = segments[0] === 'admin';
    const inOwnerGroup = segments[0] === 'owner';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } 
    else if (user && userData) {
      // SECURITY: Kick out unauthorized role access
      if (inAdminGroup && userData.role !== 'admin') {
        router.replace('/customer/home');
      }
      else if (inOwnerGroup && userData.role !== 'owner') {
        router.replace('/customer/home');
      }
      // AUTO-ROUTE: Send to correct dashboard from login
      else if (inAuthGroup) {
        if (userData.role === 'admin') router.replace('/admin/home');
        else if (userData.role === 'owner') router.replace('/owner/wallet-dashboard');
        else router.replace('/customer/home');
      }
    }
  }, [user, userData, loading, segments]);

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#000' },
      animation: 'fade'
    }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="admin" options={{ gestureEnabled: false }} />
      <Stack.Screen name="owner" options={{ gestureEnabled: false }} />
      <Stack.Screen name="customer" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}
