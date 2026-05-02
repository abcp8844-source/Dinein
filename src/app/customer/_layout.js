import { Tabs } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

/**
 * RESTORED: Future-Tech Customer Layout
 * Logic: Centralized AI Core (Shield) with Biometric Identity (Fingerprint)
 * Integrity: No deletions, standard deep-navy background #020B18
 */
export default function CustomerLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#5D6D7E", 
        tabBarStyle: {
          backgroundColor: "#020B18", 
          borderTopColor: "#0A1A2F",
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "900",
          letterSpacing: 1.5,
          marginTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "EXPLORE",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: "CORE AI",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: "#0A1A2F",
                padding: 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: color,
                marginTop: -25,
                shadowColor: color,
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }}
            >
              <Ionicons name="shield-checkmark" size={24} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "QUERY",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-sharp" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "HISTORY",
          tabBarIcon: ({ color }) => (
            <Ionicons name="layers-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "IDENTITY",
          tabBarIcon: ({ color }) => (
            <Ionicons name="finger-print-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
