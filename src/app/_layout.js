import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
  const { user, loading, isAdmin } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Direct unauthorized users to login
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Direct logged-in users based on their role
      if (isAdmin) {
        router.replace('/admin/home');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, loading, segments, isAdmin]);

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#0A0A0A' } 
    }}>
      <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth/register" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="admin" options={{ animation: 'slide_from_bottom' }} />
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
