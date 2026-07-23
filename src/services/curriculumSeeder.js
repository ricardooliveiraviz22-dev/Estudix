// ============================================================
//  ESTUDIX — Seeder da grade curricular (M3)
//  Função pura: decide quais disciplinas de um ano do Ensino
//  Médio ainda faltam ser criadas como matéria do usuário.
//  Não acessa o Context/estado global — só calcula o que falta;
//  quem efetivamente insere é EstudixContext.addMateriasBatch.
// ============================================================

import { getDisciplinasComuns } from '../data/curriculo';
import { findSubjectKey } from '../lib/subjects';

/**
 * Retorna as disciplinas da grade curricular do `ano` informado que ainda
 * não existem em `materiasExistentes` — evita duplicar uma disciplina que
 * o usuário já tenha cadastrado manualmente (reconhecida pelo nome) ou que
 * já tenha sido criada por um seed anterior (reconhecida por curriculoKey).
 *
 * @param {'1'|'2'|'3'} ano
 * @param {Array} materiasExistentes
 * @returns {Array<{name: string, curriculoKey: string, anoEscolar: string}>}
 */
export function seedMateriasFromCurriculo(ano, materiasExistentes = []) {
  const disciplinas = getDisciplinasComuns(ano);

  const chavesExistentes = new Set(
    materiasExistentes
      .map((m) => m.curriculoKey || findSubjectKey(m.name))
      .filter(Boolean)
  );

  return disciplinas
    .filter((d) => !chavesExistentes.has(d.subjectKey))
    .map((d) => ({ name: d.name, curriculoKey: d.subjectKey, anoEscolar: ano }));
}
