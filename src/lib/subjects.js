// ============================================================
//  ESTUDIX — Normalização e busca de matérias (subjectKey)
//  Fonte única de verdade para mapear o nome de uma matéria
//  (digitado pelo usuário ou vindo da grade curricular) para a
//  chave canônica usada em materiaInsights, quizzes e curriculo.
// ============================================================

// ── Aliases: como o usuário costuma digitar cada matéria ────
const SUBJECT_ALIASES = {
  matematica:      ['matematica', 'mat', 'calculo', 'algebra'],
  portugues:       ['portugues', 'lingua portuguesa', 'literatura', 'gramatica'],
  historia:        ['historia'],
  geografia:       ['geografia'],
  fisica:          ['fisica'],
  quimica:         ['quimica'],
  biologia:        ['biologia', 'bio', 'ciencias'],
  ingles:          ['ingles', 'english'],
  espanhol:        ['espanhol', 'spanish'],
  educacao_fisica: ['educacao fisica', 'ed fisica', 'ed. fisica'],
  artes:           ['artes', 'arte'],
  filosofia:       ['filosofia'],
  sociologia:      ['sociologia'],
  redacao:         ['redacao'],
};

export const SUBJECT_KEYS = Object.keys(SUBJECT_ALIASES);

// ── Ícones pré-definidos: um ícone fixo e reconhecível por matéria ──
// Usados quando o nome digitado bate com uma matéria conhecida (via
// findSubjectKey). Matérias "livres" (nome não reconhecido) continuam
// usando o ciclo de MATERIA_ICONS como fallback.
const SUBJECT_ICONS = {
  matematica:      'calculator-outline',
  portugues:       'book-outline',
  historia:        'time-outline',
  geografia:       'earth-outline',
  fisica:          'planet-outline',
  quimica:         'flask-outline',
  biologia:        'leaf-outline',
  ingles:          'language-outline',
  espanhol:        'language-outline',
  educacao_fisica: 'fitness-outline',
  artes:           'color-palette-outline',
  filosofia:       'bulb-outline',
  sociologia:      'people-outline',
  redacao:         'create-outline',
};

// Retorna o ícone fixo da matéria reconhecida, ou null se o nome não
// corresponder a nenhuma matéria conhecida (aí quem chama decide o fallback).
export function getIconForSubject(materiaName) {
  const key = findSubjectKey(materiaName);
  return key ? (SUBJECT_ICONS[key] || null) : null;
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// Lista achatada de (chave, alias), ordenada do alias mais longo para o
// mais curto — evita que "física" capture "educação física" por engano.
const ALIAS_LOOKUP = Object.entries(SUBJECT_ALIASES)
  .flatMap(([key, aliases]) => aliases.map(alias => [key, alias]))
  .sort((a, b) => b[1].length - a[1].length);

export function findSubjectKey(materiaName) {
  if (!materiaName) return null;
  const norm = normalize(materiaName);
  const match = ALIAS_LOOKUP.find(([, alias]) => norm.includes(alias));
  return match ? match[0] : null;
}