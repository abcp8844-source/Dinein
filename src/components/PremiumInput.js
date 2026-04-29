import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function PremiumInput({ placeholder, value, onChangeText, secureTextEntry = false }) {
  const { colors, borderRadius } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      { 
        borderColor: colors.border, 
        backgroundColor: colors.inputBg,
        borderRadius: borderRadius.medium 
      }
    ]}>
      <TextInput
        style={[styles.input, { color: colors.textMain }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        selectionColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
  },
});
