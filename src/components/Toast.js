// ============================================================
//  ESTUDIX — Toast
//  Feedback rápido e não-bloqueante, estilizado com o design
//  system do app (substitui Alert.alert para mensagens simples)
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radii, shadows, motion } from '../theme';

export default function Toast({ message }) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 260 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }).start();
    }
  }, [message]);

  if (!displayMessage) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { bottom: insets.bottom + 84 },
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{displayMessage}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    left: 20,
    right: 20,
    backgroundColor: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    zIndex: 999,
    alignItems: 'center',
    ...shadows.md,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
});
