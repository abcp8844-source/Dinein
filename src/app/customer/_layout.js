import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function CustomerLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textDim,
      tabBarStyle: {
        backgroundColor: '#121212',
        borderTopColor: '#333',
        height: 60,
        paddingBottom: 8
      },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
        }}
      />
    </Tabs>
  );
}
