// ============================================================
//  ESTUDIX — OnboardingScreen
//  Fluxo de cadastro em 5 etapas: e-mail/senha → termos →
//  nome → escolaridade (ano) → configuração automática (M2).
//  Some para sempre depois que settings.onboarded = true.
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BrandMark from '../components/BrandMark';
import Input from '../components/Input';
import Button from '../components/Button';
import OptionPicker from '../components/OptionPicker';
import Checkbox from '../components/Checkbox';
import AnimatedPressable from '../components/AnimatedPressable';
import ModalSheet from '../components/ModalSheet';
import { useEstudix } from '../context/EstudixContext';
import { ANOS_ENSINO_MEDIO } from '../data/curriculo';
import { TERMOS_USO, POLITICA_PRIVACIDADE } from '../data/legalTexts';
import { seedMateriasFromCurriculo } from '../services/curriculumSeeder';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const STEP_COUNT = 5;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { state, completeOnboarding, addMateriasBatch, showToast } = useEstudix();

  const [step, setStep] = useState(0);

  // Etapa 0 — e-mail/senha (a senha nunca é persistida, ver EstudixContext.completeOnboarding)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Etapa 1 — termos
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termosModalVisible, setTermosModalVisible] = useState(false);
  const [politicaModalVisible, setPoliticaModalVisible] = useState(false);

  // Etapa 2 — nome
  const [name, setName] = useState('');

  // Etapa 3 — ano escolar
  const [anoEscolar, setAnoEscolar] = useState(null);

  const goToStep = (n) => setStep(n);

  const isStep0Valid = EMAIL_REGEX.test(email.trim()) && password.length >= 6;
  const anoLabel = ANOS_ENSINO_MEDIO.find((a) => a.id === anoEscolar)?.label || '';

  const finish = (wantsAutoSetup) => {
    if (wantsAutoSetup) {
      // Nunca deixa o usuário travado na última etapa do cadastro: se o seed falhar
      // por qualquer motivo (estado corrompido, ano inesperado etc.), o onboarding
      // termina normalmente e a matéria pode ser adicionada manualmente depois.
      try {
        const disciplinas = seedMateriasFromCurriculo(anoEscolar, state.materias);
        addMateriasBatch(disciplinas);
      } catch (e) {
        console.error('Falha ao configurar ambiente automaticamente:', e);
        showToast('Não foi possível configurar automaticamente — adicione as matérias depois em Matérias.');
      }
    }
    completeOnboarding({
      email: email.trim(),
      name: name.trim(),
      schoolLevel: 'medio',
      anoEscolar,
      wantsAutoSetup,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.dotsRow}>
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
        ))}
      </View>

      {step === 0 && (
        <View style={styles.content}>
          <BrandMark size={64} />
          <Text style={styles.title}>Bem-vindo ao Estudix</Text>
          <Text style={styles.subtitle}>
            Organize matérias, notas, flashcards e sessões de foco num só lugar. Pra começar, crie seu acesso.
          </Text>

          <Input
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoFocus
            returnKeyType="next"
          />
          <Input
            style={styles.input}
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={() => isStep0Valid && goToStep(1)}
          />
          <Text style={styles.privacyHint}>
            Seus dados ficam salvos apenas neste aparelho — não há conta na nuvem nem servidor.
          </Text>

          <Button
            label="Continuar"
            onPress={() => goToStep(1)}
            disabled={!isStep0Valid}
            size="lg"
            fullWidth
            icon={<Feather name="arrow-right" size={17} color={colors.white} style={{ marginLeft: 4 }} />}
          />
        </View>
      )}

      {step === 1 && (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="shield" size={24} color={colors.accent} />
          </View>
          <Text style={styles.title}>Termos e Privacidade</Text>
          <Text style={styles.subtitle}>
            Antes de continuar, dê uma olhada em como o Estudix trata seus dados.
          </Text>

          <View style={styles.docLinks}>
            <AnimatedPressable style={styles.docLinkRow} onPress={() => setTermosModalVisible(true)}>
              <Feather name="file-text" size={16} color={colors.accent} />
              <Text style={styles.docLinkText}>Ler Termos de Uso</Text>
              <Feather name="chevron-right" size={16} color={colors.textFaint} />
            </AnimatedPressable>
            <AnimatedPressable style={styles.docLinkRow} onPress={() => setPoliticaModalVisible(true)}>
              <Feather name="lock" size={16} color={colors.accent} />
              <Text style={styles.docLinkText}>Ler Política de Privacidade</Text>
              <Feather name="chevron-right" size={16} color={colors.textFaint} />
            </AnimatedPressable>
          </View>

          <Checkbox checked={termsAccepted} onToggle={() => setTermsAccepted((v) => !v)} style={styles.checkboxRow}>
            Li e aceito os Termos de Uso e a Política de Privacidade.
          </Checkbox>

          <Button
            label="Continuar"
            onPress={() => goToStep(2)}
            disabled={!termsAccepted}
            size="lg"
            fullWidth
            icon={<Feather name="arrow-right" size={17} color={colors.white} style={{ marginLeft: 4 }} />}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="user" size={24} color={colors.accent} />
          </View>
          <Text style={styles.title}>Como podemos te chamar?</Text>
          <Text style={styles.subtitle}>
            Usamos seu nome só para personalizar a experiência dentro do app.
          </Text>

          <Input
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => name.trim() && goToStep(3)}
          />

          <Button
            label="Continuar"
            onPress={() => goToStep(3)}
            disabled={!name.trim()}
            size="lg"
            fullWidth
            icon={<Feather name="arrow-right" size={17} color={colors.white} style={{ marginLeft: 4 }} />}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="award" size={24} color={colors.accent} />
          </View>
          <Text style={styles.title}>Qual seu ano escolar?</Text>
          <Text style={styles.subtitle}>
            Nesta versão o Estudix atende o Ensino Médio. Usamos essa informação para preparar suas matérias.
          </Text>

          <OptionPicker
            options={ANOS_ENSINO_MEDIO}
            value={anoEscolar}
            onChange={setAnoEscolar}
            style={styles.levelList}
          />

          <Button
            label="Continuar"
            onPress={() => goToStep(4)}
            disabled={!anoEscolar}
            size="lg"
            fullWidth
            icon={<Feather name="arrow-right" size={17} color={colors.white} style={{ marginLeft: 4 }} />}
          />
        </View>
      )}

      {step === 4 && (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Feather name="zap" size={24} color={colors.accent} />
          </View>
          <Text style={styles.title}>Prazer, {name.trim()}!</Text>
          <Text style={styles.subtitle}>
            Deseja configurar automaticamente seu ambiente de estudos com as matérias do {anoLabel}?
          </Text>

          <Button
            label="Sim, configurar automaticamente"
            onPress={() => finish(true)}
            size="lg"
            fullWidth
            icon={<Feather name="check" size={17} color={colors.white} style={{ marginLeft: 4 }} />}
            style={{ marginBottom: spacing.sm }}
          />
          <Button
            label="Não, prefiro adicionar depois"
            onPress={() => finish(false)}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </View>
      )}

      <ModalSheet visible={termosModalVisible} onClose={() => setTermosModalVisible(false)} title="Termos de Uso">
        <Text style={styles.docText}>{TERMOS_USO}</Text>
        <Button label="Fechar" onPress={() => setTermosModalVisible(false)} variant="ghost" style={{ marginTop: spacing.md }} />
      </ModalSheet>

      <ModalSheet visible={politicaModalVisible} onClose={() => setPoliticaModalVisible(false)} title="Política de Privacidade">
        <Text style={styles.docText}>{POLITICA_PRIVACIDADE}</Text>
        <Button label="Fechar" onPress={() => setPoliticaModalVisible(false)} variant="ghost" style={{ marginTop: spacing.md }} />
      </ModalSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  dotsRow: { flexDirection: 'row', gap: 6, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: 20 },

  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: {
    width: 72, height: 72, borderRadius: radii.pill, backgroundColor: colors.accentMuted,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: {
    fontFamily: fontFamily.serif, fontSize: 24, color: colors.text,
    textAlign: 'center', marginBottom: 10, marginTop: 20,
  },
  subtitle: {
    fontFamily: fontFamily.regular, fontSize: 14, color: colors.textMuted,
    textAlign: 'center', lineHeight: 21, maxWidth: 300, marginBottom: 28,
  },
  input: {
    width: '100%', marginBottom: spacing.lg,
  },
  privacyHint: {
    fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFaint,
    textAlign: 'center', lineHeight: 16, marginTop: -8, marginBottom: spacing.lg,
  },

  levelList: { marginBottom: 28 },

  docLinks: { width: '100%', gap: 8, marginBottom: 20 },
  docLinkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 16,
  },
  docLinkText: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13.5, color: colors.text },
  docText: { fontFamily: fontFamily.regular, fontSize: 13.5, color: colors.text, lineHeight: 21 },

  checkboxRow: { width: '100%', marginBottom: 28 },
});
