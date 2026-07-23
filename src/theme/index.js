// ============================================================
//  ESTUDIX — Design Tokens
//  Identidade quente e aconchegante: creme + navy + acentos
//  terracota/verde (mesma paleta de MATERIA_COLORS em EstudixContext).
// ============================================================

import { Easing } from 'react-native';

export const colors = {
  bg:            '#F7F1E1',
  surface:       '#FFFFFF',
  surfaceMuted:  '#F1E8D4',
  border:        '#E7DCC2',
  borderStrong:  '#D6C7A3',

  text:          '#231F18',
  textMuted:     '#6E6455',
  textFaint:     '#9C9080',

  accent:        '#1E3A5F',
  accentMuted:   '#E3E9EF',
  accentPressed: '#152A46',

  success:       '#5B7F4F',
  successMuted:  '#E8EFE3',
  danger:        '#A23B3B',
  dangerMuted:   '#F4E3E1',
  warning:       '#C97B4A',
  warningMuted:  '#F5E7DA',

  white:         '#FFFFFF',
};

export const radii = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  pill: 999,
  full: 9999,
  round: 9999,
};

// Sombras leves — a profundidade vem principalmente de bordas de 1px,
// não de elevação pesada.
export const shadows = {
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  },
  primaryBtn: {
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  glow: (hexColor, opacity = 0.18, radius = 12) => ({
    shadowColor: hexColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: 3,
  }),
};

// Inter para texto de interface; Playfair Display (serifada) para os
// títulos grandes de cada tela — é o que dá o tom aconchegante/editorial.
export const fontFamily = {
  regular:  'Inter_400Regular',
  medium:   'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold:     'Inter_700Bold',

  serif:         'PlayfairDisplay_700Bold',
  serifExtraBold: 'PlayfairDisplay_800ExtraBold',
};

export const fontSize = {
  xs:   11,
  sm:   12,
  base: 13,
  md:   14,
  lg:   16,
  xl:   18,
  h2:   20,
  h1:   26,
};

export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

export const motion = {
  duration: {
    fast: 140,
    base: 200,
    slow: 320,
  },
  easing: {
    standard: Easing.out(Easing.cubic),
    enter:    Easing.out(Easing.cubic),
  },
  spring: {
    press:  { damping: 22, stiffness: 300, mass: 0.6 },
    bounce: { damping: 18, stiffness: 220, mass: 0.6 },
  },
};

export default { colors, radii, shadows, fontFamily, fontSize, spacing, motion };
