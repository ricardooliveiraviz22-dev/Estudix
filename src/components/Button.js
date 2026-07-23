// ============================================================
//  ESTUDIX — Button
//  Botão padrão do app: variantes primary/secondary/ghost/destructive,
//  tamanhos md/lg. Usa AnimatedPressable por baixo (feedback de toque
//  consistente em qualquer lugar do app).
// ============================================================

import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { colors, radii, spacing, fontFamily, fontSize, shadows } from '../theme';

const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: colors.accent },
    label: { color: colors.white },
    shadow: shadows.primaryBtn,
  },
  secondary: {
    container: { backgroundColor: colors.surfaceMuted },
    label: { color: colors.text },
    shadow: null,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.textMuted },
    shadow: null,
  },
  destructive: {
    container: { backgroundColor: colors.dangerMuted },
    label: { color: colors.danger },
    shadow: null,
  },
};

const SIZE_STYLES = {
  md: { paddingVertical: 10, paddingHorizontal: spacing.lg, fontSize: fontSize.md, borderRadius: radii.pill },
  lg: { paddingVertical: 14, paddingHorizontal: spacing.xl, fontSize: fontSize.lg, borderRadius: radii.pill },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  style,
}) {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal, borderRadius: s.borderRadius },
        v.container,
        v.shadow,
        fullWidth && { alignSelf: 'stretch' },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.label.color} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { fontSize: s.fontSize }, v.label]}>{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  label: {
    fontFamily: fontFamily.semibold,
  },
  disabled: {
    opacity: 0.45,
  },
});
