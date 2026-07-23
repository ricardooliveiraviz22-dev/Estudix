// ============================================================
//  ESTUDIX — Base de Dicas de Estudo por Matéria
//  Conteúdo curado localmente (offline, sem IA/API externa).
//  Cruza o nome da matéria cadastrada com o nível de
//  escolaridade do usuário para sugerir tópicos críticos e
//  dicas de estudo.
// ============================================================

import { findSubjectKey } from '../lib/subjects';

export const SCHOOL_LEVELS = [
  { id: 'fundamental1', label: 'Fundamental I',  sublabel: '1º ao 5º ano' },
  { id: 'fundamental2', label: 'Fundamental II', sublabel: '6º ao 9º ano' },
  { id: 'medio',        label: 'Ensino Médio',   sublabel: '' },
  { id: 'superior',     label: 'Ensino Superior', sublabel: '' },
];

const LEVEL_LABEL = Object.fromEntries(SCHOOL_LEVELS.map(l => [l.id, l.label]));

// ── Conteúdo por matéria e nível ─────────────────────────────
const INSIGHTS = {
  matematica: {
    fundamental1: {
      topicos: ['Tabuada e operações básicas', 'Frações simples', 'Sistema de medidas', 'Formas geométricas'],
      dicas: [
        'Pratique a tabuada todos os dias, mesmo que por 5 minutos.',
        'Use objetos do dia a dia para entender frações (pizza, chocolate).',
        'Desenhe os problemas antes de tentar resolver.',
      ],
    },
    fundamental2: {
      topicos: ['Equações do 1º e 2º grau', 'Frações e números racionais', 'Proporção e regra de três', 'Geometria plana (área e perímetro)'],
      dicas: [
        'Refaça no mesmo dia os exercícios que errou — não deixe acumular.',
        'Monte um caderno de fórmulas para consulta rápida.',
        'Resolva os problemas passo a passo, sem pular etapas.',
      ],
    },
    medio: {
      topicos: ['Funções (1º e 2º grau, exponencial, log)', 'Trigonometria', 'Progressões (PA e PG)', 'Estatística e probabilidade', 'Geometria espacial'],
      dicas: [
        'Funções aparecem em boa parte do ENEM — priorize esse tópico.',
        'Treine questões de vestibulares anteriores com tempo cronometrado.',
        'Crie um mapa mental conectando os tipos de função.',
      ],
    },
    superior: {
      topicos: ['Cálculo diferencial e integral', 'Álgebra linear', 'Estatística aplicada', 'Equações diferenciais'],
      dicas: [
        'Refaça as demonstrações dos teoremas — não decore só o resultado.',
        'Forme um grupo de estudos para resolver listas de exercícios.',
        'Use recursos visuais (GeoGebra, Desmos) para entender os gráficos.',
      ],
    },
  },

  portugues: {
    fundamental1: {
      topicos: ['Alfabetização e leitura', 'Ortografia básica', 'Interpretação de texto simples'],
      dicas: [
        'Leia em voz alta por 10 minutos todos os dias.',
        'Monte um caderno de palavras novas.',
        'Reescreva textos curtos com suas próprias palavras.',
      ],
    },
    fundamental2: {
      topicos: ['Classes gramaticais', 'Concordância verbal e nominal', 'Interpretação de texto', 'Gêneros textuais'],
      dicas: [
        'Leia o texto duas vezes antes de responder às questões.',
        'Anote conectivos (mas, porém, portanto) e como cada um é usado.',
        'Pratique reescrever frases trocando a ordem das palavras.',
      ],
    },
    medio: {
      topicos: ['Literatura brasileira (Barroco ao Modernismo)', 'Redação dissertativa-argumentativa', 'Regência e crase', 'Figuras de linguagem'],
      dicas: [
        'Leia notícias de fontes diferentes para ganhar repertório de redação.',
        'Treine uma redação por semana e peça correção.',
        'Monte uma linha do tempo dos movimentos literários com autores-chave.',
      ],
    },
    superior: {
      topicos: ['Produção textual acadêmica', 'Normas ABNT', 'Leitura crítica de texto científico'],
      dicas: [
        'Leia artigos da sua área destacando a estrutura do texto.',
        'Use um gerenciador de referências (Mendeley, Zotero) desde já.',
        'Peça revisão de colegas antes de entregar textos importantes.',
      ],
    },
  },

  historia: {
    fundamental1: {
      topicos: ['Linha do tempo pessoal e familiar', 'Datas comemorativas e sua origem', 'Comunidade e cidadania'],
      dicas: [
        'Monte uma linha do tempo ilustrada.',
        'Converse com familiares sobre histórias do passado.',
        'Associe datas importantes a desenhos.',
      ],
    },
    fundamental2: {
      topicos: ['Antiguidade Clássica (Grécia e Roma)', 'Idade Média', 'Brasil Colônia', 'Revolução Industrial'],
      dicas: [
        'Crie linhas do tempo comparando períodos diferentes.',
        'Associe cada período a um mapa da época.',
        'Resuma cada capítulo em até 5 frases.',
      ],
    },
    medio: {
      topicos: ['Brasil República', 'Guerras Mundiais', 'Guerra Fria', 'Ditadura Militar Brasileira', 'Globalização'],
      dicas: [
        'Relacione fatos históricos com notícias atuais — cai muito no ENEM.',
        'Estude com mapas para entender conflitos geopolíticos.',
        'Grave resumos em áudio e ouça durante deslocamentos.',
      ],
    },
    superior: {
      topicos: ['Historiografia e métodos de pesquisa', 'Análise de fontes primárias', 'História contemporânea'],
      dicas: [
        'Sempre confira a fonte primária antes de citar.',
        'Compare diferentes historiadores sobre o mesmo evento.',
        'Organize fichamentos por tema, não por livro.',
      ],
    },
  },

  geografia: {
    fundamental1: {
      topicos: ['Pontos cardeais e mapas', 'Paisagem natural e urbana', 'Meio ambiente local'],
      dicas: [
        'Desenhe o mapa do seu bairro.',
        'Observe o clima e registre as mudanças da semana.',
        'Associe os pontos cardeais ao nascer e pôr do sol.',
      ],
    },
    fundamental2: {
      topicos: ['Relevo e clima do Brasil', 'População e migrações', 'Urbanização', 'Recursos naturais'],
      dicas: [
        'Use mapas mudos para praticar localização.',
        'Relacione clima e vegetação de cada região.',
        'Monte fichas com dados de cada região brasileira.',
      ],
    },
    medio: {
      topicos: ['Geopolítica mundial', 'Globalização e blocos econômicos', 'Questões ambientais', 'Urbanização e desigualdade social'],
      dicas: [
        'Acompanhe notícias internacionais semanalmente.',
        'Relacione geografia com atualidades — tema recorrente no ENEM.',
        'Estude com atlas e pratique localização de países.',
      ],
    },
    superior: {
      topicos: ['Geografia econômica', 'Geopolítica contemporânea', 'Cartografia e geoprocessamento'],
      dicas: [
        'Pratique com softwares de SIG (QGIS), se tiver acesso.',
        'Leia relatórios de organismos internacionais (ONU, Banco Mundial).',
        'Discuta casos reais em grupo de estudos.',
      ],
    },
  },

  fisica: {
    medio: {
      topicos: ['Cinemática (MRU e MRUV)', 'Leis de Newton', 'Termologia', 'Eletricidade básica', 'Óptica'],
      dicas: [
        'Resolva muitos exercícios numéricos — física se aprende praticando.',
        'Sempre desenhe o diagrama de forças antes de calcular.',
        'Revise as unidades de medida — erro comum em prova.',
      ],
    },
    superior: {
      topicos: ['Mecânica clássica avançada', 'Eletromagnetismo', 'Termodinâmica', 'Física moderna'],
      dicas: [
        'Refaça as derivações das fórmulas principais.',
        'Resolva listas de exercícios com colegas semanalmente.',
        'Use simulações (PhET) para visualizar os fenômenos.',
      ],
    },
  },

  quimica: {
    medio: {
      topicos: ['Tabela periódica e ligações químicas', 'Estequiometria', 'Química orgânica básica', 'Soluções e concentração'],
      dicas: [
        'Monte flashcards dos elementos e suas propriedades.',
        'Pratique balanceamento de equações diariamente.',
        'Relacione química orgânica com o dia a dia (alimentos, remédios).',
      ],
    },
    superior: {
      topicos: ['Química analítica', 'Físico-química', 'Química orgânica avançada'],
      dicas: [
        'Refaça os cálculos de laboratório em casa.',
        'Monte tabelas comparativas entre tipos de reação.',
        'Revise mecanismos de reação com desenhos.',
      ],
    },
  },

  biologia: {
    fundamental1: {
      topicos: ['Seres vivos e não vivos', 'Corpo humano básico', 'Cuidados com a natureza'],
      dicas: [
        'Observe plantas e animais próximos e anote características.',
        'Assista vídeos curtos sobre o corpo humano.',
        'Monte um caderno de descobertas da natureza.',
      ],
    },
    fundamental2: {
      topicos: ['Célula e seus componentes', 'Sistemas do corpo humano', 'Ecologia e cadeias alimentares', 'Reino animal e vegetal'],
      dicas: [
        'Desenhe e rotule as estruturas da célula.',
        'Monte esquemas dos sistemas do corpo.',
        'Relacione ecologia com problemas ambientais reais.',
      ],
    },
    medio: {
      topicos: ['Genética e hereditariedade', 'Evolução', 'Fisiologia humana', 'Biomas brasileiros'],
      dicas: [
        'Genética cai bastante no ENEM — treine problemas de cruzamentos.',
        'Monte mapas mentais dos biomas brasileiros.',
        'Relacione fisiologia com situações do cotidiano.',
      ],
    },
    superior: {
      topicos: ['Biologia molecular', 'Fisiologia avançada', 'Biotecnologia'],
      dicas: [
        'Refaça esquemas de vias metabólicas até memorizar.',
        'Acompanhe artigos científicos recentes da área.',
        'Monte grupo de estudo para discutir mecanismos complexos.',
      ],
    },
  },

  ingles: {
    fundamental1: {
      topicos: ['Vocabulário básico (cores, números, família)', 'Verbo to be', 'Frases simples'],
      dicas: [
        'Assista desenhos em inglês com legenda em português.',
        'Cante músicas simples em inglês.',
        'Pratique 10 palavras novas por semana.',
      ],
    },
    fundamental2: {
      topicos: ['Present e past simple', 'Vocabulário do cotidiano', 'Leitura de textos curtos'],
      dicas: [
        'Assista séries com legenda em inglês.',
        'Anote palavras novas num caderno de vocabulário.',
        'Pratique conversação com apps de idiomas.',
      ],
    },
    medio: {
      topicos: ['Tempos verbais (presente, passado, futuro)', 'Reading comprehension', 'Phrasal verbs'],
      dicas: [
        'Leia textos curtos em inglês todos os dias.',
        'Treine interpretação de texto — é o foco do ENEM.',
        'Monte uma lista dos phrasal verbs mais cobrados.',
      ],
    },
    superior: {
      topicos: ['Inglês acadêmico e técnico', 'Leitura de artigos científicos', 'Vocabulário da sua área'],
      dicas: [
        'Leia papers da sua área semanalmente.',
        'Pratique redação acadêmica em inglês.',
        'Use flashcards para o vocabulário técnico.',
      ],
    },
  },

  filosofia: {
    medio: {
      topicos: ['Filosofia antiga (Sócrates, Platão, Aristóteles)', 'Ética e moral', 'Filosofia moderna e contemporânea'],
      dicas: [
        'Leia trechos originais, não só resumos.',
        'Debata os temas com colegas — filosofia se aprende discutindo.',
        'Relacione conceitos filosóficos com situações atuais.',
      ],
    },
  },

  sociologia: {
    medio: {
      topicos: ['Conceitos de sociedade e cultura', 'Movimentos sociais', 'Desigualdade social'],
      dicas: [
        'Relacione teorias sociológicas com notícias atuais.',
        'Compare diferentes pensadores sobre o mesmo tema.',
        'Use conceitos sociológicos como repertório de redação.',
      ],
    },
  },

  redacao: {
    medio: {
      topicos: ['Estrutura dissertativa-argumentativa', 'Repertório sociocultural', 'Proposta de intervenção'],
      dicas: [
        'Leia notícias diariamente para ter repertório atualizado.',
        'Treine uma redação por semana com tempo cronometrado.',
        'Peça correção de um professor ou use corretores online.',
      ],
    },
  },

  educacao_fisica: {
    medio: {
      topicos: ['Capacidades físicas (força, resistência, flexibilidade)', 'Regras dos esportes coletivos', 'Saúde e qualidade de vida'],
      dicas: [
        'Pratique atividade física regularmente, não só nas aulas.',
        'Aprenda as regras antes de jogar — evita erro em prova teórica.',
        'Anote como o corpo reage a diferentes tipos de exercício.',
      ],
    },
  },

  artes: {
    medio: {
      topicos: ['História da arte (principais movimentos)', 'Elementos visuais (cor, forma, textura)', 'Produção artística prática'],
      dicas: [
        'Visite exposições ou museus virtuais.',
        'Experimente técnicas diferentes fora da sala de aula.',
        'Relacione obras com o contexto histórico da época.',
      ],
    },
  },
};

// Genérico — usado quando a matéria não é reconhecida na base
const GENERIC_TIPS = {
  topicos: [],
  dicas: [
    'Divida o conteúdo em blocos pequenos e estude com a técnica Pomodoro.',
    'Refaça um resumo com suas próprias palavras logo após a aula.',
    'Revise o conteúdo em intervalos espaçados (1 dia, 3 dias, 1 semana).',
  ],
};

/**
 * Retorna dicas de estudo para uma matéria, adaptadas ao nível de
 * escolaridade informado. Se a matéria não for reconhecida, retorna
 * dicas gerais de estudo (generic: true). Se o nível não tiver
 * conteúdo específico, cai para o nível mais próximo disponível.
 */
export function getMateriaInsights(materiaName, schoolLevel) {
  const key = findSubjectKey(materiaName);
  if (!key) {
    return { subjectKey: null, generic: true, topicos: GENERIC_TIPS.topicos, dicas: GENERIC_TIPS.dicas, matchedLevel: null };
  }

  const bySubject = INSIGHTS[key];
  const fallbackOrder = [schoolLevel, 'medio', 'fundamental2', 'superior', 'fundamental1'];
  const matchedLevel = fallbackOrder.find(lvl => lvl && bySubject[lvl]);

  if (!matchedLevel) {
    return { subjectKey: key, generic: true, topicos: GENERIC_TIPS.topicos, dicas: GENERIC_TIPS.dicas, matchedLevel: null };
  }

  const content = bySubject[matchedLevel];
  return {
    subjectKey: key,
    generic: false,
    topicos: content.topicos,
    dicas: content.dicas,
    matchedLevel,
    matchedLevelLabel: LEVEL_LABEL[matchedLevel],
    levelMismatch: matchedLevel !== schoolLevel,
  };
}
