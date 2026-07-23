// ============================================================
//  ESTUDIX — App.js
// ============================================================

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initNotifications } from './src/lib/notifications';

// Fontes Google — Inter para texto e Playfair Display para títulos grandes
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';

import BrandMark from './src/components/BrandMark';
import { EstudixProvider } from './src/context/EstudixContext';
import { colors, fontFamily } from './src/theme';

import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useEstudix } from './src/context/EstudixContext';

function AppContent() {
  const { isStoreLoaded, state } = useEstudix();

  if (!isStoreLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <BrandMark size={64} />
        <Text style={styles.loadingTitle}>Estudix</Text>
        <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!state.settings.onboarded) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
  });

  useEffect(() => {
    initNotifications();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <EstudixProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <AppContent />
      </EstudixProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  loadingTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    color: colors.text,
    marginTop: 16,
  }
});


