// ============================================================
//  ESTUDIX — BottomTabNavigator
//  4 tabs: Home, Matérias, Foco, Anotações
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

import HomeScreen        from '../screens/HomeScreen';
import MateriasScreen    from '../screens/MateriasScreen';
import FocoScreen        from '../screens/FocoScreen';
import AnotacoesScreen   from '../screens/AnotacoesScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home:      'home',
  Materias:  'book-open',
  Foco:      'clock',
  Anotacoes: 'file-text',
};

function TabIcon({ routeName, focused, color, size }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  }, [focused]);

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather name={TAB_ICONS[routeName] || 'circle'} size={size} color={color} />
      </Animated.View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function BottomTabNavigator() {
  // Altura/padding derivados da safe area real do aparelho, em vez de
  // constantes fixas por plataforma — respeita tanto o home indicator do
  // iPhone quanto a navigation bar (gestos ou 3 botões) do Android, seja
  // qual for o tamanho de cada um nesse device específico.
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom, 8);
  const tabBarHeight = 50 + tabBarBottomPadding;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: [styles.tabBar, { height: tabBarHeight, paddingBottom: tabBarBottomPadding }],
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon routeName={route.name} focused={focused} color={color} size={20} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarAccessibilityLabel: 'Home' }} />
      <Tab.Screen name="Materias" component={MateriasScreen} options={{ tabBarAccessibilityLabel: 'Matérias' }} />
      <Tab.Screen name="Foco" component={FocoScreen} options={{ tabBarAccessibilityLabel: 'Foco' }} />
      <Tab.Screen name="Anotacoes" component={AnotacoesScreen} options={{ tabBarAccessibilityLabel: 'Anotações' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
