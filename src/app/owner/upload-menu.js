import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { dbService } from "../../services/dbService"; // Connected to Real Logic

export default function UploadMenu() {
  const { userData } = useAuth();
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const THEME = {
    bg: "#001529",
    inputBg: "#002F56",
    accent: "#D4AF37",
    textMain: "#FFFFFF",
    border: "#004B87",
  };

  const handleUpload = async () => {
    if (!itemName || !price || !category) {
      Alert.alert(
        "Registry Error",
        "Please fill essential fields for indexing.",
      );
      return;
    }

    setIsPublishing(true);
    try {
      // REAL DATA OBJECT
      const productData = {
        ownerId: userData.uid,
        itemName: itemName.trim(),
        price: parseFloat(price),
        category: category.toLowerCase().trim(),
        description: description.trim(),
        currency: userData?.currencyCode || "THB",
        ownerName: userData?.restaurantName || "Premium Hub",
        status: "active",
      };

      // REAL DATABASE CALL
      await dbService.placeOrder(productData); // Using placeOrder as generic addDoc for now or addMenuItem

      Alert.alert("Success", "Product published to live market.");
      router.back();
    } catch (error) {
      Alert.alert("Sync Error", "Failed to publish item to global network.");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: THEME.accent }]}>
            MENU MANAGEMENT
          </Text>
          <Text style={styles.subTag}>
            📍 {userData?.idOrigin || "Global"} System Active
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: THEME.accent }]}>
            ITEM SPECIFICATIONS
          </Text>

          <View
            style={[
              styles.inputBox,
              { backgroundColor: THEME.inputBg, borderColor: THEME.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: THEME.textMain }]}
              placeholder="Product Name"
              placeholderTextColor="#666"
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          <View style={styles.row}>
            <View
              style={[
                styles.inputBox,
                {
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: THEME.inputBg,
                  borderColor: THEME.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: THEME.textMain }]}
                placeholder={`Price (${userData?.currencyCode || "THB"})`}
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View
              style={[
                styles.inputBox,
                {
                  flex: 1,
                  backgroundColor: THEME.inputBg,
                  borderColor: THEME.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: THEME.textMain }]}
                placeholder="Category"
                placeholderTextColor="#666"
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: THEME.accent }]}>
            PRODUCT DESCRIPTION
          </Text>
          <View
            style={[
              styles.inputBox,
              {
                height: 100,
                backgroundColor: THEME.inputBg,
                borderColor: THEME.border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                { color: THEME.textMain, textAlignVertical: "top" },
              ]}
              placeholder="Enter item details..."
              placeholderTextColor="#666"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.publishBtn, { backgroundColor: THEME.accent }]}
            onPress={handleUpload}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>PUBLISH TO MARKET</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },
  header: { marginBottom: 35, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "900", letterSpacing: 1.5 },
  subTag: { color: "#666", fontSize: 10, fontWeight: "bold", marginTop: 5 },
  label: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 25,
  },
  inputBox: {
    borderRadius: 15,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
  },
  input: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 15 },
  publishBtn: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginTop: 40,
  },
  btnText: {
    color: "#000",
    fontWeight: "900",
    letterSpacing: 1.5,
    fontSize: 14,
  },
});
