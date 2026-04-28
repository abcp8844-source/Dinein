import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

/**
 * ADMIN NAVIGATION ARCHITECTURE
 * Purpose: Centralized Control for 15-Market Monitoring
 * Theme: Premium Gold & Black (System Authority)
 */
export default function AdminLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#000' },
      headerTintColor: '#D4AF37', // Signature Gold for Admin Authority
      headerTitleStyle: { 
        fontWeight: '900', 
        fontSize: 14, 
        letterSpacing: 1.5 
      },
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    }}>
      {/* Principal Monitoring Hub */}
      <Stack.Screen 
        name="home" 
        options={{ title: 'GLOBAL CONTROL CENTER' }} 
      />
      
      {/* Network Partner Management */}
      <Stack.Screen 
        name="manage-owners" 
        options={{ title: 'NETWORK PARTNERS' }} 
      />

      {/* Support & Help Desk Nodes */}
      <Stack.Screen 
        name="support-tickets" 
        options={{ title: 'SUPPORT MONITOR' }} 
      />
    </Stack>
  );
}
