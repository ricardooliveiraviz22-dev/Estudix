// ============================================================
//  ESTUDIX — Mentor Digital (Tela de Foco)
//  Motor de regras determinístico — mesmo espírito de ACHIEVEMENTS
//  (EstudixContext.js) e buildRecommendations (lib/recommendations.js):
//  cada mensagem é um fato simples derivado do estado real do usuário,
//  sem heurística nem texto motivacional genérico. Consome a saída de
//  lib/performance.js.
// ============================================================

import { calcularDesempenhoGeral } from './performance';

const MODE_LABEL = { focus: 'foco', short_break: 'curta', long_break: 'longa' };

/**
 * Deriva a mensagem do Mentor Digital para o estado atual da sessão de
 * Pomodoro. Recebe `remainingMinutes` separado do state para permitir que
 * quem chama controle a granularidade de recálculo (evita recalcular a
 * cada segundo do timer).
 *
 * @param {Object} state — state completo do EstudixContext
 * @param {number} remainingMinutes — minutos restantes da sessão atual (arredondado)
 */
export function getMentorMessage(state, remainingMinutes) {
  const { timer, materias } = state;
  const materiaAtual = materias.find((m) => m.id === timer.materiaId);
  const isFresh = timer.remainingSeconds === timer.totalSeconds;

  // ── Durante uma sessão de foco ──────────────────────────────
  if (timer.isRunning && timer.sessionType === 'focus') {
    return {
      icon: 'compass',
      message: materiaAtual
        ? `Você está estudando ${materiaAtual.name}. Mantenha o foco pelos próximos ${remainingMinutes} min.`
        : `Sessão de foco em andamento — faltam ${remainingMinutes} min. Mantenha a concentração.`,
    };
  }

  // ── Durante uma pausa (curta ou longa) ──────────────────────
  if (timer.isRunning && timer.sessionType !== 'focus') {
    const isLong = timer.sessionType === 'long_break';
    const sessoes = timer.completedSessions || 0;
    return {
      icon: 'coffee',
      message: isLong
        ? `Ciclo completo! Você já fez ${sessoes} ${sessoes === 1 ? 'sessão' : 'sessões'} hoje. Aproveite a pausa mais longa.`
        : `Sessão concluída. Você já fez ${sessoes} ${sessoes === 1 ? 'sessão' : 'sessões'} hoje — aproveite a pausa curta.`,
    };
  }

  // ── Pausada no meio de uma sessão de foco ───────────────────
  if (!timer.isRunning && timer.sessionType === 'focus' && !isFresh) {
    return {
      icon: 'pause-circle',
      message: 'Sessão pausada. Retome quando estiver pronto para continuar.',
    };
  }

  // ── Parada no meio de uma pausa ─────────────────────────────
  if (!timer.isRunning && timer.sessionType !== 'focus' && !isFresh) {
    return {
      icon: 'coffee',
      message: `Pausa ${MODE_LABEL[timer.sessionType]} em andamento. Retome quando quiser voltar a focar.`,
    };
  }

  // ── Antes de iniciar uma sessão (estado padrão) ─────────────
  // Prioridade: tópicos com dificuldade > matéria selecionada > sequência de dias > estado neutro.
  const desempenhos = calcularDesempenhoGeral(state);
  const totalDificuldades = desempenhos.reduce((acc, d) => acc + d.dificuldades.length, 0);

  if (totalDificuldades > 0) {
    return {
      icon: 'alert-circle',
      message: `Você tem ${totalDificuldades} ${totalDificuldades === 1 ? 'tópico' : 'tópicos'} com menos de 50% de acerto no último quiz. Revisá-lo${totalDificuldades === 1 ? '' : 's'} agora aumenta sua retenção.`,
    };
  }

  if (materiaAtual) {
    return {
      icon: 'target',
      message: `Você estudará ${materiaAtual.name} agora. Mantenha o foco pelos próximos ${remainingMinutes} minutos.`,
    };
  }

  if ((timer.currentStreak || 0) > 0) {
    const dias = timer.currentStreak;
    return {
      icon: 'zap',
      message: `Você está numa sequência de ${dias} ${dias === 1 ? 'dia' : 'dias'} estudando. Continue assim hoje.`,
    };
  }

  return {
    icon: 'sunrise',
    message: 'Escolha uma matéria acima e inicie sua sessão de foco.',
  };
}
