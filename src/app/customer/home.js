import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function CustomerHome() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.welcomeText, { color: colors.secondary }]}>
        Welcome, {userData?.email?.split('@')[0] || 'Guest'}
      </Text>
      <Text style={[styles.infoText, { color: colors.textDim }]}>
        Region: {userData?.country || 'Not Set'}
      </Text>
      
      <View style={styles.menuPlaceholder}>
        <Text style={{ color: colors.primary, fontSize: 18 }}>
          Discover Premium Dining
        </Text>
      </View>

      <PremiumButton 
        title="Sign Out" 
        type="outline" 
        onPress={logout} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 30,
  },
  menuPlaceholder: {
    height: 200,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  }
});
