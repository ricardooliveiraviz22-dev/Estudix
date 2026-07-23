// ============================================================
//  ESTUDIX — Checkbox
//  Caixa de seleção simples com rótulo, usada no aceite de termos.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, fontFamily, radii } from '../theme';

export default function Checkbox({ checked, onToggle, children, style }) {
  return (
    <AnimatedPressable style={[styles.row, style]} onPress={onToggle}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Feather name="check" size={13} color={colors.white} />}
      </View>
      <Text style={styles.label}>{children}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  box: {
    width: 22, height: 22, borderRadius: radii.xs, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
    backgroundColor: colors.surface,
  },
  boxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  label: { flex: 1, fontFamily: fontFamily.regular, fontSize: 13, color: colors.text, lineHeight: 19 },
});
