import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

/**
 * ENTRY POINT ROUTER (MASTER NODE)
 * Purpose: Initial session verification & global role-based redirection.
 * Infrastructure: 15-Market Integrated Security Logic
 */
export default function Index() {
  const { loading, user, userData } = useAuth();

  // Show high-performance loader while checking system state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  /**
   * SECURITY PROTOCOL:
   * 1. If no session exists, force redirect to the Secure Login gateway.
   * 2. If session exists, let the Root Layout (_layout.js) handle the 
   * precise role-based routing (Admin, Owner, or Customer).
   */
  if (user) {
    // If user is authenticated, we return null and let _layout.js handle navigation
    // This prevents "Double Redirection" crashes.
    return null;
  }

  // Default fallback to Secure Login
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
