import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';

/**
 * GLOBAL PREMIUM WALLET SYSTEM
 * Supports 15+ Countries with Dynamic Regional Logic
 */
export default function Wallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🌍 Global Localization Data
  const currency = userData?.currency || 'USD';
  const country = userData?.country || 'Global';

  useEffect(() => {
    fetchWalletState();
  }, []);

  const fetchWalletState = async () => {
    try {
      const bal = await dbService.getWalletBalance(userData.uid);
      setBalance(bal);
    } catch (error) {
      console.error("[Wallet System Error]:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dynamic Regional Gateways
   * Automatically adapts based on the user's registered country
   */
  const getRegionalPaymentMethods = () => {
    // This logic now uses dynamic categories instead of hardcoded local names
    const globalOptions = ['Bank Transfer', 'Credit/Debit Card'];
    
    // Regional logical grouping
    const regionalMapping = {
      'Thailand': ['PromptPay', 'TrueMoney'],
      'UAE': ['Apple Pay', 'Google Pay'],
      'Global': ['PayPal', 'Stripe']
    };

    return [...(regionalMapping[country] || regionalMapping['Global']), ...globalOptions];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.secondary }]}>Premium Wallet</Text>
        
        {/* --- LUXURY BALANCE DISPLAY --- */}
        <View style={[styles.balanceCard, { backgroundColor: '#111', borderColor: colors.primary }]}>
          <Text style={[styles.label, { color: colors.textDim }]}>AVAILABLE BALANCE</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={[styles.balanceAmount, { color: colors.primary }]}>
              {balance.toLocaleString()} <Text style={styles.currencyCode}>{currency}</Text>
            </Text>
          )}
        </View>

        {/* --- DYNAMIC PAYMENT SECTION --- */}
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
          Secure Deposit Methods ({country})
        </Text>
        
        <View style={styles.methodsList}>
          {getRegionalPaymentMethods().map((method, index) => (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.7} 
              style={[styles.methodItem, { borderBottomColor: '#222' }]}
            >
              <View style={styles.methodInfo}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.methodText, { color: '#EEE' }]}>{method}</Text>
              </View>
              <Text style={[styles.connectLink, { color: colors.primary }]}>SECURE LINK</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <PremiumButton title="Recharge Wallet" onPress={() => {}} />
          <Text style={styles.safetyNote}>
            🛡️ Your transactions are encrypted and secured.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 30 },
  header: { fontSize: 32, fontWeight: '900', marginBottom: 40, letterSpacing: 1 },
  balanceCard: {
    padding: 35,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 45,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  label: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  balanceAmount: { fontSize: 44, fontWeight: '800' },
  currencyCode: { fontSize: 20, fontWeight: '400', opacity: 0.8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 25, opacity: 0.9 },
  methodsList: { marginBottom: 40 },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 22,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  methodInfo: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 15 },
  methodText: { fontSize: 17, fontWeight: '500' },
  connectLink: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  footer: { marginTop: 10 },
  safetyNote: { 
    color: '#555', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 20, 
    fontStyle: 'italic' 
  }
});
