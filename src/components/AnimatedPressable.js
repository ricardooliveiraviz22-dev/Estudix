// ============================================================
//  ESTUDIX — AnimatedPressable
//  Substituto "drop-in" do TouchableOpacity: mesma API, mas com
//  microinteração de encolher + spring ao tocar (Reanimated).
// ============================================================

import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { motion } from '../theme';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({
  style,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  scaleTo = 0.96,
  children,
  ...rest
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e) => {
    scale.value = withSpring(scaleTo, motion.spring.press);
    onPressIn && onPressIn(e);
  };

  const handlePressOut = (e) => {
    scale.value = withSpring(1, motion.spring.press);
    onPressOut && onPressOut(e);
  };

  return (
    <AnimatedPressableBase
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
