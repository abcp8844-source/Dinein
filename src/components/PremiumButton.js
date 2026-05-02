import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

/**
 * EXECUTIVE UI COMPONENT: PREMIUM BUTTON
 * Supports Primary (Filled Gold) and Secondary (Outline Gold) variants.
 */
export default function PremiumButton({ title, onPress, type = "primary", style }) {
  const { colors, borderRadius } = useTheme();
  const isPrimary = type === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : "transparent",
          borderColor: colors.primary,
          borderWidth: isPrimary ? 0 : 1.5,
          borderRadius: borderRadius.button,
          shadowColor: isPrimary ? colors.primary : "transparent",
        },
        style, // Allows custom external styling
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2, // Clearer, professional spacing
  },
});
