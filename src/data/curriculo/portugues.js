// ============================================================
//  ESTUDIX — Conteúdo de Língua Portuguesa (Ensino Médio)
//  Dado estático/somente-leitura — mesmo padrão de materiaInsights.js.
//  Disciplina "vitrine" da Fase 4.
// ============================================================

export default {
  subjectKey: 'portugues',
  modulos: [
    {
      id: 'literatura-brasileira',
      nome: 'Literatura Brasileira',
      ano: '3', // ano em que o assunto costuma ser trabalhado — usado por EXERCICIOS em quizzes.js
      assuntos: [
        {
          id: 'modernismo',
          nome: 'Modernismo',
          teoria: 'O Modernismo brasileiro foi um movimento cultural iniciado oficialmente com a Semana de Arte Moderna de 1922, em São Paulo. Rompeu com os padrões estéticos tradicionais, valorizando a linguagem coloquial, o nacionalismo crítico e a experimentação formal.',
          resumo: 'Costuma ser dividido em três fases: 1ª geração (ruptura, 1922-1930), 2ª geração (consolidação, 1930-1945) e 3ª geração (Pós-Modernismo, a partir de 1945).',
          exemplos: [
            'Mário de Andrade, em "Macunaíma", mistura linguagem coloquial e elementos do folclore brasileiro.',
            'Manuel Bandeira usa versos livres e temas do cotidiano em "Vou-me embora pra Pasárgada".',
          ],
          curiosidades: [
            'A Semana de Arte Moderna de 1922 causou tanta polêmica que o público chegou a vaiar e jogar objetos no palco durante as apresentações.',
          ],
          dicas: [
            'Associe cada autor a uma fase do Modernismo — é um dos pontos mais cobrados em prova.',
            'Leia pelo menos um poema de cada fase para sentir a diferença de linguagem.',
          ],
          formulas: [],
        },
        {
          id: 'realismo-naturalismo',
          nome: 'Realismo e Naturalismo',
          teoria: 'O Realismo (a partir de 1881, no Brasil) retrata a sociedade de forma crítica e objetiva, com foco em temas como adultério e hipocrisia burguesa. O Naturalismo, contemporâneo, radicaliza essa objetividade, tratando personagens quase como produto do meio e da herança biológica.',
          resumo: 'Realismo: análise psicológica e crítica social (Machado de Assis). Naturalismo: determinismo biológico e social, personagens marginalizados (Aluísio Azevedo).',
          exemplos: [
            '"Dom Casmurro", de Machado de Assis, é a obra-símbolo do Realismo brasileiro.',
            '"O Cortiço", de Aluísio Azevedo, retrata o cortiço como um organismo que determina o destino dos moradores — típico do Naturalismo.',
          ],
          curiosidades: [
            'Machado de Assis é considerado por muitos críticos o maior escritor da língua portuguesa e fundou a Academia Brasileira de Letras.',
          ],
          dicas: [
            'Machado de Assis cai muito em prova — vale a pena conhecer bem "Dom Casmurro" e a dúvida sobre a traição de Capitu.',
            'Não confunda Realismo com Naturalismo: o Naturalismo é mais "cru" e biológico.',
          ],
          formulas: [],
        },
      ],
    },
    {
      id: 'redacao-gramatica',
      nome: 'Redação e Gramática',
      ano: '1',
      assuntos: [
        {
          id: 'redacao-dissertativa',
          nome: 'Redação Dissertativa-Argumentativa',
          teoria: 'É o tipo de texto cobrado no ENEM: apresenta um ponto de vista sobre um tema (tese), defende-o com argumentos e dados, e termina com uma proposta de intervenção que respeite os direitos humanos.',
          resumo: 'Estrutura clássica: introdução (contextualização + tese), dois parágrafos de desenvolvimento (um argumento por parágrafo) e conclusão (retomada + proposta de intervenção detalhada).',
          exemplos: [
            'Introdução: contextualizar o tema com um fato histórico ou social antes de apresentar a tese.',
            'Proposta de intervenção completa cita: o quê, quem faz, como, e qual o efeito esperado.',
          ],
          curiosidades: [
            'Desde 2009, uma proposta de intervenção que fere os direitos humanos zera a redação do ENEM, mesmo que o resto do texto esteja bem escrito.',
          ],
          dicas: [
            'Treine repertório sociocultural lendo notícias e citando dados de fontes confiáveis.',
            'Sempre detalhe os elementos da proposta de intervenção: agente, ação, modo, efeito e detalhamento.',
          ],
          formulas: [],
        },
        {
          id: 'regencia-crase',
          nome: 'Regência e Crase',
          teoria: 'Regência verbal e nominal trata da relação entre um verbo (ou nome) e seus complementos, definindo se é preciso ou não usar preposição. Crase é a fusão da preposição "a" com o artigo feminino "a" ou "as", marcada pelo acento grave (à).',
          resumo: 'A crase só ocorre antes de palavras femininas que aceitam o artigo "a". Regra prática: troque a palavra feminina por uma masculina equivalente — se aparecer "ao", há crase.',
          exemplos: [
            '"Vou à escola" (crase) vs. "Vou ao colégio" (o masculino confirma a crase).',
            '"Assistir ao filme" (a regência do verbo assistir, no sentido de "ver", pede a preposição "a").',
          ],
          curiosidades: [
            'Antes das reformas ortográficas, a crase já causava discussão entre gramáticos — é um dos temas mais tradicionais e cobrados da língua portuguesa.',
          ],
          dicas: [
            'Sempre teste a substituição por uma palavra masculina para confirmar a crase.',
            'Decore os verbos de regência mais cobrados: assistir, aspirar, visar, obedecer.',
          ],
          formulas: [],
        },
      ],
    },
  ],
};
