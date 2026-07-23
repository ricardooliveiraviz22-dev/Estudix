// ============================================================
//  ESTUDIX — MentorCard
//  Card do Mentor Digital na tela de Foco: mensagem contextual e
//  dinâmica sobre o estado atual da sessão, derivada de dados reais
//  do usuário (ver src/lib/mentor.js). Anima uma transição suave
//  (fade + leve scale) toda vez que a mensagem muda de estado.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from './Card';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

export default function MentorCard({ icon, message }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [message]);

  const contentStyle = {
    opacity: anim,
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }],
  };

  return (
    <Card
      style={styles.card}
      padding={spacing.md}
      accessible
      accessibilityLabel={`Mentor Digital: ${message}`}
    >
      <Animated.View style={contentStyle}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Feather name={icon} size={13} color={colors.accent} />
          </View>
          <Text style={styles.title}>Mentor Digital</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: 6,
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: fontSize.base * 1.45,
  },
});
