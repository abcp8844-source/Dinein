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
    const inAdminGroup = segments[0] === 'admin';
    const inOwnerGroup = segments[0] === 'owner';

    // 1. If not logged in, force to Login
    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } 
    // 2. Prevent Cross-Role Access (Security Guard)
    else if (user && userData) {
      if (inAdminGroup && userData.role !== 'admin') {
        router.replace('/customer/home'); // Kick out non-admins
      }
      else if (inOwnerGroup && userData.role !== 'owner') {
        router.replace('/customer/home'); // Kick out non-owners
      }
      // 3. Auto-redirect from Login page if already authenticated
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
      animation: 'fade_from_bottom'
    }}>
      {/* Auth Flow */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      
      {/* Role-Specific Nodes */}
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
