// ============================================================
//  ESTUDIX — Conteúdo de Matemática (Ensino Médio)
//  Dado estático/somente-leitura — mesmo padrão de materiaInsights.js.
//  Disciplina "vitrine" da Fase 4 (ver Fase 4 do plano: escopo
//  inicial restrito a Matemática, Português e uma de Humanas).
// ============================================================

export default {
  subjectKey: 'matematica',
  modulos: [
    {
      id: 'funcoes',
      nome: 'Funções',
      ano: '1', // ano em que o assunto costuma ser trabalhado — usado por EXERCICIOS em quizzes.js
      assuntos: [
        {
          id: 'funcao-1-grau',
          nome: 'Função do 1º Grau',
          teoria: 'A função do 1º grau, também chamada de função afim, é toda função que pode ser escrita na forma f(x) = ax + b, com a e b números reais e a ≠ 0. O coeficiente "a" é o coeficiente angular (indica a inclinação da reta) e "b" é o coeficiente linear (indica onde a reta cruza o eixo y).',
          resumo: 'O gráfico é sempre uma reta. Se a > 0, a função é crescente; se a < 0, é decrescente. A raiz (zero da função) é o valor de x para o qual f(x) = 0.',
          exemplos: [
            'f(x) = 2x + 3: para x = 0, f(0) = 3 (a reta cruza o eixo y em 3).',
            'Uma corrida de táxi custa R$ 5,00 de bandeirada mais R$ 2,00 por km rodado: C(x) = 2x + 5.',
          ],
          curiosidades: [
            'O termo "afim" vem do latim "affinis", que significa "próximo" — a função afim está intimamente ligada à ideia de proporcionalidade.',
          ],
          dicas: [
            'Para encontrar a raiz, basta igualar f(x) a zero e isolar x.',
            'Desenhe o gráfico sempre que possível — visualizar ajuda a entender crescimento/decrescimento.',
          ],
          formulas: ['f(x) = ax + b', 'Raiz: x = -b / a'],
        },
        {
          id: 'funcao-2-grau',
          nome: 'Função do 2º Grau',
          teoria: 'A função do 2º grau (ou quadrática) tem a forma f(x) = ax² + bx + c, com a ≠ 0. Seu gráfico é uma parábola, com concavidade para cima se a > 0 e para baixo se a < 0.',
          resumo: 'O vértice da parábola indica o ponto de máximo (a < 0) ou mínimo (a > 0) da função. As raízes são encontradas pela fórmula de Bhaskara e podem ser 0, 1 ou 2 valores reais, dependendo do discriminante Δ.',
          exemplos: [
            'f(x) = x² − 5x + 6 tem raízes x = 2 e x = 3.',
            'A trajetória de uma bola chutada para cima pode ser modelada por uma função do 2º grau.',
          ],
          curiosidades: [
            'A fórmula de Bhaskara é atribuída ao matemático indiano Bhaskara Akaria, mas métodos equivalentes já eram usados pelos babilônios quase 2000 anos antes.',
          ],
          dicas: [
            'Calcule sempre o discriminante (Δ) antes de tentar encontrar as raízes — ele já indica quantas soluções reais existem.',
            'Memorize a fórmula das coordenadas do vértice, ela cai bastante em questões de otimização.',
          ],
          formulas: ['f(x) = ax² + bx + c', 'Δ = b² − 4ac', 'x = (−b ± √Δ) / 2a', 'Vértice: xv = −b / 2a'],
        },
      ],
    },
    {
      id: 'estatistica-probabilidade',
      nome: 'Estatística e Probabilidade',
      ano: '2',
      assuntos: [
        {
          id: 'medidas-tendencia-central',
          nome: 'Medidas de Tendência Central',
          teoria: 'Média, moda e mediana são as três principais medidas de tendência central, usadas para resumir um conjunto de dados com um único valor representativo.',
          resumo: 'Média é a soma dos valores dividida pela quantidade. Moda é o valor que mais se repete. Mediana é o valor central quando os dados estão ordenados.',
          exemplos: [
            'No conjunto {2, 4, 4, 6, 8}: média = 4,8; moda = 4; mediana = 4.',
            'Notas de um aluno: 6, 7, 8, 9, 10 — a mediana é 8 (valor do meio).',
          ],
          curiosidades: [
            'A média é bastante sensível a valores extremos ("outliers"); por isso, em dados de renda, a mediana costuma ser mais representativa que a média.',
          ],
          dicas: [
            'Sempre ordene os dados antes de calcular a mediana.',
            'Se houver dois valores centrais (quantidade par de dados), a mediana é a média entre eles.',
          ],
          formulas: ['Média = Σx / n'],
        },
        {
          id: 'probabilidade-basica',
          nome: 'Probabilidade Básica',
          teoria: 'Probabilidade mede a chance de um evento acontecer, sempre em um valor entre 0 (impossível) e 1 (certeza), calculada pela razão entre casos favoráveis e casos possíveis.',
          resumo: 'P(evento) = número de casos favoráveis / número de casos possíveis. Pode ser expressa como fração, decimal ou porcentagem.',
          exemplos: [
            'Probabilidade de tirar um número par em um dado de 6 faces: 3/6 = 0,5 = 50%.',
            'Probabilidade de tirar uma carta de copas em um baralho de 52 cartas: 13/52 = 1/4.',
          ],
          curiosidades: [
            'A teoria da probabilidade nasceu no século XVII a partir de correspondências entre os matemáticos Pascal e Fermat sobre jogos de azar.',
          ],
          dicas: [
            'Sempre confira se os eventos são independentes antes de multiplicar probabilidades.',
            'Transformar a probabilidade em porcentagem ajuda a interpretar o resultado de forma mais intuitiva.',
          ],
          formulas: ['P(evento) = casos favoráveis / casos possíveis'],
        },
      ],
    },
  ],
};
