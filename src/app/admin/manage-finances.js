import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManageFinances() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
  };

  const updateBalance = async (userId, newBalance) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { balance: parseFloat(newBalance) });
      Alert.alert("SUCCESS", "Balance updated successfully.");
      fetchFinancialData();
    } catch (error) {
      console.error("FINANCE_ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.financeCard}>
            <View>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.balanceText}>
                Current: ${item.balance || 0}
              </Text>
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="New Bal"
                placeholderTextColor="#5D6D7E"
                keyboardType="numeric"
                onChangeText={(val) => (item.tempBalance = val)}
              />
              <TouchableOpacity
                onPress={() => updateBalance(item.id, item.tempBalance)}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={28}
                  color="#4CAF50"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18", padding: 15 },
  financeCard: {
    backgroundColor: "#0A1A2F",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: { color: "#FFF", fontWeight: "bold" },
  balanceText: { color: "#D4AF37", fontSize: 12 },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    backgroundColor: "#1B2631",
    color: "#FFF",
    padding: 8,
    borderRadius: 8,
    width: 80,
    textAlign: "center",
  },
});
