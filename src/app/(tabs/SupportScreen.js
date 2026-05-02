import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

/**
 * CUSTOMER TABS LAYOUT
 * Synchronized with SupportScreen.js and Global Theme
 */
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020B18', // Midnight Navy
          borderTopColor: 'rgba(212, 175, 55, 0.2)', // Dimmed Gold Border
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#D4AF37', // Premium Gold
        tabBarInactiveTintColor: '#5D6D7E',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />

      {/* IMPORTANT: Path to your new SupportScreen.js */}
      <Tabs.Screen
        name="SupportScreen"
        options={{
          title: 'SUPPORT',
          tabBarIcon: ({ color }) => <Ionicons name="help-buoy-outline" size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
