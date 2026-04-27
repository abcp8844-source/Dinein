import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import PremiumButton from '../components/PremiumButton';

export default function AuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.secondary }]}>
          Welcome to Dining Table
        </Text>
        <Text style={[styles.descText, { color: colors.textDim }]}>
          Please select your role to continue
        </Text>

        <PremiumButton 
          title="Login as Customer" 
          onPress={() => router.push('/customer/login')} 
        />
        
        <PremiumButton 
          title="Login as Owner" 
          type="outline"
          onPress={() => router.push('/owner/login')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  descText: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
});
