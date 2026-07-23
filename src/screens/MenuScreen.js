import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedPressable from '../components/AnimatedPressable';
import { colors, fontFamily, fontSize, radii, shadows } from '../theme';
import { useEstudix, getGreeting } from '../context/EstudixContext';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Home',               icon: 'home',     screen: 'BottomTabs',    tab: 'Home'    },
  { label: 'Gerenciar Matérias', icon: 'book-open', screen: 'BottomTabs',    tab: 'Materias' },
  { label: 'Cronômetro Foco',    icon: 'clock',    screen: 'BottomTabs',    tab: 'Foco'    },
  { label: 'Calendário',         icon: 'calendar', screen: 'Calendario',    tab: null      },
  { divider: true },
  { label: 'Configurações',      icon: 'settings', screen: 'Configuracoes', tab: null      },
];

export default function MenuScreen() {
  const navigation = useNavigation();
  const { state } = useEstudix();
  const { userName } = state.settings;
  const saudacao = getGreeting();

  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 12
    }).start();
  }, []);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    });
  };

  const handleNav = (item) => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
      if (item.screen === 'BottomTabs') {
        navigation.navigate('BottomTabs', { screen: item.tab });
      } else {
        navigation.navigate(item.screen);
      }
    });
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={closeMenu} />

      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
            <Feather name="x" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Feather name="user" size={17} color={colors.accent} />
          </View>
          <View>
            <Text style={styles.profileName}>{saudacao}, {userName}</Text>
            <Text style={styles.profileSub}>Foco e disciplina</Text>
          </View>
        </View>

        <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
          {NAV_ITEMS.map((item, idx) => {
            if (item.divider) {
              return <View key={`div-${idx}`} style={styles.divider} />;
            }
            return (
              <AnimatedPressable
                key={item.label}
                style={styles.navLink}
                onPress={() => handleNav(item)}
              >
                <View style={styles.navIcon}>
                  <Feather name={item.icon} size={17} color={colors.textMuted} />
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>✨</Text>
          <Text style={styles.quoteText}>Pequenas ações diárias geram grandes resultados.</Text>
        </View>

        <Text style={styles.footerVersion}>Estudix · v1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 17, 23, 0.4)',
  },
  drawer: {
    width: '78%',
    height: '100%',
    backgroundColor: colors.bg,
    paddingTop: 48,
    borderTopRightRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  menuTitle: {
    fontFamily: fontFamily.serif,
    fontSize: 24,
    color: colors.text,
  },
  closeBtn: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.text,
  },
  profileSub: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    marginBottom: 2,
  },
  navIcon: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  footerVersion: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textFaint,
    textAlign: 'center',
    marginBottom: 24,
  },
  quoteCard: {
    marginHorizontal: 14,
    marginBottom: 16,
    padding: 20,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quoteIcon: { fontSize: 20, marginBottom: 10 },
  quoteText: {
    fontFamily: fontFamily.serif,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
});
