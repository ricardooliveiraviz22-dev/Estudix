// ============================================================
//  ESTUDIX — Chip
//  Chip selecionável usado para filtros, seletores de matéria,
//  tipo de evento, abas de segmento etc. Duas variantes:
//   - "pill":    chip solto, com borda própria (filtros, tags)
//   - "segment": item de um grupo segmentado (ex: Foco/Curta/Longa),
//                pensado para viver dentro de um container com fundo
//                surfaceMuted já fornecido pela tela.
// ============================================================

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { colors, radii, spacing, fontFamily, fontSize, shadows } from '../theme';

export default function Chip({ label, active, onPress, variant = 'pill', activeColor, icon, style }) {
  const accent = activeColor || colors.accent;

  if (variant === 'segment') {
    return (
      <AnimatedPressable
        onPress={onPress}
        style={[styles.segment, active && [styles.segmentActive, shadows.xs], style]}
      >
        {icon}
        <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.pill,
        active && { backgroundColor: accent + '1A', borderColor: accent },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.pillLabel, active && { color: accent, fontFamily: fontFamily.semibold }]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radii.pill,
  },
  segmentActive: {
    backgroundColor: colors.accent,
  },
  segmentLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  segmentLabelActive: {
    color: colors.white,
  },
});
