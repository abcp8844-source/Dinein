import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'; // 📍 Optimized Map Engine
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

/**
 * GLOBAL LOGISTICS TRACKER
 * Features: Real-time Geo-fencing | Live Rider Telemetry
 * Optimized for 200MB-250MB App Footprint
 */
export default function TrackOrder() {
  const { colors } = useTheme();
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // 🛡️ Initial Mock Coordinates (To be replaced by Firebase Live Data)
  const [region] = useState({
    latitude: 13.7563, // Example: Bangkok
    longitude: 100.5018,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [riderLocation] = useState({
    latitude: 13.7590,
    longitude: 100.5050,
  });

  return (
    <View style={styles.container}>
      {/* --- LIVE MAP INTERFACE --- */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        customMapStyle={mapStyle} // 🌑 Dark Mode Map
      >
        <Marker coordinate={region} title="Your Location">
          <View style={[styles.markerCircle, {borderColor: colors.primary}]}>
            <Ionicons name="home" size={15} color={colors.primary} />
          </View>
        </Marker>

        <Marker coordinate={riderLocation} title="Rider">
          <Animatable.View animation="pulse" iterationCount="infinite" style={styles.riderMarker}>
            <Ionicons name="bicycle" size={20} color="#000" />
          </Animatable.View>
        </Marker>
      </MapView>

      {/* --- TOP FLOATING HEADER --- */}
      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.orderInfo}>
          <Text style={styles.orderIdText}>TRACKING ORDER #{orderId?.slice(-6).toUpperCase()}</Text>
          <Text style={[styles.statusText, {color: colors.primary}]}>RIDER IS NEARBY</Text>
        </View>
      </SafeAreaView>

      {/* --- BOTTOM LOGISTICS CARD --- */}
      <Animatable.View animation="fadeInUp" style={styles.detailsCard}>
        <View style={styles.riderProfile}>
          <View style={styles.avatarPlaceholder} />
          <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.riderName}>Alex Logistics</Text>
            <Text style={styles.riderSub}>Certified Professional Delivery</Text>
          </View>
          <TouchableOpacity style={[styles.callBtn, {backgroundColor: colors.primary}]}>
            <Ionicons name="call" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <View>
            <Text style={styles.timeLabel}>ESTIMATED ARRIVAL</Text>
            <Text style={styles.timeValue}>4-6 MINUTES</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View>
            <Text style={styles.timeLabel}>DISTANCE</Text>
            <Text style={styles.timeValue}>1.2 KM</Text>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
}

const mapStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#212121" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#303030" } ] } ];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, padding: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 45, height: 45, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  orderInfo: { marginLeft: 15, flex: 1 },
  orderIdText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  statusText: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  markerCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#000', borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  riderMarker: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  detailsCard: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#0A0A0A', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#1A1A1A' },
  riderProfile: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A1A1A' },
  riderName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  riderSub: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  callBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1A1A1A', paddingTop: 20 },
  timeLabel: { color: '#444', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  timeValue: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  verticalDivider: { width: 1, height: 30, backgroundColor: '#1A1A1A' }
});
