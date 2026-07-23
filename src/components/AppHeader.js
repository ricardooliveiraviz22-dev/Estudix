// ============================================================
//  ESTUDIX — AppHeader
//  Header comum a todas as telas:
//  [hambúrguer | voltar] ─────── [sino de notificações]
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

/**
 * @param {object}   props
 * @param {object}   props.navigation  — objeto de navegação do React Navigation
 * @param {boolean}  props.showBack    — exibe botão Voltar em vez do hambúrguer
 * @param {function} [props.onBack]    — override para a ação de voltar
 */
export default function AppHeader({ navigation, showBack = false, onBack }) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('BottomTabs', { screen: 'Home' });
  };

  const handleNotifications = () => {
    navigation.navigate('BottomTabs', { screen: 'Anotacoes' });
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.6}>
          <Feather name="arrow-left" size={16} color={colors.text} />
          <Text style={styles.backLabel}>Voltar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Menu')}
          accessibilityLabel="Abrir menu"
          activeOpacity={0.6}
        >
          <Feather name="menu" size={20} color={colors.text} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={handleNotifications}
        accessibilityLabel="Ver anotações"
        activeOpacity={0.6}
      >
        <Feather name="bell" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
    zIndex: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.text,
  },
});
