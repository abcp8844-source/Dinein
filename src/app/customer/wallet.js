import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';

export default function Wallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [balance, setBalance] = useState(0);
  const userCountry = userData?.country || 'Thailand';

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const bal = await dbService.getWalletBalance(userData.uid);
      setBalance(bal);
    } catch (error) {
      console.error("Wallet Error:", error);
    }
  };

  const getPaymentMethods = () => {
    if (userCountry === 'Thailand') return ['PromptPay', 'TrueMoney', 'Bank Transfer'];
    if (userCountry === 'Pakistan') return ['EasyPaisa', 'JazzCash', 'Bank Card'];
    return ['Visa/Mastercard', 'Apple Pay', 'Google Pay'];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: colors.secondary }]}>Digital Wallet</Text>
        
        {/* Premium Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: '#1A1A1A', borderColor: colors.primary }]}>
          <Text style={{ color: colors.textDim, fontSize: 16 }}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.primary }]}>
            {balance.toLocaleString()} <Text style={{ fontSize: 18 }}>{userCountry === 'Thailand' ? 'THB' : 'PKR'}</Text>
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Regional Payment Methods ({userCountry})</Text>
        
        {getPaymentMethods().map((method, index) => (
          <TouchableOpacity key={index} style={[styles.methodItem, { borderBottomColor: '#333' }]}>
            <Text style={{ color: colors.secondary, fontSize: 18 }}>{method}</Text>
            <Text style={{ color: colors.primary }}>Connect</Text>
          </TouchableOpacity>
        ))}

        <View style={{ marginTop: 40 }}>
          <PremiumButton title="Add Money to Wallet" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 25 },
  header: { fontSize: 30, fontWeight: 'bold', marginBottom: 30 },
  balanceCard: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 5,
  },
  balanceAmount: { fontSize: 42, fontWeight: 'bold', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
  }
});
