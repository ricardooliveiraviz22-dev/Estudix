// ============================================================
//  ESTUDIX — useScreenEnter
//  O bottom-tabs não anima a troca de conteúdo entre abas por
//  padrão. Este hook dispara um fade + leve translateY toda vez
//  que a tela ganha foco, dando sensação de transição suave.
// ============================================================

import { useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { motion } from '../theme';

export function useScreenEnter() {
  const anim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: motion.duration.slow,
        easing: motion.easing.standard,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  const style = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
      },
    ],
  };

  return style;
}
