import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * ADMIN TERMINAL: User Management & Suspension Node
 * Logic: Real-time status toggle for customer accounts.
 */
export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // Fetch all users with 'customer' role
  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "customer"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error("DATA_FETCH_ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Secure toggle function for Block/Unblock
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    
    Alert.alert(
      "AUTHORITY CONFIRMATION",
      `Are you sure you want to ${newStatus.toUpperCase()} this user?`,
      [
        { text: "CANCEL", style: "cancel" },
        { 
          text: "CONFIRM", 
          onPress: async () => {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });
            fetchCustomers(); // Refresh the node list
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name || "UNNAMED USER"}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={[styles.statusText, { color: item.status === "active" ? "#4CAF50" : "#FF3B30" }]}>
                STATUS: {item.status?.toUpperCase() || "ACTIVE"}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => toggleUserStatus(item.id, item.status)}
              style={[styles.actionBtn, { backgroundColor: item.status === "active" ? "#FF3B30" : "#4CAF50" }]}
            >
              <MaterialCommunityIcons 
                name={item.status === "active" ? "account-off" : "account-check"} 
                size={22} 
                color="#FFF" 
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18", padding: 15 },
  userCard: { 
    backgroundColor: "#0A1A2F", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B2631'
  },
  userName: { color: "#FFF", fontSize: 15, fontWeight: "900", letterSpacing: 0.5 },
  userEmail: { color: "#5D6D7E", fontSize: 11, marginTop: 2 },
  statusText: { fontSize: 10, fontWeight: "900", marginTop: 5, letterSpacing: 1 },
  actionBtn: { padding: 12, borderRadius: 10, marginLeft: 10 }
});
