// ============================================================
//  ESTUDIX — ModalSheet
//  Encapsula o padrão repetido em várias telas: Modal transparente
//  + overlay + card com efeito pop-in + título/subtítulo.
// ============================================================

import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import PopIn from './PopIn';
import { colors, radii, spacing, fontFamily, fontSize, shadows } from '../theme';

export default function ModalSheet({ visible, onClose, title, subtitle, children }) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <PopIn visible={!!visible} style={styles.content}>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </PopIn>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 17, 23, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 420,
    maxHeight: '86%',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadows.lg,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.h2,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
});
