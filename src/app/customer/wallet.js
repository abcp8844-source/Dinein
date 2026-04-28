import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { dbService } from '../../services/dbService';
import PremiumButton from '../../components/PremiumButton';
import * as Animatable from 'react-native-animatable';

export default function Wallet() {
  const { userData } = useAuth();
  const { colors } = useTheme();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🛡️ SYNCED WITH STRATEGIC 15 MARKETS
  const currency = userData?.currencyCode || 'USD';
  const country = userData?.countryName || 'Global';

  useEffect(() => {
    fetchWalletState();
  }, []);

  const fetchWalletState = async () => {
    try {
      const bal = await dbService.getWalletBalance(userData.uid);
      setBalance(bal || 0);
    } catch (error) {
      console.error("[Financial System Error]: Sync failed", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🌍 REGIONAL GATEWAY LOGIC (Strictly Following the 15-Market List)
   */
  const getRegionalPaymentMethods = () => {
    const globalOptions = ['International Wire', 'Global Credit/Debit'];
    
    // Updated Mapping to match your images and list
    const regionalMapping = {
      'Thailand': ['PromptPay QR', 'TrueMoney Wallet'],
      'UAE': ['Apple Pay', 'Etisalat Pay'],
      'Saudi Arabia': ['Mada', 'STC Pay'],
      'China': ['AliPay', 'WeChat Pay'],
      'Japan': ['Line Pay', 'SoftBank'],
      'South Korea': ['Kakao Pay', 'Naver'],
      'Singapore': ['PayNow', 'GrabPay'],
      'Hong Kong': ['Octopus', 'FPS'],
      'Malaysia': ['DuitNow', 'Touch n Go'],
      'Indonesia': ['GoPay', 'OVO'],
      'Vietnam': ['MoMo', 'ZaloPay'],
      'Global': ['Stripe Network']
    };

    return [...(regionalMapping[country] || regionalMapping['Global']), ...globalOptions];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerArea}>
          <Text style={[styles.header, { color: '#FFF' }]}>FINANCIAL CORE</Text>
          <View style={[styles.goldLine, { backgroundColor: colors.primary }]} />
        </Animatable.View>
        
        <Animatable.View 
          animation="zoomIn" 
          delay={300}
          style={[styles.balanceCard, { backgroundColor: '#050505', borderColor: '#111' }]}
        >
          <Text style={[styles.label, { color: '#444' }]}>TOTAL LIQUIDITY ({country})</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <Animatable.Text animation="fadeIn" duration={2000} style={[styles.balanceAmount, { color: colors.primary }]}>
              {balance.toLocaleString()} <Text style={styles.currencyCode}>{currency}</Text>
            </Animatable.Text>
          )}
          <View style={styles.aiStatus}>
            <Text style={styles.aiStatusText}>● SECURE MARKET LINKED</Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600}>
          <Text style={[styles.sectionTitle, { color: '#FFF' }]}>
            DEPOSIT GATEWAYS ({country.toUpperCase()})
          </Text>
          
          <View style={styles.methodsList}>
            {getRegionalPaymentMethods().map((method, index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8} 
                style={[styles.methodItem, { borderBottomColor: '#111' }]}
              >
                <View style={styles.methodInfo}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.methodText, { color: '#AAA' }]}>{method}</Text>
                </View>
                <Text style={[styles.connectLink, { color: colors.primary }]}>ESTABLISH LINK</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={900} style={styles.footer}>
          <PremiumButton title="RECHARGE ACCOUNT" onPress={() => {}} />
          <Text style={styles.safetyNote}>
            🛡️ Your funds are locked in the {currency} node for {country}.
          </Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... styles remain the same
