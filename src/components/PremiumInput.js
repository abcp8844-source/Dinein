import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

/**
 * EXECUTIVE UI COMPONENT: PREMIUM INPUT
 * Optimized for high-contrast visibility and international character support.
 */
export default function PremiumInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default", // Useful for phone numbers or emails
}) {
  const { colors, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          borderRadius: borderRadius.medium,
        },
      ]}
    >
      <TextInput
        style={[styles.input, { color: colors.textMain }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        autoCapitalize="none" // Essential for emails/passwords
        cursorColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 58, // Slightly taller for a more premium touch
    borderWidth: 1.5,
    marginVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});
