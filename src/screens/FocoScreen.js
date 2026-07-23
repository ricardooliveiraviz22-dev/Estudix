// ============================================================
//  ESTUDIX — FocoScreen
//
//  Árvore da tela (cada seção é seu próprio container flex, sem
//  margens entre elas — o espaçamento vem do `gap` do container pai):
//
//  screen (coluna, flex:1)
//   ├─ AppHeader                        — altura própria
//   └─ body (coluna, flex:1)
//       └─ contentInner (coluna, flex:1, largura máx. 480/centralizado)
//           ├─ headerBlock              — altura própria
//           ├─ materiaSelectorBlock     — altura própria
//           ├─ MentorCard               — altura própria
//           ├─ sessionTypeBar           — altura própria
//           ├─ pomodoroCenter (flex:1, center/center) ← ABSORVE o espaço
//           │    └─ ringWrap (tamanho calculado via onLayout do pai)
//           │        ├─ GlowRing + Svg
//           │        └─ overlay do tempo (absoluteFill, centralizado)
//           ├─ controlsRow              — altura própria
//           └─ dotsRow                  — altura própria
//
//  A Bottom Navigation NÃO faz parte desta árvore — é renderizada pelo
//  BottomTabNavigator como irmã da tela, fixa na safe area inferior,
//  e nunca entra no cálculo de espaço acima.
// ============================================================

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import Button from '../components/Button';
import Chip from '../components/Chip';
import GlowRing from '../components/GlowRing';
import MentorCard from '../components/MentorCard';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix, pad } from '../context/EstudixContext';
import { scheduleFocusEndNotification, cancelNotification } from '../lib/notifications';
import { getMentorMessage } from '../lib/mentor';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

const MODE_LABELS = {
  focus: 'Foco',
  short_break: 'Curta',
  long_break: 'Longa'
};

const MODE_COLORS = {
  focus: colors.accent,
  short_break: colors.warning,
  long_break: colors.success,
};

const RING_STROKE = 8;
const RING_MIN = 160;
const RING_MAX = 280;
const CONTENT_MAX_WIDTH = 480;
// Altura reservada para controles + indicadores + os gaps do grupo
// (botão "lg" ~52 + gap 20 + reset/dots ~24 + gap 14), usada para o
// anel nunca calcular um tamanho que empurre esse bloco pra fora da tela.
const CONTROLS_GROUP_HEIGHT = 120;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FocoScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { state, updateTimer, getSessionDuration, finishTimerSession, setFocusMateria } = useEstudix();
  const { timer, materias } = state;

  const progressAnim = useRef(new Animated.Value(1)).current;
  const notificationIdRef = useRef(null);

  // Tamanho do container central do Pomodoro, medido de verdade (não
  // estimado pela largura da janela) — é ele quem manda no tamanho do
  // anel. Assim, se o Mentor Card ou qualquer seção acima ocupar mais
  // espaço, o anel encolhe sozinho: nada é empurrado para fora da tela.
  const [centerBox, setCenterBox] = useState({ width: 0, height: 0 });
  const handleCenterLayout = useCallback((e) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setCenterBox((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
  }, []);

  // Antes do primeiro onLayout usa a largura da janela como estimativa
  // (evita flash de anel no tamanho errado); depois disso, quem manda
  // é o espaço real medido. Reserva a altura dos controles + indicadores
  // (que vivem DENTRO do mesmo grupo centralizado, ver JSX) para o anel
  // nunca "roubar" o espaço deles nem ultrapassar a área útil.
  const ringSize = useMemo(() => {
    const availableWidth = centerBox.width || width;
    const rawHeight = centerBox.height || availableWidth;
    const availableHeight = Math.max(rawHeight - CONTROLS_GROUP_HEIGHT, RING_MIN * 0.8);
    const candidate = Math.min(availableWidth * 0.72, availableHeight * 0.92, RING_MAX);
    return Math.round(Math.max(candidate, RING_MIN));
  }, [centerBox.width, centerBox.height, width]);

  const ringRadius = (ringSize - RING_STROKE) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;

  useEffect(() => {
    let interval = null;
    if (timer.isRunning && timer.remainingSeconds > 0) {
      interval = setInterval(() => {
        updateTimer({ remainingSeconds: timer.remainingSeconds - 1 });
      }, 1000);
    } else if (timer.isRunning && timer.remainingSeconds === 0) {
      notificationIdRef.current = null;
      finishTimerSession();
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.remainingSeconds]);

  useEffect(() => {
    const fraction = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
    Animated.timing(progressAnim, {
      toValue: fraction,
      duration: 950,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [timer.remainingSeconds, timer.totalSeconds]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ringCircumference, 0],
  });

  const toggleTimer = async () => {
    const startingNow = !timer.isRunning;
    updateTimer({ isRunning: startingNow });

    if (startingNow) {
      const isFocusSession = timer.sessionType === 'focus';
      notificationIdRef.current = await scheduleFocusEndNotification(
        timer.remainingSeconds,
        isFocusSession ? 'Sessão de foco concluída!' : 'Intervalo concluído!',
        isFocusSession ? 'Hora de fazer uma pausa.' : 'Hora de voltar a focar.'
      );
    } else {
      cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  };

  const resetTimer = () => {
    cancelNotification(notificationIdRef.current);
    notificationIdRef.current = null;
    updateTimer({
      isRunning: false,
      remainingSeconds: timer.totalSeconds,
    });
  };

  const changeSessionType = (key) => {
    cancelNotification(notificationIdRef.current);
    notificationIdRef.current = null;
    const duration = getSessionDuration(key);
    updateTimer({
      isRunning: false,
      sessionType: key,
      remainingSeconds: duration,
      totalSeconds: duration,
    });
  };

  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const timeString = `${pad(mins)}:${pad(secs)}`;
  const activeColor = MODE_COLORS[timer.sessionType] || colors.accent;

  const nextUpKey = timer.sessionType === 'focus'
    ? (timer.cyclePosition === 3 ? 'long_break' : 'short_break')
    : 'focus';
  const nextUpMinutes = Math.round(getSessionDuration(nextUpKey) / 60);
  const enterStyle = useScreenEnter();

  // Recalcula a mensagem do Mentor só quando algo relevante muda de fato —
  // não a cada tick de segundo do timer (remainingMinutes já arredonda isso).
  const remainingMinutes = Math.ceil(timer.remainingSeconds / 60);
  const mentor = useMemo(
    () => getMentorMessage(state, remainingMinutes),
    [
      timer.isRunning,
      timer.sessionType,
      timer.materiaId,
      timer.completedSessions,
      timer.currentStreak,
      remainingMinutes,
      state.materias,
      state.quizResultsPorAssunto,
    ]
  );

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <View style={styles.body}>
        <Animated.View style={[styles.contentInner, { maxWidth: Math.min(width, CONTENT_MAX_WIDTH) }, enterStyle]}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Foco Total</Text>
            <Text style={styles.subtitle}>Desconecte-se e concentre-se no agora.</Text>
          </View>

          {materias.length > 0 && (
            <View style={styles.materiaSelectorBlock}>
              <Text style={styles.materiaSelectorLabel}>Estudando</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.materiaChipsRow}>
                {materias.map((mat) => {
                  const isActive = timer.materiaId === mat.id;
                  return (
                    <Chip
                      key={mat.id}
                      label={mat.name}
                      active={isActive}
                      activeColor={mat.color}
                      onPress={() => setFocusMateria(isActive ? null : mat.id)}
                    />
                  );
                })}
              </ScrollView>
            </View>
          )}

          <MentorCard icon={mentor.icon} message={mentor.message} />

          <View style={styles.sessionTypeBar}>
            {Object.keys(MODE_LABELS).map((key) => (
              <Chip
                key={key}
                variant="segment"
                label={MODE_LABELS[key]}
                active={timer.sessionType === key}
                onPress={() => changeSessionType(key)}
              />
            ))}
          </View>

          {/* Área central: flex:1 absorve todo o espaço que sobrar das
              seções acima e centraliza o GRUPO inteiro (anel + timer +
              controles + indicadores) nela — nunca o contrário. Mantém
              os controles sempre grudados no anel, mesmo em telas com
              muita sobra vertical (tablet). */}
          <View style={styles.pomodoroCenter} onLayout={handleCenterLayout}>
            <View style={styles.pomodoroGroup}>
              <View style={[styles.ringWrap, { width: ringSize, height: ringSize }]}>
                <GlowRing size={ringSize} color={activeColor} progress={progressAnim} active={timer.isRunning} />
                <Svg width={ringSize} height={ringSize}>
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={ringRadius}
                    stroke={colors.surfaceMuted}
                    strokeWidth={RING_STROKE}
                    fill="none"
                  />
                  <AnimatedCircle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={ringRadius}
                    stroke={activeColor}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${ringCircumference}, ${ringCircumference}`}
                    strokeDashoffset={strokeDashoffset}
                    rotation="-90"
                    origin={`${ringSize / 2}, ${ringSize / 2}`}
                  />
                </Svg>
                <View
                  style={[styles.timerCenterOverlay, { width: ringSize, height: ringSize }]}
                  pointerEvents="none"
                >
                  <Text
                    style={styles.timerDisplay}
                    accessibilityLabel={`${mins} minutos e ${secs} segundos restantes`}
                  >
                    {timeString}
                  </Text>
                  <Text style={styles.timerNextUp}>Próximo: {MODE_LABELS[nextUpKey]} · {nextUpMinutes} min</Text>
                </View>
              </View>

              {/* Controles: container independente, sempre logo abaixo
                  do anel — jamais sobreposto a ele. */}
              <View style={styles.controlsRow}>
                <Button
                  label={timer.isRunning ? 'Pausar' : 'Iniciar'}
                  onPress={toggleTimer}
                  size="lg"
                  style={{ backgroundColor: activeColor, paddingHorizontal: 36 }}
                  icon={<Feather name={timer.isRunning ? 'pause' : 'play'} size={16} color={colors.white} />}
                />

                <AnimatedPressable
                  style={styles.timerResetBtn}
                  onPress={resetTimer}
                  accessibilityRole="button"
                  accessibilityLabel="Reiniciar sessão"
                  hitSlop={8}
                >
                  <Feather name="rotate-ccw" size={19} color={colors.textMuted} />
                </AnimatedPressable>
              </View>

              <View style={styles.dotsRow} accessibilityLabel={`Ciclo: ${timer.cyclePosition} de 4 sessões`}>
                {[0,1,2,3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.sessionDot,
                      i < timer.cyclePosition && styles.sessionDotDone,
                      i === timer.cyclePosition && timer.sessionType === 'focus' && styles.sessionDotCurrent
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Envolve tudo que fica abaixo do header — é este container que
  // efetivamente distribui a altura restante da tela entre as seções.
  body: {
    flex: 1,
    alignItems: 'center',
  },

  // Só existe pra limitar/centralizar a largura em telas largas
  // (tablet); em telefones, width:'100%' já ocupa tudo.
  contentInner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },

  headerBlock: {},
  title: {
    fontFamily: fontFamily.serif,
    fontSize: 26,
    color: colors.text,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'left',
  },

  materiaSelectorBlock: {},
  materiaSelectorLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  materiaChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  sessionTypeBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    padding: 4,
  },

  // A área que "manda" no tamanho do anel: ocupa todo o espaço que
  // sobrar na coluna e centraliza o conteúdo nela — para o timer/anel
  // ficarem centralizados, isso é resolvido aqui, nunca com margem.
  pomodoroCenter: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Agrupa anel + controles + indicadores como uma unidade só, para
  // que fiquem sempre próximos entre si (nunca "soltos" em telas com
  // muita sobra vertical, como tablets) enquanto pomodoroCenter cuida
  // de centralizar o grupo inteiro no espaço disponível.
  pomodoroGroup: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Width/height vêm explicitamente do JSX (mesmo valor de ringSize do
  // anel) — evitamos depender de `absoluteFillObject` (top/left/right/
  // bottom sem tamanho próprio) porque, com o container pai tendo o
  // tamanho calculado dinamicamente, essa inferência pode falhar em
  // Android nativo e o texto acaba sendo desenhado em fluxo normal,
  // logo abaixo do anel, em vez de sobreposto a ele.
  timerCenterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDisplay: {
    fontFamily: fontFamily.serif,
    fontSize: 52,
    color: colors.accent,
  },
  timerNextUp: {
    fontFamily: fontFamily.medium,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 6,
  },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  timerResetBtn: {
    width: 46,
    height: 46,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  sessionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  sessionDotDone: {
    backgroundColor: colors.accent,
  },
  sessionDotCurrent: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
    width: 9,
    height: 9,
  }
});
