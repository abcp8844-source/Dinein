import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * AI-CENTRIC CUSTOMER ARCHITECTURE
 * Engineered for Global Markets (15 Regions)
 * Integrated with Gemini AI Logic Nodes
 */
export default function CustomerLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary, // #D4AF37 Gold
      tabBarInactiveTintColor: '#444444',
      tabBarStyle: {
        backgroundColor: '#000000',
        borderTopColor: '#1A1A1A',
        height: 75,
        paddingBottom: 15,
        paddingTop: 10,
        elevation: 20,
        shadowColor: colors.primary, // AI Glowing Effect
        shadowOpacity: 0.1,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.2,
      },
      headerShown: false,
    }}>
      
      {/* 📍 AI-SMART DISCOVER */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'DISCOVER',
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps-outline" size={22} color={color} />
          ),
        }}
      />
      
      {/* 🤖 GEMINI AI CORE (The Main Feature) */}
      <Tabs.Screen
        name="ai-assistant" 
        options={{
          title: 'AI ASSIST',
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#111', 
              padding: 10, 
              borderRadius: 50, 
              borderWidth: 1, 
              borderColor: color,
              marginTop: -10 
            }}>
              <Ionicons name="sparkles" size={24} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'SEARCH',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'ORDERS',
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
