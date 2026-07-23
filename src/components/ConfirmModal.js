// ============================================================
//  ESTUDIX — ConfirmModal
//  Diálogo de confirmação/aviso com a cara do app — substitui
//  o Alert.alert nativo do sistema operacional.
//  Disparado globalmente via useEstudix().showConfirm(...)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalSheet from './ModalSheet';
import Button from './Button';
import { fontFamily, fontSize, spacing, colors } from '../theme';

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  hideCancel = false,
  destructive = false,
  onCancel,
  onConfirmPress,
}) {
  return (
    <ModalSheet visible={visible} onClose={onCancel} title={title}>
      {!!message && <Text style={styles.message}>{message}</Text>}
      <View style={styles.actions}>
        {!hideCancel && (
          <Button label={cancelLabel} onPress={onCancel} variant="ghost" size="md" />
        )}
        <Button
          label={confirmLabel}
          onPress={onConfirmPress}
          variant={destructive ? 'destructive' : 'primary'}
          size="md"
        />
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
