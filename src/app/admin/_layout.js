import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#000' },
      headerTintColor: '#D4AF37', // Gold for Admin Power
      headerTitleStyle: { fontWeight: 'bold' },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="home" options={{ title: 'Global Control Center' }} />
      <Stack.Screen name="manage-users" options={{ title: 'User Management' }} />
    </Stack>
  );
}
