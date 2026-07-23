// ============================================================
//  ESTUDIX — EstudixContext (Fase 4: Backup, Calendário & CRUD)
// ============================================================

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { scheduleEventReminder, cancelNotification } from '../lib/notifications';
import { findSubjectKey, getIconForSubject } from '../lib/subjects';
import { DEMO_ANO_ESCOLAR, DEMO_MATERIAS, DEMO_QUIZ_RESULTADOS, DEMO_FLASHCARDS, DEMO_TIMER_STATS } from '../data/demoData';

const STORE_KEY = '@Estudix:state';

// ─── Utilitários ──────────────────────────────────────────

export function todayStr(plusDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + plusDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function uid() {
  return Date.now() + Math.floor(Math.random() * 10000);
}

export function pad(n) {
  return String(n).padStart(2, '0');
}

export function calcularMedia(notas, materiaId) {
  const mNotas = notas.filter(n => n.materiaId === materiaId);
  if (!mNotas.length) return '0.0';
  return (mNotas.reduce((a, n) => a + n.value, 0) / mNotas.length).toFixed(1);
}

export function mediaBadge(avg) {
  if (avg >= 8) return { label: 'Excelente! 🎉', bg: '#DCE8D4', color: '#4F6B45' };
  if (avg >= 6) return { label: 'Indo bem 👍',   bg: '#EAD9B8', color: '#8A6A2F' };
  return          { label: 'Precisa de atenção ⚠️', bg: '#F3DACB', color: '#A24E27' };
}

export function formatRelativeDate(ts) {
  const diff    = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return 'Agora mesmo';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days === 1)   return 'Ontem';
  return `${days} dias atrás`;
}

export function formatDate(isoStr) {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} de ${months[parseInt(m) - 1]} de ${y}`;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─── Conquistas ────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_session', label: 'Primeira Sessão', icon: 'flag-outline',   test: (t) => t.completedSessions >= 1  },
  { id: 'ten_sessions',  label: '10 Sessões',       icon: 'ribbon-outline', test: (t) => t.completedSessions >= 10 },
  { id: 'streak_3',      label: '3 Dias Seguidos',  icon: 'flame-outline',  test: (t) => t.longestStreak >= 3      },
  { id: 'streak_7',      label: 'Semana Completa',  icon: 'trophy-outline', test: (t) => t.longestStreak >= 7      },
  { id: 'marathon',      label: 'Foco de 50min+',   icon: 'medal-outline',  test: (t) => t.longestSession >= 50    },
];

export function getUnlockedAchievements(timer) {
  return ACHIEVEMENTS.filter(a => a.test(timer));
}

export const MATERIA_COLORS = [
  '#1E3A5F','#C97B4A','#5B7F4F','#7A5CAE',
  '#A23B3B','#2A7A8A','#8A6A2F','#4A7A5F',
];
export const MATERIA_ICONS = [
  'book-outline','flask-outline','calculator-outline','earth-outline',
  'language-outline','musical-notes-outline','color-palette-outline',
  'code-slash-outline','leaf-outline','fitness-outline',
];

// ─── Estado Inicial Default ─────────────────────────────────
function buildInitialState() {
  return {
    settings: {
      userName:      'Estudante',
      email:         '',
      focusMin:      25,
      shortBreakMin: 5,
      longBreakMin:  15,
      onboarded:     false,
      schoolLevel:   'medio', // 'fundamental1' | 'fundamental2' | 'medio' | 'superior'
      anoEscolar:      null,  // '1' | '2' | '3' — ano do Ensino Médio informado no cadastro
      wantsAutoSetup:  false, // resposta da pergunta de configuração automática (M2) — consumido na Fase 3
      termsAcceptedAt: null,  // timestamp do aceite dos Termos de Uso / Política de Privacidade
    },
    materias: [],
    notas: [],
    flashcards: [],
    checklistCategories: [],
    anotacoes: [],
    focusSessions: [], // { id, materiaId, minutes, date }
    quizResults: {},   // { [materiaId]: { level, score, total, completedAt } } — quiz geral por nível (fallback)
    quizResultsPorAssunto: {}, // { [materiaId]: { [assuntoId]: { score, total, ano, completedAt } } } — Melhoria 5/6, só matérias com conteúdo rico (data/curriculo)
    calendar: {
      viewYear:        new Date().getFullYear(),
      viewMonth:       new Date().getMonth(),
      events:          [],
      calSelectedDate: todayStr(),
    },
    timer: {
      sessionType:      'focus', // 'focus' | 'short_break' | 'long_break'
      remainingSeconds: 25 * 60,
      totalSeconds:     25 * 60,
      isRunning:        false,
      sessionCount:     0,
      cyclePosition:    0,
      materiaId:        null, // matéria sendo estudada nesta sessão
      // Estatísticas Avançadas
      lastStudyDate:    todayStr(),
      totalMinutesToday: 0,
      totalMinutesWeek:  0,
      completedSessions: 0,
      longestSession:    0,
      currentStreak:     0,
      longestStreak:     0,
      lastSessionDate:   null, // último dia em que uma sessão de foco foi concluída
    },
    selectedMateriaId: null,
    notesFilter:       'all',
  };
}

const EstudixContext = createContext(null);

export function EstudixProvider({ children }) {
  const [state, setState] = useState(buildInitialState);
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);
  const saveTimeoutRef = useRef(null); // Ref para o Debounce

  // ── Toast e Confirmação (substituem Alert.alert nativo) ─────
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2600);
  };

  const [confirmDialog, setConfirmDialog] = useState(null);

  const showConfirm = ({ title, message, confirmLabel, cancelLabel, hideCancel, destructive, onConfirm }) => {
    setConfirmDialog({ title, message, confirmLabel, cancelLabel, hideCancel, destructive, onConfirm });
  };
  const closeConfirm = () => setConfirmDialog(null);

  // ── Carregamento Inicial (AsyncStorage) ────────────────────
  useEffect(() => {
    async function loadStore() {
      try {
        // Inicializando AsyncStorage
        const stored = await AsyncStorage.getItem(STORE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Tratamento de virada de dia e semana
          const today = todayStr();
          if (parsed.timer && parsed.timer.lastStudyDate !== today) {
            parsed.timer.totalMinutesToday = 0; // zera contador diário
            
            // Lógica simples de zerar semana (idealmente compararia dias da semana, aqui se for > 7 dias zera)
            const lastDate = new Date(parsed.timer.lastStudyDate);
            const currDate = new Date(today);
            const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 7 || currDate.getDay() < lastDate.getDay()) {
              parsed.timer.totalMinutesWeek = 0;
            }
            
            parsed.timer.lastStudyDate = today;
          }
          
          if (parsed.timer) {
            parsed.timer.isRunning = false;
            // Compatibilidade com backups salvos antes destes campos existirem
            if (parsed.timer.currentStreak === undefined)   parsed.timer.currentStreak = 0;
            if (parsed.timer.longestStreak === undefined)   parsed.timer.longestStreak = 0;
            if (parsed.timer.lastSessionDate === undefined) parsed.timer.lastSessionDate = null;
            if (parsed.timer.materiaId === undefined)       parsed.timer.materiaId = null;
          }
          if (parsed.focusSessions === undefined) parsed.focusSessions = [];
          if (parsed.quizResults === undefined) parsed.quizResults = {};
          if (parsed.quizResultsPorAssunto === undefined) parsed.quizResultsPorAssunto = {};

          // Backups salvos antes do onboarding existir não têm essa flag —
          // se já há matérias cadastradas, não faz sentido mostrar onboarding.
          if (parsed.settings && parsed.settings.onboarded === undefined) {
            parsed.settings.onboarded = (parsed.materias?.length || 0) > 0;
          }
          if (parsed.settings && parsed.settings.schoolLevel === undefined) {
            parsed.settings.schoolLevel = 'medio';
          }
          // Compatibilidade com backups salvos antes do novo fluxo de cadastro (Fase 2)
          if (parsed.settings && parsed.settings.email === undefined)          parsed.settings.email = '';
          if (parsed.settings && parsed.settings.anoEscolar === undefined)     parsed.settings.anoEscolar = null;
          if (parsed.settings && parsed.settings.wantsAutoSetup === undefined) parsed.settings.wantsAutoSetup = false;
          if (parsed.settings && parsed.settings.termsAcceptedAt === undefined) parsed.settings.termsAcceptedAt = null;

          setState(prev => ({ ...prev, ...parsed }));
        } else {
          // Se não existir dados, usar o initial state padrão
          console.log('Nenhum dado salvo encontrado. Iniciando estado padrão.');
        }
      } catch (e) {
        // Fallback Seguro
        console.error('Falha crítica ao ler o AsyncStorage. Carregando mock em memória.', e);
        showConfirm({
          title: 'Aviso',
          message: 'Ocorreu um problema ao ler seus dados antigos. O app foi iniciado em modo de segurança.',
          confirmLabel: 'Entendi',
          hideCancel: true,
          onConfirm: () => {},
        });
      } finally {
        setIsStoreLoaded(true);
      }
    }
    loadStore();
  }, []);

  // ── Engine de Persistência com Debounce ─────────────────────
  const saveStore = (newState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce de 1000ms para evitar spam no disco
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const toSave = { ...newState };
        if (toSave.timer) {
          toSave.timer = { ...toSave.timer, isRunning: false }; // Nunca salvar isRunning=true
        }
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.error('Falha ao salvar no AsyncStorage (Debounce):', e);
      }
    }, 1000);
  };

  const dispatchUpdate = (updater) => {
    setState((prevState) => {
      const newState = typeof updater === 'function' ? updater(prevState) : { ...prevState, ...updater };
      saveStore(newState);
      return newState;
    });
  };

  const dispatchVolatileUpdate = (updater) => {
    // Usado APENAS para os ticks do timer (evita milhares de writes no disco via debounce)
    setState((prevState) => {
      return typeof updater === 'function' ? updater(prevState) : { ...prevState, ...updater };
    });
  };

  // ── Helpers de Estado ─────────────────────────────────────
  const updateNested = (key, partial) => {
    dispatchUpdate(prev => ({ ...prev, [key]: { ...prev[key], ...partial } }));
  };

  // ── Backup e Restauração (JSON via FileSystem) ────────────
  const exportData = async () => {
    try {
      const dataToExport = {
        settings: state.settings,
        materias: state.materias,
        notas: state.notas,
        checklistCategories: state.checklistCategories,
        flashcards: state.flashcards,
        anotacoes: state.anotacoes,
        calendar: state.calendar,
        timer: state.timer
      };
      
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const fileUri = FileSystem.documentDirectory + 'estudix_backup.json';
      
      await FileSystem.writeAsStringAsync(fileUri, jsonStr, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { dialogTitle: 'Exportar Backup do Estudix' });
      } else {
        showToast('O compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      showToast('Ocorreu um erro ao exportar o backup.');
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
      
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      
      const parsed = JSON.parse(fileContent);
      
      if (!parsed.settings || !parsed.materias) {
        showToast('Arquivo inválido: não parece ser um backup do Estudix.');
        return;
      }

      dispatchUpdate(prev => ({ ...prev, ...parsed }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Backup restaurado com sucesso!');

    } catch (error) {
      console.error('Erro ao importar:', error);
      showToast('Ocorreu um erro ao importar. Verifique se o arquivo está corrompido.');
    }
  };

  // ── Settings ──────────────────────────────────────────────
  const setUserName = (name) => {
    updateNested('settings', { userName: name });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Recebe os dados coletados no novo fluxo de cadastro (5 etapas — ver OnboardingScreen).
  // Não recebe/armazena senha: como não há tela de login nem backend, guardá-la não tem
  // uso real e vazaria em texto puro pelo backup JSON (exportData) — melhor nem persistir.
  const completeOnboarding = ({ email, name, schoolLevel, anoEscolar, wantsAutoSetup }) => {
    dispatchUpdate(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        email: email || prev.settings.email,
        userName: name || prev.settings.userName,
        schoolLevel: schoolLevel || prev.settings.schoolLevel,
        anoEscolar: anoEscolar ?? prev.settings.anoEscolar,
        wantsAutoSetup: !!wantsAutoSetup,
        termsAcceptedAt: Date.now(),
        onboarded: true,
      },
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const setSchoolLevel = (schoolLevel) => {
    updateNested('settings', { schoolLevel });
    Haptics.selectionAsync();
  };

  const changeSetting = (type, delta) => {
    dispatchUpdate(prev => {
      const s = { ...prev.settings };
      if (type === 'focus') s.focusMin      = Math.max(5,  Math.min(60, s.focusMin + delta));
      if (type === 'short') s.shortBreakMin = Math.max(1,  Math.min(30, s.shortBreakMin + delta));
      if (type === 'long')  s.longBreakMin  = Math.max(5,  Math.min(60, s.longBreakMin + delta));
      return { ...prev, settings: s };
    });
    Haptics.selectionAsync();
  };

  // ── Matérias ─────────────────────────────────────────────
  /**
   * @typedef {Object} Materia
   * @property {string} id
   * @property {string} name
   * @property {string} icon
   * @property {string} color
   * @property {string} [curriculoKey] - subjectKey da grade oficial (src/data/curriculo), se a matéria foi criada automaticamente. Ausente em matérias livres criadas manualmente.
   * @property {string} [anoEscolar] - '1' | '2' | '3', se vinculada a um ano do Ensino Médio. Ausente em matérias livres.
   */
  const saveMateria = (name, editingId = null) => {
    if (!name.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    dispatchUpdate(prev => {
      if (editingId) {
        return {
          ...prev,
          materias: prev.materias.map(m => m.id === editingId ? { ...m, name } : m)
        };
      }
      const color = MATERIA_COLORS[prev.materias.length % MATERIA_COLORS.length];
      const icon  = getIconForSubject(name) || MATERIA_ICONS[prev.materias.length % MATERIA_ICONS.length];
      return {
        ...prev,
        materias: [...prev.materias, { id: `mat-${uid()}`, name, icon, color }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const hasInsights = !editingId && findSubjectKey(name) !== null;
    showToast(
      editingId ? 'Matéria atualizada'
      : hasInsights ? `Matéria criada — toque nela para ver dicas de estudo! 💡`
      : 'Matéria criada'
    );
  };

  // Inserção em lote — usada pelo seed automático da grade curricular (M3).
  // Ao contrário de saveMateria, dispara toast/haptics UMA vez só, não por item.
  const addMateriasBatch = (materiasToAdd) => {
    if (!materiasToAdd || materiasToAdd.length === 0) return;
    dispatchUpdate(prev => {
      const startIndex = prev.materias.length;
      const novas = materiasToAdd.map((m, i) => ({
        id:    `mat-${uid()}-${i}`,
        name:  m.name,
        icon:  getIconForSubject(m.name) || MATERIA_ICONS[(startIndex + i) % MATERIA_ICONS.length],
        color: MATERIA_COLORS[(startIndex + i) % MATERIA_COLORS.length],
        ...(m.curriculoKey ? { curriculoKey: m.curriculoKey } : {}),
        ...(m.anoEscolar   ? { anoEscolar: m.anoEscolar }     : {}),
      }));
      return { ...prev, materias: [...prev.materias, ...novas] };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(`${materiasToAdd.length} ${materiasToAdd.length === 1 ? 'matéria criada' : 'matérias criadas'} automaticamente 📚`);
  };

  // Dados de demonstração (Fase 6) — só para apresentação/QA, não roda
  // automaticamente. Reaproveita o mesmo esquema de montagem de matéria
  // do addMateriasBatch; ignora disciplinas do demo que já existirem
  // (mesmo critério de dedupe do seed automático da grade curricular).
  const loadDemoData = () => {
    const chavesExistentes = new Set(
      state.materias.map(m => m.curriculoKey || findSubjectKey(m.name)).filter(Boolean)
    );
    const materiasParaCriar = DEMO_MATERIAS.filter(d => !chavesExistentes.has(d.curriculoKey));

    if (materiasParaCriar.length === 0) {
      showToast('Dados de demonstração já foram carregados.');
      return;
    }

    dispatchUpdate(prev => {
      const startIndex = prev.materias.length;
      const materiasCriadas = materiasParaCriar.map((d, i) => ({
        id:    `mat-${uid()}-${i}`,
        name:  d.name,
        icon:  getIconForSubject(d.name) || MATERIA_ICONS[(startIndex + i) % MATERIA_ICONS.length],
        color: MATERIA_COLORS[(startIndex + i) % MATERIA_COLORS.length],
        curriculoKey: d.curriculoKey,
        anoEscolar:   DEMO_ANO_ESCOLAR,
      }));

      const quizResultsPorAssunto = { ...prev.quizResultsPorAssunto };
      materiasCriadas.forEach((m) => {
        const resultadosMateria = DEMO_QUIZ_RESULTADOS[m.curriculoKey];
        if (!resultadosMateria) return;
        quizResultsPorAssunto[m.id] = Object.fromEntries(
          Object.entries(resultadosMateria).map(([assuntoId, r]) => [assuntoId, { ...r, completedAt: Date.now() }])
        );
      });

      const flashcardsCriados = DEMO_FLASHCARDS
        .map((f) => {
          const materia = materiasCriadas.find(m => m.curriculoKey === f.materiaKey);
          if (!materia) return null;
          return {
            id: uid(), materiaId: materia.id, question: f.question, answer: f.answer, flipped: false,
            easeFactor: 2.5, interval: 0, repetitions: 0, dueDate: todayStr(),
          };
        })
        .filter(Boolean);

      return {
        ...prev,
        materias: [...prev.materias, ...materiasCriadas],
        flashcards: [...prev.flashcards, ...flashcardsCriados],
        quizResultsPorAssunto,
        timer: { ...prev.timer, ...DEMO_TIMER_STATS, lastSessionDate: todayStr() },
      };
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Dados de demonstração carregados — Matemática, Português e História com histórico de quizzes.');
  };

  const deleteMateria = (id) => {
    dispatchUpdate(prev => ({
      ...prev,
      materias:            prev.materias.filter(m => m.id !== id),
      notas:               prev.notas.filter(n => n.materiaId !== id),
      flashcards:          prev.flashcards.filter(f => f.materiaId !== id),
      checklistCategories: prev.checklistCategories.filter(c => c.materiaId !== id),
      anotacoes:           prev.anotacoes.filter(a => a.materiaId !== id),
      calendar:            { ...prev.calendar, events: prev.calendar.events.filter(e => e.materiaId !== id) },
      selectedMateriaId:   prev.selectedMateriaId === id ? null : prev.selectedMateriaId
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast('Matéria excluída');
  };

  // Salva (ou remove, se imageUri for null) a foto escolhida pelo usuário
  // pra identificar visualmente a matéria, substituindo o ícone no card.
  const updateMateriaImage = (id, imageUri) => {
    dispatchUpdate(prev => ({
      ...prev,
      materias: prev.materias.map(m => m.id === id ? { ...m, imageUri } : m)
    }));
  };

  // ── Notas/Avaliações ─────────────────────────────────────
  const saveNota = (label, value, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
        return {
          ...prev,
          notas: prev.notas.map(n =>
            n.id === editingId ? { ...n, label, value: parseFloat(value) || 0 } : n
          ),
        };
      }
      return {
        ...prev,
        notas: [...prev.notas, { id: uid(), materiaId: prev.selectedMateriaId, label, value: parseFloat(value) || 0 }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Avaliação atualizada' : 'Avaliação registrada');
  };

  const deleteNota = (id) => {
    dispatchUpdate(prev => ({ ...prev, notas: prev.notas.filter(n => n.id !== id) }));
    showToast('Avaliação excluída');
  };

  // ── Flashcards ────────────────────────────────────────────
  const toggleFlashcard = (id) => {
    dispatchUpdate(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(f => f.id === id ? { ...f, flipped: !f.flipped } : f),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveFlashcard = (question, answer, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
         return {
           ...prev,
           flashcards: prev.flashcards.map(f => f.id === editingId ? { ...f, question, answer } : f)
         };
      }
      return {
        ...prev,
        flashcards: [...prev.flashcards, {
          id: uid(), materiaId: prev.selectedMateriaId, question, answer, flipped: false,
          // Repetição espaçada (SM-2 simplificado) — novo card já nasce "devendo" revisão
          easeFactor: 2.5, interval: 0, repetitions: 0, dueDate: todayStr(),
        }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Flashcard atualizado' : 'Flashcard criado');
  };

  const deleteFlashcard = (id) => {
    dispatchUpdate(prev => ({ ...prev, flashcards: prev.flashcards.filter(f => f.id !== id) }));
    showToast('Flashcard excluído');
  };

  // Avalia a resposta do usuário e recalcula a próxima data de revisão (SM-2 simplificado)
  const reviewFlashcard = (id, remembered) => {
    dispatchUpdate(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(f => {
        if (f.id !== id) return f;
        const easeFactor  = f.easeFactor  ?? 2.5;
        const repetitions = f.repetitions ?? 0;
        const interval    = f.interval    ?? 0;

        if (!remembered) {
          return {
            ...f, flipped: false,
            repetitions: 0,
            interval: 1,
            easeFactor: Math.max(1.3, easeFactor - 0.2),
            dueDate: todayStr(1),
          };
        }

        const newRepetitions = repetitions + 1;
        let newInterval;
        if (newRepetitions === 1)      newInterval = 1;
        else if (newRepetitions === 2) newInterval = 6;
        else                           newInterval = Math.round(interval * easeFactor);

        return {
          ...f, flipped: false,
          repetitions: newRepetitions,
          interval: newInterval,
          easeFactor: Math.min(2.5, easeFactor + 0.1),
          dueDate: todayStr(newInterval),
        };
      }),
    }));
    Haptics.impactAsync(remembered ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  };

  // ── Checklists ────────────────────────────────────────────
  const saveCategoryTitle = (title, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
        return { ...prev, checklistCategories: prev.checklistCategories.map(c => c.id === editingId ? { ...c, title } : c) };
      }
      return { ...prev, checklistCategories: [...prev.checklistCategories, { id: uid(), materiaId: prev.selectedMateriaId, title, items: [] }] };
    });
  };

  const deleteCategory = (catId) => {
    dispatchUpdate(prev => ({ ...prev, checklistCategories: prev.checklistCategories.filter(c => c.id !== catId) }));
  };

  const saveChecklistItem = (text, catId, editingItemId = null) => {
    dispatchUpdate(prev => ({
      ...prev,
      checklistCategories: prev.checklistCategories.map(c => {
        if (c.id !== catId) return c;
        
        if (editingItemId) {
           return { ...c, items: c.items.map(i => i.id === editingItemId ? { ...i, text } : i) };
        }
        return { ...c, items: [...c.items, { id: uid(), text, done: false }] };
      }),
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleChecklistItem = (catId, itemId) => {
    dispatchUpdate(prev => ({
      ...prev,
      checklistCategories: prev.checklistCategories.map(c =>
        c.id === catId
          ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) }
          : c
      ),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const deleteChecklistItem = (catId, itemId) => {
     dispatchUpdate(prev => ({
       ...prev,
       checklistCategories: prev.checklistCategories.map(c => 
         c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
       )
     }));
  }

  // ── Anotações ─────────────────────────────────────────────
  const saveAnotacao = (title, content, materiaId, editingId = null) => {
    dispatchUpdate(prev => {
       if (editingId) {
          return {
            ...prev,
            anotacoes: prev.anotacoes.map(a => a.id === editingId ? { ...a, title, content, materiaId, updatedAt: Date.now() } : a)
          }
       }
       return {
          ...prev,
          anotacoes: [{ id: uid(), title, content, materiaId, createdAt: Date.now(), updatedAt: Date.now() }, ...prev.anotacoes],
       };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Anotação atualizada' : 'Anotação criada');
  };

  const deleteAnotacao = (id) => {
    dispatchUpdate(prev => ({ ...prev, anotacoes: prev.anotacoes.filter(a => a.id !== id) }));
    showToast('Anotação excluída');
  };

  const setNotesFilter = (filterId) => dispatchUpdate({ notesFilter: filterId });

  // ── Calendário ────────────────────────────────────────────
  const saveEvent = (title, description, date, type, materiaId, editingId = null) => {
    const id = editingId || uid();
    const oldNotificationId = editingId
      ? state.calendar.events.find(e => e.id === editingId)?.notificationId
      : null;

    dispatchUpdate(prev => {
      const now = Date.now();
      if (editingId) {
        return {
          ...prev,
          calendar: {
            ...prev.calendar,
            events: prev.calendar.events.map(e => e.id === editingId ? { ...e, title, description, date, type, materiaId, updatedAt: now } : e)
          }
        };
      }
      return {
        ...prev,
        calendar: {
          ...prev.calendar,
          events: [...prev.calendar.events, { id, title, description, date, type, materiaId, createdAt: now, updatedAt: now }]
        },
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Evento atualizado' : 'Evento criado');

    // Reagenda o lembrete local (8h do dia do evento) fora do reducer, pois é assíncrono
    if (oldNotificationId) cancelNotification(oldNotificationId);
    scheduleEventReminder({ id, title, description, date }).then(notificationId => {
      if (!notificationId) return;
      dispatchUpdate(prev => ({
        ...prev,
        calendar: { ...prev.calendar, events: prev.calendar.events.map(e => e.id === id ? { ...e, notificationId } : e) }
      }));
    });
  };

  const deleteEvent = (id) => {
    const ev = state.calendar.events.find(e => e.id === id);
    if (ev?.notificationId) cancelNotification(ev.notificationId);
    dispatchUpdate(prev => ({
      ...prev,
      calendar: { ...prev.calendar, events: prev.calendar.events.filter(e => e.id !== id) },
    }));
    showToast('Evento excluído');
  };

  const setCalendarView = (year, month) => updateNested('calendar', { viewYear: year, viewMonth: month });
  const setCalSelectedDate = (date) => updateNested('calendar', { calSelectedDate: date });
  
  const prevMonth = () => {
    dispatchUpdate(prev => {
      let { viewYear, viewMonth } = prev.calendar;
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      return { ...prev, calendar: { ...prev.calendar, viewYear, viewMonth } };
    });
  };

  const nextMonth = () => {
    dispatchUpdate(prev => {
      let { viewYear, viewMonth } = prev.calendar;
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      return { ...prev, calendar: { ...prev.calendar, viewYear, viewMonth } };
    });
  };

  // ── Timer / Pomodoro ──────────────────────────────────────
  const getSessionDuration = (type, settings) => {
    if (type === 'focus')       return settings.focusMin * 60;
    if (type === 'short_break') return settings.shortBreakMin * 60;
    if (type === 'long_break')  return settings.longBreakMin * 60;
    return 25 * 60;
  };

  const setFocusMateria = (id) => updateNested('timer', { materiaId: id });

  const updateTimer = (partial) => {
    // Se estivermos apenas passando o tick do relógio (remainingSeconds), não salvamos no disco.
    if (Object.keys(partial).length === 1 && 'remainingSeconds' in partial) {
      dispatchVolatileUpdate(prev => ({
        ...prev,
        timer: { ...prev.timer, ...partial }
      }));
    } else {
      updateNested('timer', partial);
    }
  };

  const finishTimerSession = () => {
    const wasFocus = state.timer.sessionType === 'focus';
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(wasFocus ? 'Sessão de foco concluída! Hora do intervalo. 🎉' : 'Intervalo concluído! Hora de focar. 💪');
    dispatchUpdate(prev => {
      let nextMode = 'focus';
      let newCycle = prev.timer.cyclePosition;
      let { totalMinutesToday, totalMinutesWeek, completedSessions, longestSession, currentStreak, longestStreak, lastSessionDate } = prev.timer;
      let newFocusSessions = prev.focusSessions;

      // Se acabou uma sessão de foco, incrementamos os stats
      if (prev.timer.sessionType === 'focus') {
        const minStudied = Math.round(prev.timer.totalSeconds / 60);
        totalMinutesToday += minStudied;
        totalMinutesWeek += minStudied;
        completedSessions += 1;

        if (minStudied > longestSession) {
          longestSession = minStudied;
        }

        // Sequência de dias estudados: só conta uma vez por dia
        const today = todayStr();
        if (lastSessionDate !== today) {
          currentStreak = (lastSessionDate === todayStr(-1)) ? currentStreak + 1 : 1;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
          lastSessionDate = today;
        }

        newFocusSessions = [
          ...prev.focusSessions,
          { id: uid(), materiaId: prev.timer.materiaId, minutes: minStudied, date: today },
        ];

        newCycle++;
        if (newCycle >= 4) {
          nextMode = 'long_break';
          newCycle = 0;
        } else {
          nextMode = 'short_break';
        }
      }

      const nextDuration = getSessionDuration(nextMode, prev.settings);

      return {
        ...prev,
        focusSessions: newFocusSessions,
        timer: {
          ...prev.timer,
          isRunning: false,
          sessionType: nextMode,
          cyclePosition: newCycle,
          remainingSeconds: nextDuration,
          totalSeconds: nextDuration,
          totalMinutesToday,
          totalMinutesWeek,
          completedSessions,
          longestSession,
          currentStreak,
          longestStreak,
          lastSessionDate,
          sessionCount: prev.timer.sessionCount + 1
        }
      };
    });
  };

  // ── Quiz ──────────────────────────────────────────────────
  const saveQuizResult = (materiaId, level, score, total) => {
    dispatchUpdate(prev => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [materiaId]: { level, score, total, completedAt: Date.now() },
      },
    }));
    Haptics.notificationAsync(
      score === total ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    );
    showToast(`Quiz concluído: ${score}/${total} 📝`);
  };

  // Registro granular por assunto (Melhoria 5/6) — coexiste com saveQuizResult/
  // quizResults, não o substitui. Só as matérias com conteúdo rico usam isto.
  const saveAssuntoQuizResult = (materiaId, assuntoId, ano, score, total) => {
    dispatchUpdate(prev => ({
      ...prev,
      quizResultsPorAssunto: {
        ...prev.quizResultsPorAssunto,
        [materiaId]: {
          ...prev.quizResultsPorAssunto[materiaId],
          [assuntoId]: { score, total, ano, completedAt: Date.now() },
        },
      },
    }));
    Haptics.notificationAsync(
      score === total ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    );
    showToast(`Quiz concluído: ${score}/${total} 📝`);
  };

  // ── Navegação e Utils ─────────────────────────────────────
  const setSelectedMateria = (id) => dispatchUpdate({ selectedMateriaId: id });

  const clearAllData = async () => {
    await AsyncStorage.removeItem(STORE_KEY);
    dispatchUpdate(prev => ({
      ...prev,
      materias: [], notas: [], flashcards: [], checklistCategories: [], anotacoes: [],
      calendar: { ...prev.calendar, events: [] },
      timer: { ...prev.timer, totalMinutesToday: 0, completedSessions: 0 }
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Todos os dados foram apagados');
  };

  const value = {
    state,
    isStoreLoaded,
    exportData,
    importData,
    calcularMedia: (materiaId) => calcularMedia(state.notas, materiaId),
    mediaBadge, formatRelativeDate, formatDate, getGreeting, getSessionDuration: (type) => getSessionDuration(type, state.settings),
    setUserName, changeSetting, completeOnboarding, setSchoolLevel, saveMateria, addMateriasBatch, deleteMateria, updateMateriaImage, saveNota, deleteNota,
    toggleFlashcard, saveFlashcard, deleteFlashcard, reviewFlashcard, saveCategoryTitle, deleteCategory,
    saveChecklistItem, toggleChecklistItem, deleteChecklistItem, saveAnotacao, deleteAnotacao,
    setNotesFilter, saveEvent, deleteEvent, setCalendarView, setCalSelectedDate,
    prevMonth, nextMonth, updateTimer, finishTimerSession, setFocusMateria, setSelectedMateria, clearAllData,
    saveQuizResult, saveAssuntoQuizResult, loadDemoData,
    showToast, showConfirm,
  };

  return (
    <EstudixContext.Provider value={value}>
      {children}
      <Toast message={toastMessage} />
      <ConfirmModal
        visible={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        cancelLabel={confirmDialog?.cancelLabel}
        hideCancel={confirmDialog?.hideCancel}
        destructive={confirmDialog?.destructive}
        onCancel={closeConfirm}
        onConfirmPress={() => {
          confirmDialog?.onConfirm?.();
          closeConfirm();
        }}
      />
    </EstudixContext.Provider>
  );
}

export function useEstudix() {
  const ctx = useContext(EstudixContext);
  if (!ctx) throw new Error('useEstudix deve ser usado dentro de EstudixProvider');
  return ctx;
}

export default EstudixContext;