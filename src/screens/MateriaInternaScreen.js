// ============================================================
//  ESTUDIX — MateriaInternaScreen
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/FAB';
import GradeChart from '../components/GradeChart';
import MateriaQuiz from '../components/MateriaQuiz';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Input from '../components/Input';
import Button from '../components/Button';
import ModalSheet from '../components/ModalSheet';
import EmptyState from '../components/EmptyState';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix, todayStr } from '../context/EstudixContext';
import { getMateriaInsights } from '../data/materiaInsights';
import { getQuiz, getExerciciosAssunto } from '../data/quizzes';
import { getConteudoDisciplina } from '../data/curriculo';
import { findSubjectKey } from '../lib/subjects';
import { calcularDesempenhoMateria, calcularEvolucao } from '../lib/performance';
import { colors, fontFamily, fontSize, radii, spacing } from '../theme';

const TABS = [
  { key: 'checklist', label: 'Checklist' },
  { key: 'notas', label: 'Notas' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'dicas', label: 'Dicas' },
];

export default function MateriaInternaScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    state, calcularMedia,
    saveNota, deleteNota,
    saveCategoryTitle, saveChecklistItem, toggleChecklistItem, deleteChecklistItem,
    saveFlashcard, toggleFlashcard, deleteFlashcard, reviewFlashcard,
    saveQuizResult, saveAssuntoQuizResult,
    showToast,
  } = useEstudix();

  const materia = state.materias.find((m) => m.id === state.selectedMateriaId);

  const [activeTab, setActiveTab] = useState('checklist');

  const [notaModal, setNotaModal] = useState(false);
  const [editingNotaId, setEditingNotaId] = useState(null);
  const [notaLabel, setNotaLabel] = useState('');
  const [notaValue, setNotaValue] = useState('');

  const [checklistModal, setChecklistModal] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingChecklistCatId, setEditingChecklistCatId] = useState(null);
  const [checkText, setCheckText] = useState('');

  const [flashcardModal, setFlashcardModal] = useState(false);
  const [editingFcId, setEditingFcId] = useState(null);
  const [fcQuestion, setFcQuestion] = useState('');
  const [fcAnswer, setFcAnswer] = useState('');

  const [assuntoAtivo, setAssuntoAtivo] = useState(null);
  const [assuntoQuiz, setAssuntoQuiz] = useState(null);

  const enterStyle = useScreenEnter();

  if (!materia) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingHorizontal: 20 }]}>
        <Text style={{ color: colors.textMuted }}>Nenhuma matéria selecionada.</Text>
      </View>
    );
  }

  const avg = calcularMedia(materia.id);
  const notas = state.notas.filter((n) => n.materiaId === materia.id);
  const categories = state.checklistCategories.filter((c) => c.materiaId === materia.id);
  const flashcards = state.flashcards.filter((f) => f.materiaId === materia.id);
  const quiz = getQuiz(materia.name, state.settings.schoolLevel);
  const conteudo = getConteudoDisciplina(materia.curriculoKey || findSubjectKey(materia.name));
  const quizResult = state.quizResults[materia.id];
  const quizResultMatchesLevel = quizResult && quizResult.level === state.settings.schoolLevel ? quizResult : null;

  const handleFabPress = () => {
    if (activeTab === 'notas') openNotaModal();
    else if (activeTab === 'checklist') openChecklistModal();
    else openFlashcardModal();
  };

  const openNotaModal = (nota = null) => {
    if (nota) {
      setEditingNotaId(nota.id);
      setNotaLabel(nota.label);
      setNotaValue(nota.value.toString());
    } else {
      setEditingNotaId(null);
      setNotaLabel('');
      setNotaValue('');
    }
    setNotaModal(true);
  };

  const handleSaveNota = () => {
    if (!notaLabel.trim() || !notaValue.trim()) return;
    saveNota(notaLabel, notaValue, editingNotaId);
    setNotaModal(false);
  };

  const openChecklistModal = (catId = null, item = null) => {
    if (item) {
      setEditingChecklistId(item.id);
      setEditingChecklistCatId(catId);
      setCheckText(item.text);
    } else {
      setEditingChecklistId(null);
      setEditingChecklistCatId(catId);
      setCheckText('');
    }
    setChecklistModal(true);
  };

  const handleSaveChecklist = () => {
    if (!checkText.trim()) return;
    let catId = editingChecklistCatId || (categories.length > 0 ? categories[0].id : null);
    if (!catId) {
      saveCategoryTitle('Checklist Geral');
      showToast('Categoria padrão criada — toque em salvar novamente para adicionar o item.');
      setChecklistModal(false);
      return;
    }
    saveChecklistItem(checkText, catId, editingChecklistId);
    setChecklistModal(false);
  };

  const openFlashcardModal = (fc = null) => {
    if (fc) {
      setEditingFcId(fc.id);
      setFcQuestion(fc.question);
      setFcAnswer(fc.answer);
    } else {
      setEditingFcId(null);
      setFcQuestion('');
      setFcAnswer('');
    }
    setFlashcardModal(true);
  };

  const handleSaveFlashcard = () => {
    if (!fcQuestion.trim() || !fcAnswer.trim()) return;
    saveFlashcard(fcQuestion, fcAnswer, editingFcId);
    setFlashcardModal(false);
  };

  const renderChecklist = () => (
    <View style={styles.tabContent}>
      {categories.length === 0 ? (
        <EmptyState icon="check-square" title="Nenhum checklist ainda" description="Crie itens para acompanhar o que falta estudar." actionLabel="Novo item" onAction={() => openChecklistModal()} />
      ) : (
        categories.map((cat) => (
          <Card key={cat.id} style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>{cat.title}</Text>
            {cat.items.length === 0 && <Text style={styles.emptyText}>Categoria vazia.</Text>}
            {cat.items.map((item) => (
              <View key={item.id} style={styles.checkItemWrapper}>
                <AnimatedPressable style={styles.checkItem} onPress={() => toggleChecklistItem(cat.id, item.id)}>
                  <Feather name={item.done ? 'check-circle' : 'circle'} size={19} color={item.done ? colors.success : colors.textFaint} />
                  <Text style={[styles.checkText, item.done && styles.checkTextDone]}>{item.text}</Text>
                </AnimatedPressable>
                <TouchableOpacity onPress={() => openChecklistModal(cat.id, item)} style={styles.editIconBtn}>
                  <Feather name="edit-2" size={14} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteChecklistItem(cat.id, item.id)} style={styles.editIconBtn}>
                  <Feather name="trash-2" size={14} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        ))
      )}
    </View>
  );

  const renderNotas = () => (
    <View style={styles.tabContent}>
      <GradeChart notas={notas} />
      {notas.length === 0 ? (
        <EmptyState icon="bar-chart-2" title="Nenhuma avaliação ainda" description="Registre suas notas para acompanhar a evolução na matéria." actionLabel="Nova avaliação" onAction={() => openNotaModal()} />
      ) : (
        notas.map((n) => (
          <Card key={n.id} style={styles.innerSubjectCard}>
            <View style={styles.innerGradeRow}>
              <Text style={styles.innerGradeLabel}>{n.label}</Text>
              <Text style={styles.mediaValueBold}>{n.value.toFixed(1)}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.mediaBadgeRow}>
              <TouchableOpacity onPress={() => openNotaModal(n)} style={[styles.editIconBtn, { marginRight: 8 }]}>
                <Feather name="edit-2" size={14} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNota(n.id)} style={styles.editIconBtn}>
                <Feather name="trash-2" size={14} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
    </View>
  );

  const renderFlashcards = () => {
    const today = todayStr();
    const dueCount = flashcards.filter(f => (f.dueDate || today) <= today).length;

    return (
      <View style={styles.tabContent}>
        {dueCount > 0 && (
          <View style={styles.fcDueBanner}>
            <Feather name="clock" size={15} color={colors.accent} />
            <Text style={styles.fcDueBannerText}>
              {dueCount} {dueCount === 1 ? 'card para revisar' : 'cards para revisar'} hoje
            </Text>
          </View>
        )}

        {flashcards.length === 0 ? (
          <EmptyState icon="layers" title="Nenhum flashcard ainda" description="Crie flashcards de pergunta e resposta para revisar com repetição espaçada." actionLabel="Novo flashcard" onAction={() => openFlashcardModal()} />
        ) : (
          flashcards.map((f) => {
            const isDue = (f.dueDate || today) <= today;
            return (
              <Card key={f.id} style={styles.flashcardContainer}>
                <View style={styles.fcHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.fcStatus}>{f.flipped ? 'RESPOSTA' : 'PERGUNTA'}</Text>
                    {isDue && <View style={styles.fcDueDot} />}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => openFlashcardModal(f)}>
                      <Feather name="edit-2" size={15} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFlashcard(f.id)}>
                      <Feather name="trash-2" size={15} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                <AnimatedPressable disabled={f.flipped} onPress={() => toggleFlashcard(f.id)}>
                  <View style={styles.fcBody}>
                    <Text style={f.flipped ? styles.fcAnswer : styles.fcQuestion}>
                      {f.flipped ? f.answer : f.question}
                    </Text>
                  </View>
                  {!f.flipped && <Text style={styles.fcHint}>Toque para revelar</Text>}
                </AnimatedPressable>

                {f.flipped && (
                  <View style={styles.fcReviewRow}>
                    <AnimatedPressable style={styles.fcReviewBtnBad} onPress={() => reviewFlashcard(f.id, false)}>
                      <Feather name="x" size={15} color={colors.danger} />
                      <Text style={styles.fcReviewBtnBadText}>Não lembrei</Text>
                    </AnimatedPressable>
                    <AnimatedPressable style={styles.fcReviewBtnGood} onPress={() => reviewFlashcard(f.id, true)}>
                      <Feather name="check" size={15} color={colors.success} />
                      <Text style={styles.fcReviewBtnGoodText}>Lembrei</Text>
                    </AnimatedPressable>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </View>
    );
  };

  const renderDicas = () => {
    const insights = getMateriaInsights(materia.name, state.settings.schoolLevel);
    return (
      <View style={styles.tabContent}>
        {insights.generic ? (
          <Text style={styles.emptyText}>
            Ainda não temos conteúdo específico para "{materia.name}" — aqui vão dicas gerais de estudo.
          </Text>
        ) : insights.levelMismatch && (
          <View style={styles.dicasNote}>
            <Feather name="info" size={13} color={colors.textMuted} />
            <Text style={styles.dicasNoteText}>Conteúdo adaptado do nível: {insights.matchedLevelLabel}</Text>
          </View>
        )}

        {insights.topicos.length > 0 && (
          <Card style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>Tópicos críticos</Text>
            {insights.topicos.map((t, i) => (
              <View key={i} style={styles.dicaTopicoRow}>
                <View style={styles.dicaTopicoDot} />
                <Text style={styles.dicaTopicoText}>{t}</Text>
              </View>
            ))}
          </Card>
        )}

        <Card style={styles.innerSubjectCard}>
          <Text style={styles.sectionTitle}>Dicas de estudo</Text>
          {insights.dicas.map((d, i) => (
            <View key={i} style={styles.dicaItemRow}>
              <Feather name="zap" size={15} color={colors.accent} />
              <Text style={styles.dicaItemText}>{d}</Text>
            </View>
          ))}
        </Card>
      </View>
    );
  };

  const renderConteudo = () => (
    <View style={styles.tabContent}>
      {conteudo.modulos.map((modulo) => (
        <Card key={modulo.id} style={styles.innerSubjectCard}>
          <Text style={styles.sectionTitle}>{modulo.nome}</Text>
          {modulo.assuntos.map((assunto) => (
            <AnimatedPressable key={assunto.id} style={styles.assuntoRow} onPress={() => setAssuntoAtivo(assunto)}>
              <Feather name="book-open" size={15} color={colors.accent} />
              <Text style={styles.assuntoRowText}>{assunto.nome}</Text>
              <Feather name="chevron-right" size={15} color={colors.textFaint} />
            </AnimatedPressable>
          ))}
        </Card>
      ))}

      <ModalSheet visible={!!assuntoAtivo} onClose={() => setAssuntoAtivo(null)} title={assuntoAtivo?.nome}>
        {assuntoAtivo && (
          <>
            <Text style={styles.assuntoSectionLabel}>Teoria</Text>
            <Text style={styles.assuntoText}>{assuntoAtivo.teoria}</Text>

            <Text style={styles.assuntoSectionLabel}>Resumo</Text>
            <Text style={styles.assuntoText}>{assuntoAtivo.resumo}</Text>

            {assuntoAtivo.formulas.length > 0 && (
              <>
                <Text style={styles.assuntoSectionLabel}>Fórmulas</Text>
                {assuntoAtivo.formulas.map((f, i) => (
                  <Text key={i} style={styles.assuntoFormula}>{f}</Text>
                ))}
              </>
            )}

            <Text style={styles.assuntoSectionLabel}>Exemplos</Text>
            {assuntoAtivo.exemplos.map((e, i) => (
              <View key={i} style={styles.dicaTopicoRow}>
                <View style={styles.dicaTopicoDot} />
                <Text style={styles.dicaTopicoText}>{e}</Text>
              </View>
            ))}

            <Text style={styles.assuntoSectionLabel}>Curiosidades</Text>
            {assuntoAtivo.curiosidades.map((c, i) => (
              <View key={i} style={styles.dicaItemRow}>
                <Feather name="star" size={14} color={colors.accent} />
                <Text style={styles.dicaItemText}>{c}</Text>
              </View>
            ))}

            <Text style={styles.assuntoSectionLabel}>Dicas de estudo</Text>
            {assuntoAtivo.dicas.map((d, i) => (
              <View key={i} style={styles.dicaItemRow}>
                <Feather name="zap" size={14} color={colors.accent} />
                <Text style={styles.dicaItemText}>{d}</Text>
              </View>
            ))}

            <Button label="Fechar" onPress={() => setAssuntoAtivo(null)} variant="ghost" style={{ marginTop: spacing.md }} />
          </>
        )}
      </ModalSheet>
    </View>
  );

  // Se a matéria tem conteúdo rico (Fase 4), o quiz pergunta o assunto antes
  // de começar (EXERCICIOS por assuntoId). Senão, cai no quiz geral por nível
  // de escolaridade que já existia (QUIZZES) — nenhuma das duas é descartada.
  const renderQuiz = () => {
    if (!conteudo) {
      return quiz ? (
        <MateriaQuiz
          questions={quiz}
          previousResult={quizResultMatchesLevel}
          onFinish={(score, total) => saveQuizResult(materia.id, state.settings.schoolLevel, score, total)}
        />
      ) : null;
    }

    if (!assuntoQuiz) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.emptyText}>Escolha um assunto para começar o quiz.</Text>
          {conteudo.modulos.map((modulo) => (
            <Card key={modulo.id} style={styles.innerSubjectCard}>
              <Text style={styles.sectionTitle}>{modulo.nome}</Text>
              {modulo.assuntos.map((assunto) => (
                <AnimatedPressable
                  key={assunto.id}
                  style={styles.assuntoRow}
                  onPress={() => setAssuntoQuiz({ ...assunto, ano: modulo.ano })}
                >
                  <Feather name="help-circle" size={15} color={colors.accent} />
                  <Text style={styles.assuntoRowText}>{assunto.nome}</Text>
                  <Feather name="chevron-right" size={15} color={colors.textFaint} />
                </AnimatedPressable>
              ))}
            </Card>
          ))}
        </View>
      );
    }

    const questoesAssunto = getExerciciosAssunto(materia.name, assuntoQuiz.ano, assuntoQuiz.id);

    return (
      <View style={styles.tabContent}>
        <AnimatedPressable style={styles.backRow} onPress={() => setAssuntoQuiz(null)}>
          <Feather name="arrow-left" size={14} color={colors.textMuted} />
          <Text style={styles.backRowText}>Escolher outro assunto</Text>
        </AnimatedPressable>

        {questoesAssunto ? (
          <MateriaQuiz
            questions={questoesAssunto}
            previousResult={state.quizResultsPorAssunto[materia.id]?.[assuntoQuiz.id]}
            onFinish={(score, total) => saveAssuntoQuizResult(materia.id, assuntoQuiz.id, assuntoQuiz.ano, score, total)}
          />
        ) : (
          <EmptyState
            icon="help-circle"
            title="Ainda sem exercícios"
            description={`Ainda não cadastramos exercícios para "${assuntoQuiz.nome}".`}
            actionLabel="Escolher outro assunto"
            onAction={() => setAssuntoQuiz(null)}
          />
        )}
      </View>
    );
  };

  // Melhoria 6 — decidido NÃO criar uma tela separada de "Meu Desempenho":
  // vira mais uma tab aqui, mesmo padrão de Conteúdo/Quiz, sem rota nova.
  const renderDesempenho = () => {
    const d = calcularDesempenhoMateria(materia.id, conteudo, state.quizResultsPorAssunto);
    const evolucao = calcularEvolucao(state.timer);
    return (
      <View style={styles.tabContent}>
        <Card style={styles.innerSubjectCard}>
          <Text style={styles.sectionTitle}>Desempenho nos quizzes</Text>
          <View style={styles.statMiniGrid}>
            <StatMini label="Progresso" value={`${d.percentualProgresso}%`} />
            <StatMini label="Acerto médio" value={d.respondidos > 0 ? `${d.percentualAcertoMedio}%` : '—'} />
            <StatMini label="Dominados" value={d.dominados.length} />
            <StatMini label="P/ revisão" value={d.dificuldades.length} />
          </View>
        </Card>

        <Card style={styles.innerSubjectCard}>
          <Text style={styles.sectionTitle}>Evolução</Text>
          <View style={styles.dicaItemRow}>
            <Feather name="zap" size={15} color={colors.accent} />
            <Text style={styles.dicaItemText}>
              🔥 {evolucao.streakAtual} {evolucao.streakAtual === 1 ? 'dia seguido' : 'dias seguidos'} de estudo (recorde: {evolucao.streakRecorde})
            </Text>
          </View>
          <Text style={styles.evolucaoCaption}>
            Baseado em consistência de estudo (sessões de foco), não em histórico de notas — cada assunto guarda só o resultado mais recente do quiz.
          </Text>
        </Card>

        {d.respondidos === 0 && (
          <Text style={styles.emptyText}>Responda ao menos um quiz de assunto (aba Quiz) para ver seu desempenho aqui.</Text>
        )}

        {d.proximoAssunto && (
          <Card style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>Próximo conteúdo sugerido</Text>
            <View style={styles.dicaItemRow}>
              <Feather name="arrow-right-circle" size={15} color={colors.accent} />
              <Text style={styles.dicaItemText}>{d.proximoAssunto.nome}</Text>
            </View>
          </Card>
        )}

        {d.dificuldades.length > 0 && (
          <Card style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>Assuntos para revisão</Text>
            {d.dificuldades.map((a) => (
              <View key={a.id} style={styles.dicaItemRow}>
                <Feather name="refresh-cw" size={15} color={colors.danger} />
                <Text style={styles.dicaItemText}>{a.nome}</Text>
              </View>
            ))}
          </Card>
        )}

        {d.dominados.length > 0 && (
          <Card style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>Assuntos dominados</Text>
            {d.dominados.map((a) => (
              <View key={a.id} style={styles.dicaItemRow}>
                <Feather name="check-circle" size={15} color={colors.success} />
                <Text style={styles.dicaItemText}>{a.nome}</Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      <Animated.ScrollView contentContainerStyle={styles.scrollContent} style={enterStyle}>

        <View style={styles.materiaTitleRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.materiaBadge, { backgroundColor: materia.color + '14' }]}>
            <Ionicons name={materia.icon} size={16} color={materia.color} />
          </View>
          <Text style={styles.materiaName} numberOfLines={1}>{materia.name}</Text>
        </View>

        <Card style={styles.innerSubjectCard}>
          <View style={styles.innerGradeRow}>
            <Text style={styles.innerGradeLabel}>Média Atual</Text>
            <Text style={styles.mediaValueBold}>{avg}</Text>
          </View>
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map((tab) => (
            <Chip key={tab.key} label={tab.label} active={activeTab === tab.key} onPress={() => setActiveTab(tab.key)} style={{ marginRight: 8 }} />
          ))}
          {conteudo && (
            <Chip label="Conteúdo" active={activeTab === 'conteudo'} onPress={() => setActiveTab('conteudo')} style={{ marginRight: 8 }} />
          )}
          {(quiz || conteudo) && (
            <Chip label="Quiz" active={activeTab === 'quiz'} onPress={() => setActiveTab('quiz')} style={conteudo ? { marginRight: 8 } : undefined} />
          )}
          {conteudo && (
            <Chip label="Desempenho" active={activeTab === 'desempenho'} onPress={() => setActiveTab('desempenho')} />
          )}
        </ScrollView>

        {activeTab === 'checklist' && renderChecklist()}
        {activeTab === 'notas' && renderNotas()}
        {activeTab === 'flashcards' && renderFlashcards()}
        {activeTab === 'dicas' && renderDicas()}
        {activeTab === 'conteudo' && conteudo && renderConteudo()}
        {activeTab === 'quiz' && renderQuiz()}
        {activeTab === 'desempenho' && conteudo && renderDesempenho()}

        <View style={{ height: 130 }} />
      </Animated.ScrollView>

      {activeTab !== 'dicas' && activeTab !== 'quiz' && activeTab !== 'conteudo' && activeTab !== 'desempenho' && <FAB currentScreen="MateriaInterna" onPress={handleFabPress} />}

      <ModalSheet visible={notaModal} onClose={() => setNotaModal(false)} title={editingNotaId ? 'Editar avaliação' : 'Nova avaliação'}>
        <Input placeholder="Ex: Prova Bimestral" value={notaLabel} onChangeText={setNotaLabel} />
        <Input placeholder="Nota (0 a 10)" keyboardType="numeric" value={notaValue} onChangeText={setNotaValue} />
        <View style={styles.modalActions}>
          <Button label="Cancelar" onPress={() => setNotaModal(false)} variant="ghost" />
          <Button label="Salvar" onPress={handleSaveNota} />
        </View>
      </ModalSheet>

      <ModalSheet visible={checklistModal} onClose={() => setChecklistModal(false)} title={editingChecklistId ? 'Editar item' : 'Novo item'}>
        <Input placeholder="Ex: Ler capítulo 4" value={checkText} onChangeText={setCheckText} autoFocus />
        <View style={styles.modalActions}>
          <Button label="Cancelar" onPress={() => setChecklistModal(false)} variant="ghost" />
          <Button label="Salvar" onPress={handleSaveChecklist} />
        </View>
      </ModalSheet>

      <ModalSheet visible={flashcardModal} onClose={() => setFlashcardModal(false)} title={editingFcId ? 'Editar flashcard' : 'Novo flashcard'}>
        <Input placeholder="Pergunta..." multiline value={fcQuestion} onChangeText={setFcQuestion} />
        <Input placeholder="Resposta..." multiline value={fcAnswer} onChangeText={setFcAnswer} />
        <View style={styles.modalActions}>
          <Button label="Cancelar" onPress={() => setFlashcardModal(false)} variant="ghost" />
          <Button label="Salvar" onPress={handleSaveFlashcard} />
        </View>
      </ModalSheet>

    </View>
  );
}

function StatMini({ label, value }) {
  return (
    <View style={styles.statMiniTile}>
      <Text style={styles.statMiniLabel}>{label}</Text>
      <Text style={styles.statMiniValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  materiaTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  materiaBadge: { width: 30, height: 30, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  materiaName: { fontFamily: fontFamily.serif, fontSize: 24, color: colors.text, flex: 1 },

  innerSubjectCard: { padding: 18, marginBottom: 14 },
  innerGradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  innerGradeLabel: { fontSize: 14, color: colors.text, flex: 1, paddingRight: 8, fontFamily: fontFamily.semibold },
  mediaValueBold: { fontSize: 18, color: colors.accent, fontFamily: fontFamily.bold },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  mediaBadgeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },

  tabsRow: { flexDirection: 'row', marginBottom: 16, paddingBottom: 2 },

  tabContent: { flex: 1 },
  sectionTitle: { fontFamily: fontFamily.semibold, fontSize: 14, color: colors.text, marginBottom: 12 },
  emptyText: { fontFamily: fontFamily.regular, fontSize: 14, color: colors.textMuted, marginBottom: 12 },

  checkItemWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, flex: 1 },
  checkText: { fontFamily: fontFamily.medium, fontSize: 13, color: colors.text, flex: 1 },
  checkTextDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  editIconBtn: { padding: 6, borderRadius: 6 },

  flashcardContainer: { padding: 14, marginBottom: 10 },
  fcHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fcStatus: { fontFamily: fontFamily.semibold, fontSize: 10, textTransform: 'uppercase', color: colors.textMuted, letterSpacing: 1 },
  fcBody: { minHeight: 68, justifyContent: 'center' },
  fcQuestion: { fontFamily: fontFamily.medium, fontSize: 14, color: colors.text, textAlign: 'center' },
  fcAnswer: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.accent, textAlign: 'center' },
  fcHint: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 12 },
  fcDueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },

  fcDueBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.accentMuted, borderRadius: radii.md,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 12,
  },
  fcDueBannerText: { fontFamily: fontFamily.semibold, fontSize: 12.5, color: colors.accent },

  fcReviewRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  fcReviewBtnBad: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.dangerMuted,
    borderWidth: 1, borderColor: colors.danger + '33',
  },
  fcReviewBtnBadText: { fontFamily: fontFamily.semibold, fontSize: 12.5, color: colors.danger },
  fcReviewBtnGood: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.successMuted,
    borderWidth: 1, borderColor: colors.success + '33',
  },
  fcReviewBtnGoodText: { fontFamily: fontFamily.semibold, fontSize: 12.5, color: colors.success },

  dicasNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  dicasNoteText: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textMuted },
  dicaTopicoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  dicaTopicoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginTop: 6 },
  dicaTopicoText: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13.5, color: colors.text, lineHeight: 19 },
  dicaItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  dicaItemText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 13.5, color: colors.text, lineHeight: 20 },

  assuntoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8,
  },
  assuntoRowText: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13.5, color: colors.text },
  assuntoSectionLabel: {
    fontFamily: fontFamily.semibold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 16, marginBottom: 6,
  },
  assuntoText: { fontFamily: fontFamily.regular, fontSize: 13.5, color: colors.text, lineHeight: 20 },
  assuntoFormula: {
    fontFamily: fontFamily.semibold, fontSize: 13.5, color: colors.accent,
    backgroundColor: colors.accentMuted, borderRadius: radii.sm,
    paddingVertical: 6, paddingHorizontal: 10, marginBottom: 6, alignSelf: 'flex-start',
  },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, alignSelf: 'flex-start' },
  backRowText: { fontFamily: fontFamily.medium, fontSize: 12.5, color: colors.textMuted },

  statMiniGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  statMiniTile: { flex: 1, minWidth: '45%', backgroundColor: colors.surfaceMuted, padding: 12, borderRadius: radii.md },
  statMiniLabel: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.textMuted },
  statMiniValue: { fontFamily: fontFamily.bold, fontSize: 20, color: colors.text, marginTop: 2 },
  evolucaoCaption: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.textFaint, marginTop: 8, lineHeight: 15 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
});
