// ============================================================
//  ESTUDIX — Sugestões Inteligentes (Melhoria 7)
//  Motor de regras determinístico — sem IA. Mesmo espírito de
//  ACHIEVEMENTS em EstudixContext.js: cada sugestão é um fato
//  simples derivado do estado, sem heurística nenhuma.
//  Consome a saída de lib/performance.js.
// ============================================================

import { calcularDesempenhoGeral } from './performance';

// Duplicado de EstudixContext.todayStr de propósito — evita importar de lá
// (Context importaria recommendations.js pra futuras telas usarem, o que
// criaria um ciclo de import). É uma função de 3 linhas, o custo é baixo.
function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const PRIORIDADE = { revisao: 1, revisao_flashcards: 1, tempo_estudo: 2, proximo_conteudo: 2, frequencia_revisao: 3 };

/**
 * Gera a lista de sugestões do usuário, ordenada da mais urgente para a
 * menos urgente. Cada regra é independente e testável isoladamente.
 */
export function buildRecommendations(state) {
  const recomendacoes = [];
  const desempenhos = calcularDesempenhoGeral(state);
  const hoje = todayStr();

  desempenhos.forEach(({ materiaId, materiaNome, dificuldades, proximoAssunto }) => {
    // Regra: assunto com <50% de acerto → sugerir revisão
    dificuldades.forEach((assunto) => {
      recomendacoes.push({
        type: 'revisao',
        materiaId,
        assuntoId: assunto.id,
        message: `Revise "${assunto.nome}" em ${materiaNome} — menos de 50% de acerto no último quiz.`,
      });
    });

    // Regra: próximo conteúdo ainda não respondido
    if (proximoAssunto) {
      recomendacoes.push({
        type: 'proximo_conteudo',
        materiaId,
        assuntoId: proximoAssunto.id,
        message: `Próximo conteúdo sugerido em ${materiaNome}: "${proximoAssunto.nome}".`,
      });
    }
  });

  // Regra: flashcards vencidos hoje → frequência ideal de revisão
  const flashcardsVencidos = state.flashcards.filter((f) => (f.dueDate || hoje) <= hoje).length;
  if (flashcardsVencidos > 0) {
    recomendacoes.push({
      type: 'revisao_flashcards',
      message: `Você tem ${flashcardsVencidos} ${flashcardsVencidos === 1 ? 'flashcard' : 'flashcards'} para revisar hoje.`,
    });
  }

  // Regra: nenhum minuto de foco hoje → tempo sugerido de estudo (usa a meta já configurada)
  if ((state.timer.totalMinutesToday || 0) === 0) {
    recomendacoes.push({
      type: 'tempo_estudo',
      message: `Você ainda não estudou hoje — que tal um bloco de ${state.settings.focusMin} minutos de foco?`,
    });
  }

  // Regra: sequência de dias estudados zerada → frequência ideal de revisão
  if ((state.timer.currentStreak || 0) === 0) {
    recomendacoes.push({
      type: 'frequencia_revisao',
      message: 'Sua sequência de estudos está zerada — estudar um pouco todo dia rende mais do que maratonas espaçadas.',
    });
  }

  return recomendacoes.sort((a, b) => (PRIORIDADE[a.type] || 9) - (PRIORIDADE[b.type] || 9));
}
