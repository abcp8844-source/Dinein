import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

/**
 * ROOT NAVIGATION SYSTEM
 * Roles: Admin (System Monitor) | Owner (Business) | Customer (User)
 * Market: 15-Country Integrated Infrastructure
 */
function RootLayoutNav() {
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } 
    else if (user && inAuthGroup) {
      // Logic for Role-Based Redirection
      if (userData?.role === 'admin') {
        router.replace('/admin/home');
      } 
      else if (userData?.role === 'owner') {
        router.replace('/owner/wallet-dashboard');
      } 
      else {
        router.replace('/customer/home');
      }
    }
  }, [user, userData, loading, segments]);

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#000' },
      animation: 'fade'
    }}>
      {/* Authentication Flow */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      
      {/* Central Admin Panel (Monitoring & Support) */}
      <Stack.Screen name="admin" options={{ gestureEnabled: false }} />
      
      {/* Business & Consumer Panels */}
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
