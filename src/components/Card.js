// ============================================================
//  ESTUDIX — Card
//  Superfície padrão do app: fundo branco, borda de 1px, cantos
//  arredondados. Substitui o padrão duplicado
//  { backgroundColor: colors.bgCard, borderRadius, ...shadows.sm }.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing, shadows } from '../theme';

export default function Card({ children, style, padding = spacing.lg, noBorder = false, elevated = false }) {
  return (
    <View
      style={[
        styles.card,
        { padding },
        noBorder && { borderWidth: 0 },
        elevated && shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
