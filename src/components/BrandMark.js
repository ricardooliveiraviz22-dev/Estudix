// ============================================================
//  ESTUDIX — BrandMark
//  Selo simples da marca (sem depender de um ícone de capelo,
//  que não existe no set de ícones de linha usado no app).
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, radii } from '../theme';

export default function BrandMark({ size = 56 }) {
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Text style={[styles.letter, { fontSize: size * 0.46 }]}>E</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
});
