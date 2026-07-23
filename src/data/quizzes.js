// ============================================================
//  ESTUDIX — Exercícios por matéria (Melhoria 5)
//
//  Duas estruturas convivem aqui, de propósito:
//
//  QUIZZES[materia][nivel] — quiz "geral" por nível de escolaridade
//  (fundamental1/fundamental2/medio/superior). Escopo original:
//  apenas Matemática. Continua sendo o fallback para as 9
//  disciplinas da Formação Geral Básica que não têm conteúdo rico
//  nem exercício por assunto (ver src/data/curriculo).
//
//  EXERCICIOS[materia][ano][assuntoId] — exercícios por assunto,
//  só para as 3 disciplinas com conteúdo rico (CONTEUDO_POR_DISCIPLINA
//  em src/data/curriculo): Matemática, Português e História. O
//  `assuntoId` é sempre o mesmo id do assunto em src/data/curriculo/
//  *.js, e o `ano` é o ano em que o módulo daquele assunto costuma
//  ser trabalhado (módulo.ano), não necessariamente o ano do aluno.
//
//  Reaproveita findSubjectKey() de lib/subjects.js para reconhecer
//  o nome da matéria digitado pelo usuário.
// ============================================================

import { findSubjectKey } from '../lib/subjects';

const QUIZZES = {
  matematica: {
    fundamental1: [
      { question: 'Quanto é 7 + 8?', options: ['14', '15', '16', '13'], correctIndex: 1 },
      { question: 'Qual é a metade de 20?', options: ['8', '9', '10', '12'], correctIndex: 2 },
      { question: 'Quantos lados tem um triângulo?', options: ['2', '3', '4', '5'], correctIndex: 1 },
      { question: 'Você tem 3 pacotes com 4 balas cada. Quantas balas no total?', options: ['7', '10', '12', '14'], correctIndex: 2 },
      { question: 'Qual número vem depois do 99?', options: ['100', '101', '90', '9'], correctIndex: 0 },
    ],
    fundamental2: [
      { question: 'Quanto é 3/4 + 1/4?', options: ['1', '4/8', '2', '3/8'], correctIndex: 0 },
      { question: 'Resolva: x + 5 = 12. Qual o valor de x?', options: ['5', '6', '7', '8'], correctIndex: 2 },
      { question: 'Qual é a área de um retângulo de base 6 e altura 4?', options: ['10', '20', '24', '28'], correctIndex: 2 },
      { question: 'Quanto é 15% de 200?', options: ['15', '20', '30', '45'], correctIndex: 2 },
      { question: 'Qual é o resultado de 2³?', options: ['6', '8', '9', '4'], correctIndex: 1 },
    ],
    medio: [
      { question: 'Se f(x) = 2x + 3, qual é f(5)?', options: ['10', '13', '11', '8'], correctIndex: 1 },
      { question: 'Qual é o valor de sen(90°)?', options: ['0', '1', '-1', '0,5'], correctIndex: 1 },
      { question: 'Na PA (2, 5, 8, 11, ...), qual é o 6º termo?', options: ['14', '17', '20', '23'], correctIndex: 1 },
      { question: 'Qual é a raiz positiva da equação x² − 9 = 0?', options: ['3', '9', '-3', '4,5'], correctIndex: 0 },
      { question: 'No conjunto {2, 4, 4, 6, 8}, qual é a média?', options: ['4', '4,8', '5', '6'], correctIndex: 1 },
    ],
    superior: [
      { question: 'Qual é a derivada de f(x) = x²?', options: ['x', '2x', 'x²', '2'], correctIndex: 1 },
      { question: 'Qual é o resultado de ∫2x dx?', options: ['x² + C', '2x² + C', 'x + C', 'x³ + C'], correctIndex: 0 },
      { question: 'O determinante de uma matriz identidade 2×2 é:', options: ['0', '1', '2', '-1'], correctIndex: 1 },
      { question: 'Qual é o limite de 1/x quando x tende ao infinito?', options: ['0', '1', 'Infinito', 'Indefinido'], correctIndex: 0 },
      { question: 'Na equação diferencial dy/dx = y, a solução geral é:', options: ['y = Ce^x', 'y = x² + C', 'y = ln(x) + C', 'y = Cx'], correctIndex: 0 },
    ],
  },
};

/**
 * Retorna as 5 perguntas do quiz para a matéria + nível informados,
 * ou null se a matéria ainda não tiver quiz cadastrado.
 */
export function getQuiz(materiaName, schoolLevel) {
  const key = findSubjectKey(materiaName);
  if (!key || !QUIZZES[key]) return null;
  return QUIZZES[key][schoolLevel] || null;
}

// ── Exercícios por assunto (Melhoria 5) ──────────────────────
// assuntoId sempre igual ao id do assunto em src/data/curriculo/*.js.
//
// Cada pergunta tem um campo `origem` (não exibido na UI) apontando pra
// onde no conteúdo do assunto (CONTEUDO_POR_DISCIPLINA) ela nasceu —
// só teoria/resumo/exemplos/formulas contam como fonte válida, de
// propósito: curiosidades/dicas não são "conteúdo testável", são
// contexto extra. `trecho` é um substring literal do campo de origem,
// verificado pelo script de validação da rastreabilidade.
const EXERCICIOS = {
  matematica: {
    '1': {
      'funcao-1-grau': [
        { question: 'Na função f(x) = 2x + 3, qual é o valor de f(0)?', options: ['0', '2', '3', '5'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: 'f(x) = 2x + 3: para x = 0, f(0) = 3' } },
        { question: 'De acordo com a fórmula da raiz de uma função do 1º grau f(x) = ax + b, o valor de x é dado por:', options: ['x = a/b', 'x = -b/a', 'x = b/a', 'x = -a/b'], correctIndex: 1, origem: { tipo: 'formula', trecho: 'Raiz: x = -b / a' } },
        { question: 'No gráfico de uma função do 1º grau com a < 0, a função é:', options: ['Crescente', 'Decrescente', 'Constante', 'Quadrática'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'se a < 0, é decrescente' } },
        { question: 'Numa corrida de táxi, C(x) = 2x + 5 (x = km rodados). Quanto custa uma corrida de 10 km?', options: ['R$ 15', 'R$ 20', 'R$ 25', 'R$ 30'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: 'C(x) = 2x + 5' } },
        { question: "Em f(x) = ax + b, o coeficiente 'b' indica:", options: ['A inclinação da reta', 'Onde a reta cruza o eixo x', 'Onde a reta cruza o eixo y', 'O valor máximo da função'], correctIndex: 2, origem: { tipo: 'teoria', trecho: 'é o coeficiente linear (indica onde a reta cruza o eixo y)' } },
      ],
      'funcao-2-grau': [
        { question: 'Na função f(x) = x² − 5x + 6, quais são as raízes?', options: ['1 e 6', '2 e 3', '-2 e -3', '0 e 5'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'f(x) = x² − 5x + 6 tem raízes x = 2 e x = 3' } },
        { question: 'Segundo o conteúdo, qual fórmula é usada para encontrar as raízes de uma função do 2º grau?', options: ['Fórmula de Pitágoras', 'Fórmula de Bhaskara', 'Regra de três', 'Fórmula de Tales'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'As raízes são encontradas pela fórmula de Bhaskara' } },
        { question: 'Em f(x) = ax² + bx + c, se a > 0, a concavidade da parábola é:', options: ['Para cima', 'Para baixo', 'Não tem concavidade', 'Depende de c'], correctIndex: 0, origem: { tipo: 'teoria', trecho: 'concavidade para cima se a > 0' } },
        { question: 'Qual é a fórmula do discriminante (Δ) de uma função do 2º grau?', options: ['Δ = b² − 4ac', 'Δ = b² + 4ac', 'Δ = a² − 4bc', 'Δ = 2b − 4ac'], correctIndex: 0, origem: { tipo: 'formula', trecho: 'Δ = b² − 4ac' } },
        { question: 'A coordenada x do vértice da parábola é dada por:', options: ['xv = b/2a', 'xv = -b/2a', 'xv = -b/a', 'xv = c/a'], correctIndex: 1, origem: { tipo: 'formula', trecho: 'Vértice: xv = −b / 2a' } },
      ],
    },
    '2': {
      'medidas-tendencia-central': [
        { question: 'No conjunto {2, 4, 4, 6, 8}, qual é a moda?', options: ['2', '4', '6', '8'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'No conjunto {2, 4, 4, 6, 8}: média = 4,8; moda = 4; mediana = 4.' } },
        { question: 'Qual é a mediana do conjunto {6, 7, 8, 9, 10}?', options: ['6', '7', '8', '9'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: 'Notas de um aluno: 6, 7, 8, 9, 10 — a mediana é 8 (valor do meio).' } },
        { question: 'Qual é a média do conjunto {2, 4, 4, 6, 8}?', options: ['4', '4,8', '5', '6'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'No conjunto {2, 4, 4, 6, 8}: média = 4,8; moda = 4; mediana = 4.' } },
        { question: 'Segundo o conteúdo, o que é a moda de um conjunto de dados?', options: ['O valor central quando os dados estão ordenados', 'A soma dos valores dividida pela quantidade', 'O valor que mais se repete', 'A diferença entre o maior e o menor valor'], correctIndex: 2, origem: { tipo: 'resumo', trecho: 'Moda é o valor que mais se repete.' } },
        { question: 'Segundo o conteúdo, a mediana é o valor central de um conjunto de dados quando eles estão:', options: ['Somados', 'Ordenados', 'Multiplicados', 'Repetidos'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'Mediana é o valor central quando os dados estão ordenados.' } },
      ],
      'probabilidade-basica': [
        { question: 'Qual é a probabilidade de tirar um número par em um dado de 6 faces?', options: ['1/6', '1/3', '1/2', '2/3'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: 'Probabilidade de tirar um número par em um dado de 6 faces: 3/6 = 0,5 = 50%.' } },
        { question: 'Qual é a probabilidade de tirar uma carta de copas em um baralho de 52 cartas?', options: ['1/13', '1/4', '1/2', '1/52'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'Probabilidade de tirar uma carta de copas em um baralho de 52 cartas: 13/52 = 1/4.' } },
        { question: 'A probabilidade de um evento impossível é:', options: ['0', '0,5', '1', 'Depende do evento'], correctIndex: 0, origem: { tipo: 'teoria', trecho: 'entre 0 (impossível) e 1 (certeza)' } },
        { question: 'A probabilidade de um evento certo é:', options: ['0', '0,5', '1', 'Infinito'], correctIndex: 2, origem: { tipo: 'teoria', trecho: 'entre 0 (impossível) e 1 (certeza)' } },
        { question: 'P(evento) é calculada por:', options: ['Casos possíveis / casos favoráveis', 'Casos favoráveis / casos possíveis', 'Casos favoráveis × casos possíveis', 'Casos possíveis − casos favoráveis'], correctIndex: 1, origem: { tipo: 'formula', trecho: 'P(evento) = casos favoráveis / casos possíveis' } },
      ],
    },
  },
  portugues: {
    '1': {
      'redacao-dissertativa': [
        { question: 'Qual é a estrutura clássica da redação dissertativa-argumentativa?', options: ['Introdução, desenvolvimento e conclusão', 'Só desenvolvimento', 'Título, resumo e bibliografia', 'Pergunta e resposta'], correctIndex: 0, origem: { tipo: 'resumo', trecho: 'Estrutura clássica: introdução' } },
        { question: 'Segundo o conteúdo, a proposta de intervenção de uma redação dissertativa-argumentativa deve respeitar:', options: ['Apenas a gramática', 'Os direitos humanos', 'Somente a opinião do autor', 'As normas da ABNT'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'proposta de intervenção que respeite os direitos humanos' } },
        { question: 'Segundo o conteúdo, o que uma proposta de intervenção completa deve citar?', options: ['Apenas uma citação em latim', 'O quê, quem faz, como, e qual o efeito esperado', 'Só o nome do autor do texto', 'Apenas dados estatísticos'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'Proposta de intervenção completa cita: o quê, quem faz, como, e qual o efeito esperado.' } },
        { question: 'Onde geralmente fica a tese de uma redação dissertativa-argumentativa?', options: ['Na conclusão', 'No título', 'Na introdução', 'Não é necessário apresentar a tese'], correctIndex: 2, origem: { tipo: 'resumo', trecho: 'introdução (contextualização + tese)' } },
        { question: 'Segundo o conteúdo, além de apresentar uma tese, a redação dissertativa-argumentativa deve:', options: ['Apenas repetir o tema por extenso', 'Defender a tese com argumentos e dados', 'Ser escrita em versos', 'Evitar qualquer opinião'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'defende-o com argumentos e dados' } },
      ],
      'regencia-crase': [
        { question: 'Em qual frase há crase?', options: ['Vou a escola', 'Vou à escola', 'Vou ao escola', 'Vou a escolas em geral'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: '"Vou à escola" (crase) vs. "Vou ao colégio" (o masculino confirma a crase).' } },
        { question: 'Qual é a regra prática para identificar a crase?', options: ['Substituir a palavra feminina por uma masculina — se aparecer "ao", há crase', 'Contar as sílabas da palavra', 'Verificar se a frase é longa', 'Trocar o verbo da frase'], correctIndex: 0, origem: { tipo: 'resumo', trecho: 'Regra prática: troque a palavra feminina por uma masculina equivalente — se aparecer "ao", há crase.' } },
        { question: "Crase é a fusão da preposição 'a' com:", options: ['Um verbo', 'O artigo feminino "a" ou "as"', 'Um substantivo masculino', 'Uma conjunção'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'Crase é a fusão da preposição "a" com o artigo feminino "a" ou "as"' } },
        { question: "'Assistir ao filme' está correto porque o verbo 'assistir' (no sentido de ver) exige:", options: ['Nenhuma preposição', 'A preposição "de"', 'A preposição "a"', 'A preposição "com"'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: '"Assistir ao filme" (a regência do verbo assistir, no sentido de "ver", pede a preposição "a").' } },
        { question: 'Regência verbal estuda:', options: ['A concordância entre sujeito e verbo', 'A relação entre um verbo e seus complementos', 'A conjugação dos verbos irregulares', 'O tempo verbal usado no texto'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'Regência verbal e nominal trata da relação entre um verbo (ou nome) e seus complementos' } },
      ],
    },
    '3': {
      modernismo: [
        { question: 'Em que ano ocorreu a Semana de Arte Moderna, marco do Modernismo brasileiro?', options: ['1918', '1922', '1930', '1945'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'iniciado oficialmente com a Semana de Arte Moderna de 1922' } },
        { question: 'Em quantas fases costuma ser dividido o Modernismo brasileiro?', options: ['Duas', 'Três', 'Quatro', 'Cinco'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'Costuma ser dividido em três fases' } },
        { question: "Qual autor escreveu 'Macunaíma', misturando linguagem coloquial e folclore brasileiro?", options: ['Machado de Assis', 'Manuel Bandeira', 'Mário de Andrade', 'Aluísio Azevedo'], correctIndex: 2, origem: { tipo: 'exemplo', trecho: 'Mário de Andrade, em "Macunaíma", mistura linguagem coloquial e elementos do folclore brasileiro.' } },
        { question: 'O Modernismo brasileiro valorizou, entre outras coisas:', options: ['A linguagem rebuscada e formal', 'A linguagem coloquial e a experimentação formal', 'Apenas temas europeus', 'A métrica clássica obrigatória'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'valorizando a linguagem coloquial, o nacionalismo crítico e a experimentação formal' } },
        { question: 'A 3ª geração do Modernismo também é conhecida como:', options: ['Barroco', 'Realismo', 'Pós-Modernismo', 'Arcadismo'], correctIndex: 2, origem: { tipo: 'resumo', trecho: '3ª geração (Pós-Modernismo, a partir de 1945)' } },
      ],
      'realismo-naturalismo': [
        { question: 'Qual obra é considerada símbolo do Realismo brasileiro?', options: ['Macunaíma', 'Dom Casmurro', 'O Cortiço', 'Vidas Secas'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: '"Dom Casmurro", de Machado de Assis, é a obra-símbolo do Realismo brasileiro.' } },
        { question: 'O Naturalismo se diferencia do Realismo principalmente por:', options: ['Usar linguagem mais poética', 'Radicalizar o determinismo biológico e social dos personagens', 'Focar só em temas religiosos', 'Ser anterior ao Romantismo'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'Naturalismo: determinismo biológico e social' } },
        { question: "Quem escreveu 'O Cortiço', obra-símbolo do Naturalismo brasileiro?", options: ['Machado de Assis', 'Aluísio Azevedo', 'Mário de Andrade', 'Manuel Bandeira'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: '"O Cortiço", de Aluísio Azevedo, retrata o cortiço como um organismo' } },
        { question: 'Segundo o conteúdo, qual autor é associado à análise psicológica e à crítica social do Realismo?', options: ['Aluísio Azevedo', 'Machado de Assis', 'Mário de Andrade', 'Manuel Bandeira'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'Realismo: análise psicológica e crítica social (Machado de Assis).' } },
        { question: 'Um tema recorrente do Realismo é:', options: ['O idealismo romântico', 'A crítica social e a hipocrisia burguesa', 'A vida no campo medieval', 'A ficção científica'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'temas como adultério e hipocrisia burguesa' } },
      ],
    },
  },
  historia: {
    '3': {
      'era-vargas': [
        { question: 'Quais são os três períodos em que costuma ser dividida a Era Vargas?', options: ['Colônia, Império e República', 'Governo Provisório, Constitucional e Estado Novo', '1ª e 2ª Guerra Mundial', 'Primeira e Segunda República'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'dividido em Governo Provisório, Governo Constitucional e Estado Novo' } },
        { question: 'A CLT, criada em 1943 durante a Era Vargas, tratava de:', options: ['Direitos trabalhistas', 'Reforma agrária', 'Sistema eleitoral', 'Política externa'], correctIndex: 0, origem: { tipo: 'exemplo', trecho: 'A CLT (Consolidação das Leis do Trabalho), criada em 1943' } },
        { question: 'O Estado Novo (1937-1945) foi um período de:', options: ['Democracia plena', 'Ditadura, com censura e forte controle do Estado', 'Ocupação estrangeira', 'Guerra civil'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'Estado Novo (ditadura, 1937-1945)' } },
        { question: 'Qual órgão controlava e censurava a imprensa durante o Estado Novo?', options: ['CLT', 'DIP', 'AI-5', 'OTAN'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'O DIP (Departamento de Imprensa e Propaganda) controlava e censurava os meios de comunicação durante o Estado Novo.' } },
        { question: 'A Revolução de 1930 marcou o fim de qual período da história brasileira?', options: ['Brasil Colônia', 'Primeiro Reinado', 'República Velha', 'Ditadura Militar'], correctIndex: 2, origem: { tipo: 'resumo', trecho: 'Revolução de 1930 (fim da República Velha)' } },
      ],
      'ditadura-militar': [
        { question: 'Em que período o Brasil foi governado pela ditadura militar?', options: ['1930-1945', '1945-1960', '1964-1985', '1985-2000'], correctIndex: 2, origem: { tipo: 'teoria', trecho: 'Período de 1964 a 1985' } },
        { question: 'O que o AI-5 (1968) permitiu ao governo militar?', options: ['Ampliar direitos civis', 'Fechar o Congresso Nacional e cassar mandatos', 'Realizar eleições diretas', 'Reduzir a censura'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'O AI-5 permitiu ao governo fechar o Congresso Nacional e cassar mandatos.' } },
        { question: 'O movimento Diretas Já (1984) pedia:', options: ['O fim da escravidão', 'Eleições diretas para presidente', 'A independência do Brasil', 'A criação da CLT'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'O movimento Diretas Já (1984) mobilizou milhões de brasileiros pedindo eleições diretas para presidente.' } },
        { question: 'Mesmo com a forte mobilização das Diretas Já, a eleição de 1985 foi:', options: ['Direta', 'Indireta', 'Cancelada', 'Vencida pelos militares'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'a eleição indireta de Tancredo Neves (1985)' } },
        { question: "Segundo o conteúdo, o que caracteriza a fase chamada de 'anos de chumbo' na ditadura militar?", options: ['O início da redemocratização', 'O auge da repressão, após 1968', 'A eleição direta para presidente', 'O fim da censura'], correctIndex: 1, origem: { tipo: 'resumo', trecho: '"anos de chumbo" (auge da repressão, após 1968)' } },
      ],
      'guerra-fria': [
        { question: 'A Guerra Fria foi uma disputa entre:', options: ['Alemanha e França', 'Estados Unidos e União Soviética', 'Brasil e Argentina', 'China e Japão'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'entre Estados Unidos (capitalismo) e União Soviética (socialismo)' } },
        { question: 'A Guerra Fria é caracterizada, entre outras coisas, por:', options: ['Confronto militar direto entre EUA e URSS', 'Corrida armamentista e espacial, sem confronto direto', 'Ausência total de conflitos no período', 'União entre capitalismo e socialismo'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'corrida armamentista e espacial' } },
        { question: 'Qual evento quase levou a um confronto nuclear direto entre EUA e URSS em 1962?', options: ['A Queda do Muro de Berlim', 'A Crise dos Mísseis de Cuba', 'A Guerra do Vietnã', 'A Guerra da Coreia'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'A Crise dos Mísseis de Cuba (1962) quase levou a um confronto nuclear direto entre EUA e URSS.' } },
        { question: 'A Queda do Muro de Berlim, em 1989, é considerada um marco:', options: ['Do início da Guerra Fria', 'Do fim da Guerra Fria', 'Da Segunda Guerra Mundial', 'Da Revolução Industrial'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'A Queda do Muro de Berlim, em 1989, é considerada um marco do fim da Guerra Fria.' } },
        { question: 'Os blocos militares formados durante a Guerra Fria foram:', options: ['ONU e OMS', 'OTAN e Pacto de Varsóvia', 'Mercosul e União Europeia', 'BRICS e G7'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'formação de blocos militares (OTAN e Pacto de Varsóvia)' } },
      ],
      globalizacao: [
        { question: 'A globalização se intensificou principalmente a partir de:', options: ['Da Idade Média', 'Do fim da Guerra Fria e do avanço das telecomunicações', 'Da Revolução Francesa', 'Da Primeira Guerra Mundial'], correctIndex: 1, origem: { tipo: 'teoria', trecho: 'intensificado a partir do fim da Guerra Fria e do avanço das telecomunicações' } },
        { question: 'A globalização envolve, entre outras coisas:', options: ['O isolamento total dos países', 'A expansão do comércio internacional e das multinacionais', 'O fim do comércio entre países', 'A extinção da internet'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'a expansão do comércio internacional, das empresas multinacionais' } },
        { question: 'Um dos debates gerados pela globalização é:', options: ['A falta de tecnologia', 'A desigualdade entre países ricos e pobres', 'O excesso de isolamento cultural', 'A ausência de empresas multinacionais'], correctIndex: 1, origem: { tipo: 'resumo', trecho: 'desigualdade entre países ricos e pobres' } },
        { question: 'Qual das situações abaixo é um exemplo de globalização produtiva, segundo o conteúdo?', options: ['Uma empresa com matriz nos EUA, fábricas na Ásia e vendas no mundo todo', 'Um pequeno comércio local que só vende na própria cidade', 'Uma fazenda que produz apenas para consumo próprio', 'Uma escola que só ensina história local'], correctIndex: 0, origem: { tipo: 'exemplo', trecho: 'Uma empresa pode ter matriz nos EUA, fábricas na Ásia e vender produtos no mundo todo — típico da globalização produtiva.' } },
        { question: 'Segundo o conteúdo, a disseminação de redes sociais é um exemplo de quê?', options: ['Isolamento cultural entre países', 'Conexão quase instantânea entre pessoas de diferentes países', 'Redução do comércio internacional', 'Fim da tecnologia'], correctIndex: 1, origem: { tipo: 'exemplo', trecho: 'A disseminação de redes sociais conecta pessoas de diferentes países quase instantaneamente.' } },
      ],
    },
  },
};

/**
 * Retorna os exercícios de um assunto específico (Melhoria 5), para as
 * disciplinas com conteúdo rico. `ano` aqui é o ano do módulo do
 * assunto (ver curriculo/*.js → modulo.ano), não necessariamente o
 * ano do aluno. Retorna null se não houver exercícios cadastrados.
 */
export function getExerciciosAssunto(materiaName, ano, assuntoId) {
  const key = findSubjectKey(materiaName);
  if (!key) return null;
  return EXERCICIOS[key]?.[ano]?.[assuntoId] || null;
}
