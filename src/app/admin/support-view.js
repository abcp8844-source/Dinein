import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { dbService } from "../../services/dbService";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

/**
 * ADMINISTRATIVE SUPPORT CONSOLE
 * Purpose: Global Monitoring of Customer and Owner Issues
 * Market: 15-Region Real-time Sync
 */
export default function SupportView() {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener compatible with Firestore
    const unsubscribe = dbService.listenToSupportTickets((data) => {
      setTickets(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderTicket = ({ item }) => (
    <Animatable.View animation="fadeInLeft" style={styles.ticketCard}>
      <View style={styles.cardHeader}>
        {/* Role Identification: Owner vs Customer */}
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: item.role === "owner" ? "#1B3921" : "#111" },
          ]}
        >
          <Text
            style={[
              styles.roleText,
              { color: item.role === "owner" ? "#4ADE80" : colors.primary },
            ]}
          >
            {item.role?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timeText}>{item.timestamp?.split("T")[0]}</Text>
      </View>

      <Text style={styles.senderEmail}>{item.senderEmail}</Text>
      <Text style={styles.issueText}>
        {item.issueType || "System Assistance"}
      </Text>

      <View style={styles.locationRow}>
        <MaterialCommunityIcons name="earth" size={12} color="#444" />
        <Text style={styles.locationText}>
          {item.region || "Global Market"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>RESOLVE TICKET</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#FFF" }]}>SUPPORT TERMINAL</Text>
        <Text style={styles.subtitle}>Unified Global Monitoring Node</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No active support requests detected.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { padding: 30, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: "900", letterSpacing: 2 },
  subtitle: { color: "#333", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  listPadding: { padding: 25 },
  ticketCard: {
    backgroundColor: "#050505",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#111",
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  roleText: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  timeText: { color: "#222", fontSize: 10, fontWeight: "bold" },
  senderEmail: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  issueText: { color: "#666", fontSize: 12, marginTop: 5, lineHeight: 18 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  locationText: {
    color: "#444",
    fontSize: 10,
    marginLeft: 5,
    fontWeight: "900",
  },
  actionBtn: {
    marginTop: 20,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#000", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  emptyText: {
    color: "#111",
    textAlign: "center",
    marginTop: 100,
    fontWeight: "900",
    fontSize: 12,
  },
});
