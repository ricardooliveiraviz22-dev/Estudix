// ============================================================
//  ESTUDIX — GlowRing
//  Halo de brilho atrás do círculo do Pomodoro. Acompanha a cor
//  da sessão ativa e vai diminuindo de intensidade conforme o
//  tempo restante encolhe. Implementado só com Views + opacity
//  (sem SVG blur) para render previsível em iOS/Android/Web.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { shadows } from '../theme';

export default function GlowRing({ size, color, progress, active }) {
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop;
    if (active) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, { toValue: 1, duration: 1400, useNativeDriver: true }),
          Animated.timing(breathe, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      breathe.setValue(0);
    }
    return () => loop && loop.stop();
  }, [active]);

  const breatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.018] });

  const layerOpacity = (min, max) =>
    progress.interpolate({ inputRange: [0, 1], outputRange: [min, max], extrapolate: 'clamp' });

  const layers = [
    { extra: 70, opacityRange: [0, 0.06] },
    { extra: 42, opacityRange: [0, 0.10] },
    { extra: 18, opacityRange: [0, 0.16] },
  ];

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrapper, { width: size, height: size, transform: [{ scale: breatheScale }] }]}
    >
      {layers.map((layer, i) => {
        const layerSize = size + layer.extra;
        return (
          <Animated.View
            key={i}
            style={[
              styles.layer,
              {
                width: layerSize,
                height: layerSize,
                borderRadius: layerSize / 2,
                backgroundColor: color,
                opacity: layerOpacity(layer.opacityRange[0], layer.opacityRange[1]),
              },
              i === layers.length - 1 && shadows.glow(color, 0.22, 14),
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
  },
});
