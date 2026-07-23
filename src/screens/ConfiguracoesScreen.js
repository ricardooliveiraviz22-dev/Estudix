// ============================================================
//  ESTUDIX — ConfiguracoesScreen
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ModalSheet from '../components/ModalSheet';
import BrandMark from '../components/BrandMark';
import OptionPicker from '../components/OptionPicker';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix } from '../context/EstudixContext';
import { SCHOOL_LEVELS } from '../data/materiaInsights';
import { colors, fontFamily, fontSize, spacing, radii } from '../theme';

export default function ConfiguracoesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, setUserName, changeSetting, setSchoolLevel, clearAllData, exportData, importData, loadDemoData, showConfirm } = useEstudix();
  const { settings } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(settings.userName);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  const currentLevelLabel = SCHOOL_LEVELS.find(l => l.id === settings.schoolLevel)?.label || 'Ensino Médio';

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setModalVisible(false);
    }
  };

  const handleClear = () => {
    showConfirm({
      title: 'Limpar Todos os Dados',
      message: 'Tem certeza que deseja apagar todas as matérias, notas e anotações? Esta ação não pode ser desfeita.',
      confirmLabel: 'Limpar Tudo',
      destructive: true,
      onConfirm: clearAllData,
    });
  };

  const enterStyle = useScreenEnter();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={true} />

      <Animated.ScrollView contentContainerStyle={styles.scrollContent} style={enterStyle}>
        <Text style={styles.title}>Configurações</Text>

        <SectionLabel icon="user" text="Perfil" />
        <Card noBorder elevated style={styles.settingsCard}>
          <SettingsRow
            icon="user"
            title="Nome de Exibição"
            sub={settings.userName}
            onPress={() => setModalVisible(true)}
          />
          <View style={styles.settingsDivider} />
          <SettingsRow
            icon="award"
            title="Nível de Escolaridade"
            sub={currentLevelLabel}
            onPress={() => setLevelModalVisible(true)}
          />
        </Card>

        <SectionLabel icon="clock" text="Cronômetro Pomodoro" style={{ marginTop: 20 }} />
        <Card noBorder elevated style={styles.settingsCard}>
          <Stepper icon="zap" title="Duração do Foco" value={settings.focusMin} onDecrement={() => changeSetting('focus', -5)} onIncrement={() => changeSetting('focus', 5)} />
          <View style={styles.settingsDivider} />
          <Stepper icon="coffee" title="Pausa Curta" value={settings.shortBreakMin} onDecrement={() => changeSetting('short', -1)} onIncrement={() => changeSetting('short', 1)} />
          <View style={styles.settingsDivider} />
          <Stepper icon="moon" title="Pausa Longa" value={settings.longBreakMin} onDecrement={() => changeSetting('long', -5)} onIncrement={() => changeSetting('long', 5)} />
        </Card>

        <SectionLabel icon="database" text="Dados e backup" style={{ marginTop: 20 }} />
        <Card noBorder elevated style={styles.settingsCard}>
          <SettingsRow icon="upload-cloud" title="Exportar Backup" sub="Salvar arquivo JSON" onPress={exportData} />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="download-cloud" title="Importar Backup" sub="Restaurar arquivo JSON" onPress={importData} />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="trash-2" title="Limpar Todos os Dados" sub="Remove matérias, notas e flashcards" onPress={handleClear} danger />
        </Card>

        <SectionLabel icon="play-circle" text="Demonstração" style={{ marginTop: 20 }} />
        <Card noBorder elevated style={styles.settingsCard}>
          <SettingsRow
            icon="star"
            title="Carregar dados de demonstração"
            sub="Preenche Matemática, Português e História com um histórico de exemplo, pra ver as telas de desempenho e sugestões preenchidas"
            onPress={loadDemoData}
          />
        </Card>

        <View style={styles.appVersionBlock}>
          <BrandMark size={44} />
          <Text style={styles.appVersionName}>Estudix</Text>
          <Text style={styles.appVersionTag}>Versão 1.0 — Feito para estudantes</Text>
        </View>

        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      <ModalSheet visible={modalVisible} onClose={() => setModalVisible(false)} title="Editar nome" subtitle="Como prefere ser chamado?">
        <Input value={tempName} onChangeText={setTempName} placeholder="Seu nome" autoFocus />
        <View style={styles.modalActions}>
          <Button label="Cancelar" onPress={() => setModalVisible(false)} variant="ghost" />
          <Button label="Salvar" onPress={handleSaveName} />
        </View>
      </ModalSheet>

      <ModalSheet visible={levelModalVisible} onClose={() => setLevelModalVisible(false)} title="Nível de escolaridade" subtitle="Usado para sugerir dicas de estudo mais relevantes.">
        <OptionPicker
          options={SCHOOL_LEVELS}
          value={settings.schoolLevel}
          onChange={(id) => { setSchoolLevel(id); setLevelModalVisible(false); }}
          iconSize={18}
          style={{ marginBottom: 20 }}
        />
        <View style={styles.modalActions}>
          <Button label="Fechar" onPress={() => setLevelModalVisible(false)} variant="ghost" />
        </View>
      </ModalSheet>
    </View>
  );
}

function SectionLabel({ icon, text, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Feather name={icon} size={13} color={colors.textMuted} style={{ marginRight: 6 }} />
      <Text style={styles.sectionTitle}>{text}</Text>
    </View>
  );
}

function SettingsRow({ icon, title, sub, onPress, danger }) {
  return (
    <AnimatedPressable style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIconCircle, danger && { backgroundColor: colors.dangerMuted }]}>
          <Feather name={icon} size={16} color={danger ? colors.danger : colors.accent} />
        </View>
        <View>
          <Text style={[styles.settingsItemTitle, danger && { color: colors.danger }]}>{title}</Text>
          <Text style={styles.settingsItemSub}>{sub}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={colors.textFaint} />
    </AnimatedPressable>
  );
}

function Stepper({ icon, title, value, onDecrement, onIncrement }) {
  return (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIconCircle}>
          <Feather name={icon} size={16} color={colors.accent} />
        </View>
        <View>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          <Text style={styles.settingsItemSub}>{value} minutos</Text>
        </View>
      </View>
      <View style={styles.settingsStepper}>
        <AnimatedPressable style={styles.stepperBtn} onPress={onDecrement}><Text style={styles.stepperBtnText}>−</Text></AnimatedPressable>
        <Text style={styles.stepperVal}>{value}</Text>
        <AnimatedPressable style={styles.stepperBtn} onPress={onIncrement}><Text style={styles.stepperBtnText}>+</Text></AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 8, paddingHorizontal: 20 },
  title: { fontFamily: fontFamily.serif, fontSize: 28, color: colors.text, marginBottom: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: fontFamily.semibold, fontSize: 12, color: colors.textMuted, letterSpacing: 0.3 },

  settingsCard: { overflow: 'hidden', padding: 0 },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingsIconCircle: {
    width: 34, height: 34, borderRadius: radii.pill,
    backgroundColor: colors.accentMuted, alignItems: 'center', justifyContent: 'center',
  },
  settingsItemTitle: { fontFamily: fontFamily.semibold, fontSize: 14, color: colors.text },
  settingsItemSub: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  settingsDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  settingsStepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepperBtn: {
    width: 26, height: 26, borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnText: { fontFamily: fontFamily.bold, fontSize: 16, color: colors.accent, lineHeight: 16 },
  stepperVal: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text, minWidth: 22, textAlign: 'center' },

  appVersionBlock: { alignItems: 'center', marginTop: 32, marginBottom: 20, gap: 8 },
  appVersionName: { fontFamily: fontFamily.semibold, fontSize: 16, color: colors.text },
  appVersionTag: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textMuted },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
});
