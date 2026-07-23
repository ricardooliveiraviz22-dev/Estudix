// ============================================================
//  ESTUDIX — PopIn
//  Envolve o conteúdo de um Modal existente e anima um efeito de
//  "pop" (escala + fade) sempre que a prop `visible` fica true.
//  Não interfere no Modal em si — zero mudança de lógica/estado.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function PopIn({ visible, style, children }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 260,
        mass: 0.7,
      }).start();
    }
  }, [visible]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <Animated.View style={[style, { opacity: anim, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
