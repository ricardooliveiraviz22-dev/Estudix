// ============================================================
//  ESTUDIX — Input
//  Campo de texto padrão do app: label opcional + caixa com borda
//  de 1px. Substitui o `styles.input` duplicado em várias telas.
// ============================================================

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing, fontFamily, fontSize } from '../theme';

export default function Input({ label, style, inputStyle, ...rest }) {
  return (
    <View style={[styles.wrap, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, rest.multiline && styles.multiline, inputStyle]}
        placeholderTextColor={colors.textFaint}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.xs + 2,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.text,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
});
