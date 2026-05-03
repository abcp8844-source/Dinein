import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
// Corrected the path to access src/services/firebaseConfig
import { db } from "../../services/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * ADMIN SUPPORT CENTER: AI & Manual Ticket Management
 * Purpose: Resolves issues sent from Customer Tabs or Settings.
 */
export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);

  // Live listener for support requests from AI or Support Tab
  useEffect(() => {
    const q = query(
      collection(db, "support_tickets"),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    });

    return () => unsubscribe();
  }, []);

  // Update ticket status to 'resolved'
  const closeTicket = async (ticketId) => {
    try {
      const ticketRef = doc(db, "support_tickets", ticketId);
      await updateDoc(ticketRef, { status: "resolved" });
      Alert.alert("SUCCESS", "Ticket marked as resolved.");
    } catch (error) {
      console.error("UPDATE_ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.ticketCard,
              {
                borderColor: item.status === "pending" ? "#D4AF37" : "#1B2631",
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.userId}>
                USER ID: {item.userId?.substring(0, 8)}...
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.status === "pending" ? "#FF3B30" : "#4CAF50",
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.issueText}>
              {item.message || "Requesting human intervention."}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() =>
                  Linking.openURL(
                    `mailto:${item.userEmail || "support@example.com"}`,
                  )
                }
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={16}
                  color="#000"
                />
                <Text style={styles.btnText}>CONTACT USER</Text>
              </TouchableOpacity>

              {item.status === "pending" && (
                <TouchableOpacity
                  style={styles.resolveBtn}
                  onPress={() => closeTicket(item.id)}
                >
                  <MaterialCommunityIcons
                    name="check-all"
                    size={16}
                    color="#FFF"
                  />
                  <Text style={[styles.btnText, { color: "#FFF" }]}>
                    RESOLVE
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18", padding: 15 },
  ticketCard: {
    backgroundColor: "#0A1A2F",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userId: { color: "#5D6D7E", fontSize: 10, fontWeight: "900" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  badgeText: { color: "#FFF", fontSize: 8, fontWeight: "900" },
  issueText: { color: "#FFF", fontSize: 14, lineHeight: 20, marginBottom: 15 },
  actionRow: { flexDirection: "row", gap: 10 },
  contactBtn: {
    flex: 1,
    backgroundColor: "#D4AF37",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  resolveBtn: {
    flex: 1,
    backgroundColor: "#1B2631",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  btnText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
