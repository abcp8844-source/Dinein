import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./../context/AuthContext";
import { ThemeProvider } from "./../context/ThemeContext";
import { CartProvider } from "./../context/CartContext";
import { LocationProvider } from "./../context/LocationContext";

LogBox.ignoreAllLogs();

function RootLayoutNav() {
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inOwnerGroup = segments[0] === "(owner)";

    // 1. If not logged in, force to login screen
    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    }
    // 2. If logged in, check roles and direct to correct dashboard
    else if (user && userData) {
      if (userData.role === "admin") {
        // Master Admin Route
        if (!inAdminGroup) router.replace("/(admin)/dashboard");
      } else if (userData.role === "owner") {
        // Owner Wallet/Home Route
        if (!inOwnerGroup) router.replace("/(owner)/owner-wallet");
      } else {
        // Customer Home Route
        if (inAdminGroup || inOwnerGroup || inAuthGroup) {
          router.replace("/(customer)/home");
        }
      }
    }
  }, [user, userData, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
        animation: "fade",
      }}
    >
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
