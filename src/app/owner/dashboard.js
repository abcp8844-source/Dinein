import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.secondary }]}>Business Suite</Text>
        <Text style={{ color: colors.textDim }}>Manage your operations with precision.</Text>
      </View>
      
      {/* Business Info Card */}
      <View style={[styles.bizCard, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
        <Text style={[styles.bizName, { color: colors.textMain }]}>
          {userData?.email?.split('@')[0].toUpperCase() || 'Partner Store'}
        </Text>
        <Text style={{ color: colors.primary, fontSize: 12 }}>Status: Verified Partner ✅</Text>
      </View>

      <View style={styles.actionSection}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>CORE OPERATIONS</Text>
        
        <PremiumButton 
          title="Incoming Orders 🔔" 
          onPress={() => router.push('/owner/manage-orders')} 
        />

        <PremiumButton 
          title="Add New Product +" 
          onPress={() => router.push('/owner/add-item')} 
        />

        <Text style={[styles.sectionTitle, { color: colors.secondary, marginTop: 20 }]}>GROWTH TOOLS</Text>

        <PremiumButton 
          title="Promotions & Ads 📈" 
          type="outline"
          onPress={() => router.push('/owner/promotion')} 
        />
        
        <PremiumButton 
          title="Business Insights" 
          type="outline"
          onPress={() => {}} 
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={{ color: '#dc3545', fontWeight: 'bold' }}>Terminate Session (Sign Out)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 40 },
  header: { padding: 30, marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  bizCard: {
    margin: 20,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  bizName: { fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  actionSection: { width: '100%', paddingHorizontal: 25 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15, opacity: 0.7 },
  footer: { marginTop: 40, alignItems: 'center' },
  logoutBtn: { padding: 15, borderTopWidth: 0.5, borderTopColor: '#333', width: '100%', alignItems: 'center' }
});
