import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PremiumButton from '../../components/PremiumButton';

export default function OwnerDashboard() {
  const { userData, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.secondary }]}>
        Business Dashboard
      </Text>
      
      <View style={[styles.statsCard, { borderColor: colors.primary }]}>
        <Text style={[styles.bizName, { color: colors.textMain }]}>
          {userData?.country || 'Business Account'}
        </Text>
        <Text style={[styles.bizEmail, { color: colors.textDim }]}>
          {userData?.email}
        </Text>
      </View>

      <View style={styles.actionSection}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          Inventory Management
        </Text>
        
        <PremiumButton 
          title="Add New Item" 
          onPress={() => router.push('/owner/add-item')} 
        />
        
        <PremiumButton 
          title="View Orders" 
          onPress={() => {}} 
        />
      </View>

      <PremiumButton 
        title="Sign Out" 
        type="outline" 
        onPress={logout} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  statsCard: {
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(128, 0, 0, 0.1)',
    marginBottom: 30,
    alignItems: 'center',
  },
  bizName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bizEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  actionSection: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 15,
    fontWeight: '600',
  },
});
