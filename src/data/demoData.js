// ============================================================
//  ESTUDIX — Dados de demonstração (Fase 6)
//  Conteúdo puramente declarativo (sem ids, sem timestamps) —
//  quem materializa isso em estado real é EstudixContext.loadDemoData.
//  Usado só para apresentação/QA das telas de desempenho e
//  sugestões sem precisar responder dezenas de exercícios ao vivo.
//  Não roda automaticamente em nenhum fluxo do usuário.
// ============================================================

export const DEMO_ANO_ESCOLAR = '1';

export const DEMO_MATERIAS = [
  { curriculoKey: 'matematica', name: 'Matemática' },
  { curriculoKey: 'portugues', name: 'Língua Portuguesa' },
  { curriculoKey: 'historia', name: 'História' },
];

// assuntoId → { score, total, ano } — mistura de propósito domínio,
// dificuldade e assunto ainda não respondido (ex. 'funcao-2-grau' e
// 'probabilidade-basica' ficam de fora, para exercitar "próximo conteúdo").
export const DEMO_QUIZ_RESULTADOS = {
  matematica: {
    'funcao-1-grau': { score: 5, total: 5, ano: '1' },
    'medidas-tendencia-central': { score: 2, total: 5, ano: '2' },
  },
  portugues: {
    'redacao-dissertativa': { score: 4, total: 5, ano: '1' },
    modernismo: { score: 1, total: 5, ano: '3' },
  },
  historia: {
    'era-vargas': { score: 5, total: 5, ano: '3' },
    'guerra-fria': { score: 3, total: 5, ano: '3' },
  },
};

export const DEMO_FLASHCARDS = [
  { materiaKey: 'matematica', question: 'Qual a fórmula de Bhaskara?', answer: 'x = (−b ± √Δ) / 2a' },
  { materiaKey: 'portugues', question: 'O que é crase?', answer: 'Fusão da preposição "a" com o artigo feminino "a"/"as".' },
];

export const DEMO_TIMER_STATS = {
  totalMinutesToday: 25,
  totalMinutesWeek: 140,
  completedSessions: 12,
  longestSession: 50,
  currentStreak: 4,
  longestStreak: 7,
};
