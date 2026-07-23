// ============================================================
//  ESTUDIX — MateriaQuiz
//  Quiz de múltipla escolha (5 perguntas) para testar o
//  conhecimento do usuário numa matéria, no nível de
//  escolaridade configurado.
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AnimatedPressable from './AnimatedPressable';
import Card from './Card';
import Button from './Button';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

function feedbackMessage(score, total) {
  const pct = score / total;
  if (pct === 1) return 'Perfeito! Você domina esse conteúdo.';
  if (pct >= 0.6) return 'Muito bem! Revise as que errou para fixar ainda mais.';
  return 'Vale a pena reforçar esse conteúdo — dá uma olhada na aba Dicas.';
}

export default function MateriaQuiz({ questions, previousResult, onFinish }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  const start = () => {
    setStarted(true);
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const handleSelect = (optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const isCorrect = optIndex === current.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);
    Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setFinished(true);
      onFinish(correctCount, questions.length);
    }
  };

  if (!started) {
    return (
      <Card style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather name="help-circle" size={22} color={colors.accent} />
        </View>
        <Text style={styles.title}>Quiz rápido</Text>
        <Text style={styles.subtitle}>{questions.length} perguntas para testar o que você já sabe.</Text>
        {previousResult && (
          <View style={styles.prevScorePill}>
            <Feather name="award" size={13} color={colors.accent} />
            <Text style={styles.prevScoreText}>Última pontuação: {previousResult.score}/{previousResult.total}</Text>
          </View>
        )}
        <Button label={previousResult ? 'Refazer Quiz' : 'Começar Quiz'} onPress={start} size="lg" style={{ marginTop: 4 }} />
      </Card>
    );
  }

  if (finished) {
    return (
      <Card style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather
            name={correctCount === questions.length ? 'award' : correctCount >= questions.length * 0.6 ? 'thumbs-up' : 'refresh-cw'}
            size={22}
            color={colors.accent}
          />
        </View>
        <Text style={styles.title}>Você acertou {correctCount} de {questions.length}!</Text>
        <Text style={styles.subtitle}>{feedbackMessage(correctCount, questions.length)}</Text>
        <Button label="Tentar Novamente" onPress={start} size="lg" style={{ marginTop: 4 }} />
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.progressLabel}>Pergunta {index + 1} de {questions.length}</Text>
      <Text style={styles.questionText}>{current.question}</Text>

      {current.options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrectOpt = i === current.correctIndex;
        const showResult = selected !== null;
        return (
          <AnimatedPressable
            key={i}
            style={[
              styles.option,
              showResult && isCorrectOpt && styles.optionCorrect,
              showResult && isSelected && !isCorrectOpt && styles.optionWrong,
            ]}
            onPress={() => handleSelect(i)}
            disabled={showResult}
          >
            <Text style={styles.optionText}>{opt}</Text>
            {showResult && isCorrectOpt && <Feather name="check-circle" size={16} color={colors.success} />}
            {showResult && isSelected && !isCorrectOpt && <Feather name="x-circle" size={16} color={colors.danger} />}
          </AnimatedPressable>
        );
      })}

      {selected !== null && (
        <Button
          label={index + 1 < questions.length ? 'Próxima' : 'Ver Resultado'}
          onPress={handleNext}
          size="lg"
          style={{ marginTop: 4 }}
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },

  iconCircle: {
    width: 44, height: 44, borderRadius: radii.pill,
    backgroundColor: colors.accentMuted, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },

  title: { fontFamily: fontFamily.semibold, fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 19, marginBottom: 16 },

  prevScorePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.accentMuted, borderRadius: radii.pill,
    paddingVertical: 6, paddingHorizontal: 14, marginBottom: 16,
  },
  prevScoreText: { fontFamily: fontFamily.semibold, fontSize: 12, color: colors.accent },

  progressLabel: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.semibold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  questionText: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.semibold, fontSize: 16, color: colors.text,
    lineHeight: 22, marginBottom: 16,
  },
  option: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 10,
  },
  optionCorrect: { backgroundColor: colors.successMuted, borderColor: colors.success },
  optionWrong: { backgroundColor: colors.dangerMuted, borderColor: colors.danger },
  optionText: { fontFamily: fontFamily.medium, fontSize: 14, color: colors.text, flex: 1 },
});
