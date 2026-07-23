// ============================================================
//  ESTUDIX — Conteúdo de História (Ensino Médio)
//  Dado estático/somente-leitura — mesmo padrão de materiaInsights.js.
//  Disciplina "vitrine" da Fase 4 — representa a área de
//  Ciências Humanas no escopo inicial reduzido.
// ============================================================

export default {
  subjectKey: 'historia',
  modulos: [
    {
      id: 'brasil-republica',
      nome: 'Brasil República',
      ano: '3', // ano em que o assunto costuma ser trabalhado — usado por EXERCICIOS em quizzes.js
      assuntos: [
        {
          id: 'era-vargas',
          nome: 'Era Vargas',
          teoria: 'A Era Vargas (1930-1945) corresponde ao período em que Getúlio Vargas governou o Brasil, dividido em Governo Provisório, Governo Constitucional e Estado Novo (ditadura, 1937-1945). Marcou a industrialização do país e a criação da legislação trabalhista.',
          resumo: 'Principais marcos: Revolução de 1930 (fim da República Velha), Constituição de 1934, golpe do Estado Novo em 1937 e criação da CLT em 1943.',
          exemplos: [
            'A CLT (Consolidação das Leis do Trabalho), criada em 1943, ainda é a base da legislação trabalhista brasileira.',
            'O DIP (Departamento de Imprensa e Propaganda) controlava e censurava os meios de comunicação durante o Estado Novo.',
          ],
          curiosidades: [
            'Vargas ficou conhecido como "o pai dos pobres" por seus aliados e "o ditador" por seus opositores — sua imagem até hoje divide historiadores.',
          ],
          dicas: [
            'Organize os três períodos da Era Vargas em uma linha do tempo — ajuda muito a não confundir as datas.',
            'Relacione a criação da CLT com o contexto de industrialização e urbanização do país.',
          ],
          formulas: [],
        },
        {
          id: 'ditadura-militar',
          nome: 'Ditadura Militar Brasileira',
          teoria: 'Período de 1964 a 1985 em que o Brasil foi governado por presidentes militares após o golpe de 1964. Marcado pela censura, perseguição política e pelo AI-5 (1968), que suspendeu diversos direitos civis.',
          resumo: 'Fases: golpe (1964), "anos de chumbo" (auge da repressão, após 1968), abertura "lenta e gradual" (a partir de 1974) e redemocratização, com as Diretas Já (1984) e a eleição indireta de Tancredo Neves (1985).',
          exemplos: [
            'O AI-5 permitiu ao governo fechar o Congresso Nacional e cassar mandatos.',
            'O movimento Diretas Já (1984) mobilizou milhões de brasileiros pedindo eleições diretas para presidente.',
          ],
          curiosidades: [
            'Mesmo com a forte mobilização das Diretas Já, a emenda que restabeleceria as eleições diretas não foi aprovada no Congresso em 1984 — a eleição de 1985 ainda foi indireta.',
          ],
          dicas: [
            'Relacione esse período com o contexto da Guerra Fria — o golpe teve apoio direto dos Estados Unidos.',
            'Cai muito no ENEM: memorize a ordem dos presidentes militares e os principais atos institucionais.',
          ],
          formulas: [],
        },
      ],
    },
    {
      id: 'historia-mundial',
      nome: 'História Mundial',
      ano: '3',
      assuntos: [
        {
          id: 'guerra-fria',
          nome: 'Guerra Fria',
          teoria: 'Período de disputa política, econômica e ideológica entre Estados Unidos (capitalismo) e União Soviética (socialismo), de 1947 a 1991, sem confronto militar direto entre as duas potências.',
          resumo: 'Caracterizada pela corrida armamentista e espacial, formação de blocos militares (OTAN e Pacto de Varsóvia) e conflitos indiretos ("guerras por procuração") como Coreia, Vietnã e Cuba.',
          exemplos: [
            'A Crise dos Mísseis de Cuba (1962) quase levou a um confronto nuclear direto entre EUA e URSS.',
            'A Queda do Muro de Berlim, em 1989, é considerada um marco do fim da Guerra Fria.',
          ],
          curiosidades: [
            'O termo "Guerra Fria" foi popularizado pelo jornalista Walter Lippmann em 1947, mas o conflito nunca envolveu combate direto entre as duas superpotências.',
          ],
          dicas: [
            'Monte um mapa mental separando os países alinhados a cada bloco.',
            'Relacione a Guerra Fria com conflitos atuais de geopolítica — é um tema recorrente no ENEM.',
          ],
          formulas: [],
        },
        {
          id: 'globalizacao',
          nome: 'Globalização',
          teoria: 'Processo de integração econômica, cultural e tecnológica entre os países, intensificado a partir do fim da Guerra Fria e do avanço das telecomunicações e da internet.',
          resumo: 'Envolve a expansão do comércio internacional, das empresas multinacionais e dos fluxos financeiros, mas também gera debates sobre desigualdade entre países ricos e pobres.',
          exemplos: [
            'Uma empresa pode ter matriz nos EUA, fábricas na Ásia e vender produtos no mundo todo — típico da globalização produtiva.',
            'A disseminação de redes sociais conecta pessoas de diferentes países quase instantaneamente.',
          ],
          curiosidades: [
            'Apesar de parecer um fenômeno recente, alguns historiadores identificam ondas anteriores de globalização, como durante a expansão marítima europeia dos séculos XV e XVI.',
          ],
          dicas: [
            'Relacione globalização com desigualdade social — é um assunto clássico de redação do ENEM.',
            'Diferencie globalização econômica (comércio, empresas) de globalização cultural (hábitos, informação).',
          ],
          formulas: [],
        },
      ],
    },
  ],
};
