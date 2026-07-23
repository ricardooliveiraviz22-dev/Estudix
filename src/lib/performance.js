// ============================================================
//  ESTUDIX — Avaliação de Desempenho (Melhoria 6)
//  Funções puras: recebem fatias do estado e devolvem números/listas.
//  Não fazem dispatch, não usam Context — podem ser chamadas
//  diretamente de qualquer tela e testadas isoladamente.
//
//  Fonte dos dados: quizResultsPorAssunto (Fase 6), que existe ao
//  lado de quizResults sem substituí-lo — só as matérias com
//  conteúdo rico (getConteudoDisciplina) têm dado aqui.
// ============================================================

import { getConteudoDisciplina } from '../data/curriculo';
import { findSubjectKey } from './subjects';

const DOMINIO_THRESHOLD = 0.8;    // >=80% de acerto = assunto dominado
const DIFICULDADE_THRESHOLD = 0.5; // <50% de acerto = dificuldade / assunto para revisão

/**
 * Calcula o desempenho de UMA matéria com conteúdo rico: percentual de
 * acertos, progresso (quantos assuntos já foram respondidos), assuntos
 * dominados, com dificuldade, e o próximo assunto ainda não respondido.
 *
 * @param {string} materiaId
 * @param {Object} conteudo - retorno de getConteudoDisciplina (módulos/assuntos)
 * @param {Object} quizResultsPorAssunto - state.quizResultsPorAssunto completo
 */
export function calcularDesempenhoMateria(materiaId, conteudo, quizResultsPorAssunto) {
  const resultados = quizResultsPorAssunto[materiaId] || {};
  const todosAssuntos = conteudo.modulos.flatMap((m) => m.assuntos.map((a) => ({ id: a.id, nome: a.nome })));

  const respondidos = todosAssuntos.filter((a) => resultados[a.id]);
  const naoRespondidos = todosAssuntos.filter((a) => !resultados[a.id]);

  const dominados = [];
  const dificuldades = [];
  let somaPercentuais = 0;

  respondidos.forEach((assunto) => {
    const r = resultados[assunto.id];
    const pct = r.total > 0 ? r.score / r.total : 0;
    somaPercentuais += pct;
    if (pct >= DOMINIO_THRESHOLD) dominados.push(assunto);
    else if (pct < DIFICULDADE_THRESHOLD) dificuldades.push(assunto);
  });

  return {
    totalAssuntos: todosAssuntos.length,
    respondidos: respondidos.length,
    percentualProgresso: todosAssuntos.length > 0 ? Math.round((respondidos.length / todosAssuntos.length) * 100) : 0,
    percentualAcertoMedio: respondidos.length > 0 ? Math.round((somaPercentuais / respondidos.length) * 100) : 0,
    dominados,
    dificuldades,
    proximoAssunto: naoRespondidos[0] || null, // primeiro assunto ainda não respondido, na ordem dos módulos
  };
}

/**
 * Mesma coisa que calcularDesempenhoMateria, mas para TODAS as matérias do
 * usuário que têm conteúdo rico — usado pela Home e pelo motor de sugestões.
 */
export function calcularDesempenhoGeral(state) {
  return state.materias
    .map((materia) => {
      const conteudo = getConteudoDisciplina(materia.curriculoKey || findSubjectKey(materia.name));
      if (!conteudo) return null;
      return {
        materiaId: materia.id,
        materiaNome: materia.name,
        ...calcularDesempenhoMateria(materia.id, conteudo, state.quizResultsPorAssunto),
      };
    })
    .filter(Boolean);
}

/**
 * "Evolução do aluno" — IMPORTANTE: mede consistência de HÁBITO de estudo
 * (streak/sessões de foco), não evolução de DESEMPENHO acadêmico (notas ao
 * longo do tempo). Isso é proposital, não uma limitação escondida:
 * quizResultsPorAssunto guarda só o resultado mais recente de cada assunto
 * (decisão da Fase 5/6, para não expandir o schema com um histórico de
 * tentativas), então não existe série temporal de nota para calcular uma
 * tendência de desempenho a partir dela. Se a avaliação da Melhoria 6 exigir
 * "evolução de desempenho" no sentido de notas melhorando com o tempo, esta
 * função NÃO cobre isso — cobre a evolução do hábito que sustenta o desempenho.
 */
export function calcularEvolucao(timer) {
  return {
    streakAtual: timer.currentStreak || 0,
    streakRecorde: timer.longestStreak || 0,
    sessoesConcluidas: timer.completedSessions || 0,
    minutosSemana: timer.totalMinutesWeek || 0,
  };
}
