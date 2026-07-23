// ============================================================
//  ESTUDIX — Grade Curricular do Ensino Médio (SEDU-ES)
//  Formação Geral Básica do Novo Ensino Médio, currículo do
//  Espírito Santo (SEDU) — comum às escolas estaduais, inclusive
//  as localizadas no Município de Serra (Ensino Médio é
//  atribuição estadual, não municipal).
//
//  Os Itinerários Formativos (parte flexível, definida por
//  escola/polo) não entram aqui — variam entre instituições e
//  ficam fora do escopo desta v1 (seriam adicionados manualmente
//  pelo usuário, não auto-detectados).
//
//  Cada `subjectKey` referencia a chave canônica de src/lib/subjects.js.
// ============================================================

import conteudoMatematica from './matematica';
import conteudoPortugues from './portugues';
import conteudoHistoria from './historia';

// Comum aos 1º, 2º e 3º anos — a Formação Geral Básica não varia por ano.
export const DISCIPLINAS_COMUNS = [
  { subjectKey: 'portugues',       name: 'Língua Portuguesa' },
  { subjectKey: 'ingles',          name: 'Língua Inglesa' },
  { subjectKey: 'artes',           name: 'Artes' },
  { subjectKey: 'educacao_fisica', name: 'Educação Física' },
  { subjectKey: 'matematica',      name: 'Matemática' },
  { subjectKey: 'biologia',        name: 'Biologia' },
  { subjectKey: 'fisica',          name: 'Física' },
  { subjectKey: 'quimica',         name: 'Química' },
  { subjectKey: 'filosofia',       name: 'Filosofia' },
  { subjectKey: 'geografia',       name: 'Geografia' },
  { subjectKey: 'historia',        name: 'História' },
  { subjectKey: 'sociologia',      name: 'Sociologia' },
];

// Opções de ano para o seletor de escolaridade do cadastro (Fase 2) —
// v1 atende apenas o Ensino Médio, conforme escopo da Melhoria 1.
export const ANOS_ENSINO_MEDIO = [
  { id: '1', label: '1º Ano', sublabel: 'Ensino Médio' },
  { id: '2', label: '2º Ano', sublabel: 'Ensino Médio' },
  { id: '3', label: '3º Ano', sublabel: 'Ensino Médio' },
];

export const CURRICULO_MEDIO = {
  '1': DISCIPLINAS_COMUNS,
  '2': DISCIPLINAS_COMUNS,
  '3': DISCIPLINAS_COMUNS,
};

/** Retorna as disciplinas da Formação Geral Básica para o ano informado ('1' | '2' | '3'). */
export function getDisciplinasComuns(ano) {
  return CURRICULO_MEDIO[ano] || [];
}

// ── Conteúdo rico por disciplina (módulos → assuntos → teoria/resumo/
// exemplos/curiosidades/dicas/fórmulas) — Melhoria 4. Escopo inicial
// restrito a 3 disciplinas "vitrine" (ver observação da Fase 4 do plano);
// as demais continuam só com tópicos + dicas via materiaInsights.js.
const CONTEUDO_POR_DISCIPLINA = {
  matematica: conteudoMatematica,
  portugues: conteudoPortugues,
  historia: conteudoHistoria,
};

/** Retorna o conteúdo rico (módulos/assuntos) de uma disciplina, ou null se ainda não implementado. */
export function getConteudoDisciplina(subjectKey) {
  return CONTEUDO_POR_DISCIPLINA[subjectKey] || null;
}
