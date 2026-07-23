// ============================================================
//  ESTUDIX — EmptyState
//  Estado vazio consistente: ícone + título + descrição + ação
//  opcional. O botão de ação reaproveita o mesmo handler que o
//  FAB da tela já usa — não introduz nenhuma lógica nova.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from './Button';
import { colors, spacing, fontFamily, fontSize, radii } from '../theme';

export default function EmptyState({ icon = 'inbox', title, description, actionLabel, onAction, style }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={22} color={colors.textFaint} />
      </View>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!description && <Text style={styles.description}>{description}</Text>}
      {!!actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
});
