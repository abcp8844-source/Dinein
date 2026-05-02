import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // کسٹمرز کا ڈیٹا لوڈ کرنے کا فنکشن
  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "customer"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // کسٹمر کو بلاک یا ان بلاک کرنے کا فنکشن
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    
    Alert.alert(
      "تصدیق کریں",
      `کیا آپ اس کسٹمر کو ${newStatus === "active" ? "بحال" : "بلاک"} کرنا چاہتے ہیں؟`,
      [
        { text: "کینسل", style: "cancel" },
        { 
          text: "ہاں، کر دو", 
          onPress: async () => {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });
            fetchCustomers(); // لسٹ کو تازہ (Refresh) کریں
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
              <Text style={styles.userName}>{item.name || "Unknown User"}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={[styles.statusText, { color: item.status === "active" ? "#4CAF50" : "#FF3B30" }]}>
                حالت: {item.status === "active" ? "Active" : "Blocked"}
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
  userName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  userEmail: { color: "#5D6D7E", fontSize: 12, marginTop: 2 },
  statusText: { fontSize: 11, fontWeight: "900", marginTop: 5, textTransform: 'uppercase' },
  actionBtn: { padding: 12, borderRadius: 10, marginLeft: 10 }
});
