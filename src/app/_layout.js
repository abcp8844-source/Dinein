import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Core Context Synchronization
import { AuthProvider, useAuth } from "./../context/AuthContext";
import { ThemeProvider } from "./../context/ThemeContext";
import { CartProvider } from "./../context/CartContext";
import { LocationProvider } from "./../context/LocationContext";

// Suppressing unnecessary development logs
LogBox.ignoreAllLogs();

/**
 * ROOT NAVIGATION COMPONENT
 * Handles: Authentication redirects and Role-Based Access Control (RBAC)
 */
function RootLayoutNav() {
  const { user, userData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Segment Identification for Routing
    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inOwnerGroup = segments[0] === "(owner)";

    // 1. GUEST GATEKEEPER: Redirect to Login if not authenticated
    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    }
    // 2. ROLE-BASED ACCESS CONTROL (RBAC)
    else if (user && userData) {
      // ADMIN ACCESS: Direct to Global Dashboard & Financial Nodes
      if (userData.role === "admin") {
        if (!inAdminGroup) router.replace("/(admin)/dashboard");
      }

      // OWNER ACCESS: Direct to Shop Management & Local Wallet
      else if (userData.role === "owner") {
        if (!inOwnerGroup) router.replace("/(owner)/owner-wallet");
      }

      // CUSTOMER ACCESS: Direct to Tabs (Includes SupportScreen)
      else {
        if (inAdminGroup || inOwnerGroup || inAuthGroup) {
          router.replace("/(tabs)");
        }
      }
    }
  }, [user, userData, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#020B18" }, // Brand Midnight Navy
        animation: "fade_from_bottom",
      }}
    >
      {/* AUTHENTICATION STACK */}
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />

      {/* ADMIN INFRASTRUCTURE */}
      <Stack.Screen
        name="(admin)"
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      {/* OWNER MANAGEMENT NODES */}
      <Stack.Screen name="(owner)" options={{ gestureEnabled: false }} />

      {/* CUSTOMER TABS & SUPPORT SCREEN */}
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

/**
 * MAIN APP ENTRY POINT
 * Wraps all providers with Global Theme and Auth State.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider>
            <CartProvider>
              {/* UI/UX: Status Bar Branding */}
              <StatusBar barStyle="light-content" backgroundColor="#020B18" />
              <RootLayoutNav />
            </CartProvider>
          </ThemeProvider>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
