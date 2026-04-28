import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * MASTER TAB INTERFACE
 * Roles: Customer | Owner | Admin Support Logic
 * Global Market: 15 Regions System
 */
export default function TabIndex() {
  const { userData, user } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  // --- SMART SUPPORT LOGIC: Transfers Data to Admin ---
  const triggerSupportAlert = (type) => {
    const roleName = userData?.role === 'admin' ? 'SYSTEM' : userData?.role?.toUpperCase();
    
    Alert.alert(
      "ADMIN SUPPORT LINK",
      `Send a direct diagnostic alert to the Super Admin?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "TRANSFER TO ADMIN", 
          onPress: async () => {
            setLoading(true);
            await dbService.sendSupportTicket({
              senderId: user.uid,
              senderEmail: user.email,
              role: userData?.role,
              issueType: type,
              region: userData?.countryName || 'Global',
              timestamp: new Date().toISOString()
            });
            setLoading(false);
            Alert.alert("Transferred", "Your request has been sent to the Admin Control Center.");
          }
        }
      ]
    );
  };

  // --- UI RENDER: CUSTOMER VIEW ---
  const renderCustomerHome = () => (
    <View style={styles.content}>
      <Text style={[styles.label, { color: colors.primary }]}>CUSTOMER HUB</Text>
      <Text style={styles.welcomeText}>Welcome, {userData?.name || 'Guest'}</Text>
      
      <TouchableOpacity style={styles.supportCard} onPress={() => triggerSupportAlert('Order Help')}>
        <Ionicons name="help-buoy-outline" size={24} color={colors.primary} />
        <Text style={styles.supportCardText}>Contact Admin for Order Help</Text>
      </TouchableOpacity>
    </View>
  );

  // --- UI RENDER: OWNER VIEW ---
  const renderOwnerHome = () => (
    <View style={styles.content}>
      <Text style={[styles.label, { color: '#28a745' }]}>PARTNER DASHBOARD</Text>
      <Text style={styles.welcomeText}>Manager: {userData?.restaurantName || 'Owner'}</Text>
      
      <TouchableOpacity style={[styles.supportCard, { borderColor: '#28a745' }]} onPress={() => triggerSupportAlert('Business Support')}>
        <MaterialCommunityIcons name="store-cog" size={24} color="#28a745" />
        <Text style={styles.supportCardText}>Request Business Technical Support</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#000' }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.primary }]}>DINING TABLE</Text>
        <Text style={styles.regionTag}>{userData?.countryName || 'Global Network'}</Text>
      </View>

      <Animatable.View animation="fadeInUp" duration={800}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          userData?.role === 'owner' ? renderOwnerHome() : renderCustomerHome()
        )}
      </Animatable.View>

      {/* --- TRANSACTION SYSTEM HEALTH --- */}
      <View style={styles.footerInfo}>
        <MaterialCommunityIcons name="shield-check-outline" size={14} color="#333" />
        <Text style={styles.footerText}>Secure 15-Market Transaction Node Active</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: { marginTop: 40, marginBottom: 30 },
  brand: { fontSize: 28, fontWeight: '200', letterSpacing: 6 },
  regionTag: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 5 },
  content: { marginTop: 20 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  welcomeText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  supportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 25, 
    backgroundColor: '#080808', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#111' 
  },
  supportCardText: { color: '#AAA', marginLeft: 15, fontSize: 14, fontWeight: '500' },
  footerInfo: { marginTop: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#222', fontSize: 10, marginLeft: 8, fontWeight: 'bold' }
});
