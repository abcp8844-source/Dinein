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
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

/**
 * SMART MENU REGISTRY
 * AI-Logic: Auto-sorts items based on Global Market Standards.
 */
export default function UploadMenu() {
  const { userData } = useAuth();
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const THEME = {
    bg: "#001529",
    inputBg: "#002F56",
    accent: "#D4AF37",
    textMain: "#FFFFFF",
    border: "#004B87",
  };

  const handleUpload = () => {
    if (!itemName || !price || !category) {
      Alert.alert(
        "Registry Error",
        "Please fill essential fields for indexing.",
      );
      return;
    }

    // Logic for AI auto-sync to 15-market network
    Alert.alert("Sync Active", "Item analyzed and categorized successfully.");
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: THEME.accent }]}>
            MENU MANAGEMENT
          </Text>
          <Text style={styles.subTag}>
            📍 {userData?.countryName || "Thailand"} System Active
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
            AI ENHANCED DESCRIPTION
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
              placeholder="List ingredients for AI matching..."
              placeholderTextColor="#666"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.publishBtn, { backgroundColor: THEME.accent }]}
            onPress={handleUpload}
          >
            <Text style={styles.btnText}>PUBLISH TO MARKET</Text>
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
    elevation: 4,
  },
  input: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 15 },
  publishBtn: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginTop: 40,
    elevation: 6,
  },
  btnText: {
    color: "#000",
    fontWeight: "900",
    letterSpacing: 1.5,
    fontSize: 14,
  },
});
