import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function PremiumButton({ title, onPress, type = "primary" }) {
  const { colors, borderRadius } = useTheme();

  const isPrimary = type === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : "transparent",
          borderColor: colors.primary,
          borderWidth: isPrimary ? 0 : 1.5,
          borderRadius: borderRadius.button,
          shadowColor: colors.primary,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: isPrimary ? colors.background : colors.primary },
        ]}
      >
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});
