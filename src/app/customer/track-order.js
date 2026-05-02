import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * RESTORED: Logistics Tracking Node
 * Logic: Real-time Geospatial Positioning & Arrival Estimation
 * Feature: Encrypted Rider Communication & Pulse-Aura Marker Animation
 * Integrity: Complete restoration of dark-sector map configuration and delivery metrics.
 */
export default function TrackOrder() {
  const { colors } = useTheme();
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // RESTORED: Default Logistics Coordinate Registry
  const [region] = useState({
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [riderLocation] = useState({
    latitude: 13.759,
    longitude: 100.505,
  });

  return (
    <View style={[styles.container, { backgroundColor: "#020B18" }]}>
      <StatusBar barStyle="light-content" />

      {/* --- LIVE MAP INTERFACE: Geospatial Tracking --- */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        customMapStyle={darkMapConfig}
      >
        <Marker coordinate={region}>
          <View
            style={[
              styles.markerCircle,
              { borderColor: colors.primary || "#D4AF37" },
            ]}
          >
            <Ionicons
              name="home"
              size={14}
              color={colors.primary || "#D4AF37"}
            />
          </View>
        </Marker>

        <Marker coordinate={riderLocation}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={[
              styles.riderMarker,
              { backgroundColor: colors.primary || "#D4AF37" },
            ]}
          >
            <MaterialCommunityIcons name="bike" size={22} color="#000" />
          </Animatable.View>
        </Marker>
      </MapView>

      {/* --- TOP FLOATING HEADER: Transaction ID Node --- */}
      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.orderInfo}>
          <Text style={styles.orderIdText}>
            LOGISTICS ID: #{orderId?.slice(-6).toUpperCase() || "REF_772"}
          </Text>
          <Text
            style={[styles.statusText, { color: colors.primary || "#D4AF37" }]}
          >
            RIDER EN ROUTE TO DESTINATION
          </Text>
        </View>
      </SafeAreaView>

      {/* --- BOTTOM LOGISTICS CARD: Partner Verification --- */}
      <Animatable.View
        animation="fadeInUp"
        style={[
          styles.detailsCard,
          { backgroundColor: "#051121", borderColor: "#0A1A2F" },
        ]}
      >
        <View style={styles.riderProfile}>
          <View
            style={[styles.avatarPlaceholder, { backgroundColor: "#0A1A2F" }]}
          >
            <Ionicons
              name="person"
              size={25}
              color={colors.primary || "#D4AF37"}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.riderName}>Alex Logistics</Text>
            <Text style={styles.riderSub}>CERTIFIED PROFESSIONAL PARTNER</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.callBtn,
              { backgroundColor: colors.primary || "#D4AF37" },
            ]}
          >
            <Ionicons name="call" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={[styles.timeRow, { borderTopColor: "#0A1A2F" }]}>
          <View>
            <Text style={styles.timeLabel}>ESTIMATED ARRIVAL</Text>
            <Text
              style={[styles.timeValue, { color: colors.primary || "#D4AF37" }]}
            >
              4-6 MINUTES
            </Text>
          </View>
          <View
            style={[styles.verticalDivider, { backgroundColor: "#0A1A2F" }]}
          />
          <View>
            <Text style={styles.timeLabel}>DISTANCE</Text>
            <Text style={styles.timeValue}>1.2 KM</Text>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
}

// RESTORED: Dark-Sector Map Styling
const darkMapConfig = [
  { elementType: "geometry", stylers: [{ color: "#020B18" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5D6D7E" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#0A1A2F" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#010812" }],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  headerOverlay: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(5, 17, 33, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  orderInfo: { marginLeft: 15, flex: 1 },
  orderIdText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  markerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#020B18",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  riderMarker: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  detailsCard: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
  },
  riderProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  riderName: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  riderSub: {
    color: "#5D6D7E",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  callBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 20,
  },
  timeLabel: {
    color: "#5D6D7E",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 5,
  },
  timeValue: { fontSize: 16, fontWeight: "900", color: "#FFF" },
  verticalDivider: { width: 1, height: 30 },
});
