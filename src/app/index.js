import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

/**
 * ENTRY POINT ROUTER
 * Purpose: Initial session verification and global redirection.
 * Theme: Premium Dark (15-Market Infrastructure)
 */
export default function Index() {
  const { loading, user } = useAuth();

  // Show a high-performance loader while verifying session state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  /**
   * SECURITY PROTOCOL:
   * If a session exists, the role-based logic in _layout.js 
   * will automatically intercept and route to Admin, Owner, or Customer.
   * If no session, we default to the Secure Login gateway.
   */
  if (user) {
    // Return null and let the useEffect in _layout.js handle the redirection
    return null;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
