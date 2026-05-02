import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManageOwners() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const q = query(collection(db, "users"), where("role", "==", "owner"));
    const querySnapshot = await getDocs(q);
    setOwners(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const terminateOwner = async (ownerId, status) => {
    const action = status === "active" ? "BLOCK" : "ACTIVATE";
    Alert.alert(
      "OWNER CONTROL",
      `Do you want to ${action} this business owner?`,
      [
        { text: "CANCEL" },
        {
          text: "CONFIRM",
          onPress: async () => {
            await updateDoc(doc(db, "users", ownerId), {
              status: status === "active" ? "blocked" : "active",
            });
            fetchOwners();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={owners}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>
                {item.businessName || "PARTNER NODE"}
              </Text>
              <Text style={styles.sub}>
                {item.email} | {item.idOrigin}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => terminateOwner(item.id, item.status)}
            >
              <MaterialCommunityIcons
                name="power"
                size={24}
                color={item.status === "active" ? "#4CAF50" : "#FF3B30"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020B18", padding: 20 },
  card: {
    backgroundColor: "#0A1A2F",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { color: "#D4AF37", fontSize: 14, fontWeight: "900" },
  sub: { color: "#5D6D7E", fontSize: 10, marginTop: 5 },
});
