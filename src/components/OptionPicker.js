// ============================================================
//  ESTUDIX — OptionPicker
//  Lista de opções selecionáveis com destaque na ativa.
//  Extraído do seletor de nível escolar duplicado entre
//  OnboardingScreen e ConfiguracoesScreen.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, fontFamily, radii } from '../theme';

export default function OptionPicker({ options, value, onChange, iconSize = 20, style }) {
  return (
    <View style={[styles.list, style]}>
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <AnimatedPressable
            key={option.id}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => onChange(option.id)}
          >
            <View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
              {!!option.sublabel && (
                <Text style={[styles.sub, isActive && styles.subActive]}>{option.sublabel}</Text>
              )}
            </View>
            {isActive && <Feather name="check-circle" size={iconSize} color={colors.white} />}
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { width: '100%', gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, paddingVertical: 14, paddingHorizontal: 18,
  },
  optionActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  label: { fontFamily: fontFamily.semibold, fontSize: 15, color: colors.text },
  labelActive: { color: colors.white },
  sub: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  subActive: { color: 'rgba(255,255,255,0.75)' },
});
