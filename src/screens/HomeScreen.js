// ============================================================
//  ESTUDIX — HomeScreen
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AppHeader from '../components/AppHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/Card';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix, getGreeting, formatDate, pad, ACHIEVEMENTS, getUnlockedAchievements } from '../context/EstudixContext';
import { buildRecommendations } from '../lib/recommendations';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

// Ícone por tipo de sugestão (ver lib/recommendations.js)
const RECOMENDACAO_ICONS = {
  revisao: 'refresh-cw',
  revisao_flashcards: 'layers',
  proximo_conteudo: 'arrow-right-circle',
  tempo_estudo: 'clock',
  frequencia_revisao: 'trending-up',
};

// Mapeia o ícone (Ionicons) salvo em ACHIEVEMENTS para o equivalente Feather.
const ACHIEVEMENT_ICONS = {
  'flag-outline':   'flag',
  'ribbon-outline': 'award',
  'flame-outline':  'zap',
  'trophy-outline': 'award',
  'medal-outline':  'award',
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { state, calcularMedia, setSelectedMateria } = useEstudix();
  const { settings, anotacoes, materias, timer, calendar } = state;

  const [, forceUpdate] = React.useState(0);
  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  const saudacao = getGreeting();
  const { userName } = settings;

  const today = new Date();
  const stripDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 2);
    return d;
  });

  const hasEvent = (dateStr) => calendar.events.some(e => e.date === dateStr);
  const unlockedAchievementIds = new Set(getUnlockedAchievements(timer).map(a => a.id));
  const recomendacoes = buildRecommendations(state).slice(0, 4);
  const enterStyle = useScreenEnter();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <Animated.ScrollView
        style={[styles.scroll, enterStyle]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greetingSmall}>{saudacao},</Text>
        <Text style={styles.greetingName}>{userName}</Text>

        {/* ════ FOCO — AÇÃO PRINCIPAL ════ */}
        <AnimatedPressable
          style={styles.focusHero}
          onPress={() => navigation.navigate('BottomTabs', { screen: 'Foco' })}
          accessibilityLabel="Iniciar sessão de foco"
          accessibilityRole="button"
        >
          <View style={styles.focusHeroIcon}>
            <Feather name="play" size={18} color={colors.white} />
          </View>
          <View style={styles.focusHeroTextBlock}>
            <Text style={styles.focusHeroTitle}>Pronto para focar?</Text>
            <Text style={styles.focusHeroSubtitle}>
              {timer.totalMinutesToday > 0
                ? `Você já estudou ${timer.totalMinutesToday} min hoje — continue.`
                : 'Inicie uma sessão Pomodoro agora.'}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.85)" />
        </AnimatedPressable>

        {/* ════ MÉTRICAS ════ */}
        <View style={styles.metricsRow}>
          <MetricCard
            iconName="file-text"
            value={anotacoes.length}
            label="Anotações"
            color={colors.success}
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Anotacoes' })}
          />
          <MetricCard
            iconName="book-open"
            value={materias.length}
            label="Matérias"
            color={colors.accent}
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Materias' })}
          />
          <MetricCard
            iconName="clock"
            value={timer.totalMinutesToday || 0}
            label="Min. foco hoje"
            color={colors.warning}
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Foco' })}
          />
        </View>

        {/* ════ CALENDÁRIO — TIRA ════ */}
        <SectionHeader
          iconName="calendar"
          title="Calendário"
          rightLabel="Ver mês"
          onRightPress={() => navigation.navigate('Calendario')}
        />

        <Card style={styles.calendarCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStrip}
          >
            {stripDays.map((d, idx) => {
              const isToday = idx === 2;
              const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              const hasEvt  = hasEvent(dateStr);
              return (
                <View key={dateStr} style={styles.calDayWrapper}>
                  <View style={[styles.calDay, isToday && styles.calDayActive]}>
                    <Text style={[styles.calDaySub, isToday && styles.calDaySubActive]}>
                      {DAY_NAMES[d.getDay()]}
                    </Text>
                    <Text style={[styles.calDayNum, isToday && styles.calDayNumActive]}>
                      {d.getDate()}
                    </Text>
                  </View>
                  {(isToday || hasEvt) && <View style={styles.calDot} />}
                </View>
              );
            })}
          </ScrollView>
        </Card>

        {/* ════ ESTATÍSTICAS DE FOCO ════ */}
        <SectionHeader iconName="bar-chart-2" title="Estatísticas de foco" style={{ marginTop: spacing.lg }} />

        <Card style={styles.performanceCard}>
          <View style={styles.statsGrid}>
            <StatTile label="Semana (min)" value={timer.totalMinutesWeek || 0} />
            <StatTile label="Sessões" value={timer.completedSessions || 0} />
            <StatTile label="Maior foco" value={`${timer.longestSession || 0}m`} />
            <StatTile label="Sequência" value={`${timer.currentStreak || 0}d`} />
          </View>
          <Text style={styles.lastStudyText}>
            Último estudo registrado em: {formatDate(timer.lastStudyDate)}
          </Text>
        </Card>

        {/* ════ CONQUISTAS ════ */}
        <SectionHeader iconName="award" title="Conquistas" style={{ marginTop: spacing.lg }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchievementIds.has(ach.id);
            return (
              <Card key={ach.id} style={[styles.achievementBadge, !unlocked && styles.achievementBadgeLocked]} padding={12}>
                <Feather name={ACHIEVEMENT_ICONS[ach.icon] || 'award'} size={18} color={unlocked ? colors.accent : colors.textFaint} />
                <Text style={[styles.achievementLabel, !unlocked && styles.achievementLabelLocked]}>{ach.label}</Text>
              </Card>
            );
          })}
        </ScrollView>

        {/* ════ MÉDIAS POR MATÉRIA ════ */}
        <SectionHeader iconName="trending-up" title="Médias por matéria" style={{ marginTop: spacing.lg }} />

        <Card style={styles.performanceCard}>
          {materias.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma matéria cadastrada ainda.</Text>
          ) : (
            materias.map((mat, i) => {
              const media  = calcularMedia(mat.id);
              const pct    = Math.min(parseFloat(media) * 10, 100);
              const barClr = parseFloat(media) >= 6 ? colors.success : colors.accent;
              return (
                <AnimatedPressable
                  key={mat.id}
                  style={[styles.progressRow, i < materias.length - 1 && { marginBottom: spacing.lg }]}
                  onPress={() => {
                    setSelectedMateria(mat.id);
                    navigation.navigate('MateriaInterna');
                  }}
                >
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressName}>{mat.name}</Text>
                    <Text style={styles.progressGrade}>Média: {media} / 10</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: barClr }]} />
                  </View>
                </AnimatedPressable>
              );
            })
          )}
        </Card>

        {/* ════ SUGESTÕES PARA VOCÊ ════ */}
        {recomendacoes.length > 0 && (
          <>
            <SectionHeader iconName="compass" title="Sugestões para você" style={{ marginTop: spacing.lg }} />
            <View style={{ gap: 10 }}>
              {recomendacoes.map((r, i) => (
                <Card key={i} style={styles.recomendacaoCard}>
                  <Feather name={RECOMENDACAO_ICONS[r.type] || 'compass'} size={16} color={colors.accent} />
                  <Text style={styles.recomendacaoText}>{r.message}</Text>
                </Card>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 110 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ── Sub-componentes ──────────────────────────────────────────

function MetricCard({ iconName, value, label, onPress, color = colors.accent }) {
  return (
    <AnimatedPressable style={styles.metricCard} onPress={onPress}>
      <View style={[styles.metricIconCircle, { backgroundColor: color }]}>
        <Feather name={iconName} size={16} color={colors.white} />
      </View>
      <Text style={styles.metricNumber}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </AnimatedPressable>
  );
}

function StatTile({ label, value }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function SectionHeader({ iconName, title, rightLabel, onRightPress, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.sectionHeaderLeft}>
        <Feather name={iconName} size={13} color={colors.textMuted} style={{ marginRight: 6 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {rightLabel && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.sectionRightBtn}>{rightLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Estilos ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },

  greetingSmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  greetingName: {
    fontFamily: fontFamily.serif,
    fontSize: 32,
    color: colors.text,
    marginBottom: spacing.xl,
  },

  // Métricas
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xl,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: radii.md,
    alignItems: 'center',
    gap: 4,
  },
  metricIconCircle: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text,
  },
  metricLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Foco — ação principal da Home
  focusHero: {
    width: '100%',
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    marginBottom: spacing.xl,
    ...shadows.primaryBtn,
  },
  focusHeroIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusHeroTextBlock: { flex: 1 },
  focusHeroTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.white,
    marginBottom: 2,
  },
  focusHeroSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  sectionRightBtn: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.accent,
  },

  // Calendário strip
  calendarCard: { padding: 14, marginBottom: 6 },
  calendarStrip: { flexDirection: 'row', gap: 4, paddingHorizontal: 2 },
  calDayWrapper: { alignItems: 'center', flex: 1, minWidth: 38 },
  calDay: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    width: '100%',
  },
  calDayActive: { backgroundColor: colors.accentMuted },
  calDaySub: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  calDaySubActive: { color: colors.accent, fontFamily: fontFamily.semibold },
  calDayNum: { fontFamily: fontFamily.semibold, fontSize: 13, color: colors.text },
  calDayNumActive: { color: colors.accent },
  calDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, marginTop: 5 },

  // Conquistas
  achievementsRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  achievementBadge: { alignItems: 'center', gap: 6, width: 92 },
  achievementBadgeLocked: { opacity: 0.4 },
  achievementLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 10.5,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 13,
  },
  achievementLabelLocked: { color: colors.textMuted },

  // Estatísticas
  performanceCard: { padding: 18, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statTile: {
    flex: 1, minWidth: '22%',
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: radii.md,
  },
  statLabel: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.textMuted },
  statValue: { fontFamily: fontFamily.bold, fontSize: 20, color: colors.text, marginTop: 2 },
  lastStudyText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },

  progressRow: {},
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  progressName: { fontFamily: fontFamily.semibold, fontSize: fontSize.md, color: colors.text },
  progressGrade: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.textMuted },
  progressBarBg: { height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
  },

  recomendacaoCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  recomendacaoText: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13, color: colors.text, lineHeight: 18 },
});
