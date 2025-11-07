// Base de conhecimento do Edital Verticalizado - Policial Legislativo Federal
// Câmara dos Deputados

export interface DisciplinaEdital {
  nome: string;
  topicos: string[];
  agenteResponsavel: string;
  descricao: string;
}

export interface ConhecimentoEdital {
  concurso: string;
  instituicao: string;
  cargo: string;
  status: string;
  disciplinas: DisciplinaEdital[];
}

export const conhecimentoEdital: ConhecimentoEdital = {
  concurso: "Policial Legislativo Federal",
  instituicao: "Câmara dos Deputados",
  cargo: "Policial Legislativo Federal",
  status: "Concurso Autorizado",
  disciplinas: [
    {
      nome: "Língua Portuguesa",
      agenteResponsavel: "portugues",
      descricao: "Compreensão textual, gramática e redação oficial",
      topicos: [
        "Compreensão e interpretação de textos",
        "Tipologia textual",
        "Ortografia oficial",
        "Acentuação gráfica",
        "Emprego das classes de palavras",
        "Emprego/correlação de tempos e modos verbais",
        "Emprego do sinal indicativo de crase",
        "Sintaxe da oração e do período",
        "Pontuação",
        "Concordância nominal e verbal",
        "Regência nominal e verbal",
        "Significação das palavras",
        "Redação de Correspondências oficiais (Manual de Redação da Presidência da República)",
        "Adequação da linguagem ao tipo de documento",
        "Adequação do formato do texto ao gênero",
        "Domínio dos mecanismos de coesão textual",
        "Colocação dos pronomes átonos"
      ]
    },
    {
      nome: "Raciocínio Lógico-Matemático",
      agenteResponsavel: "raciocinio",
      descricao: "Lógica, matemática e resolução de problemas",
      topicos: [
        "Estruturas lógicas",
        "Lógica de argumentação: analogias, inferências, deduções e conclusões",
        "Lógica sentencial ou proposicional",
        "Proposições simples e compostas",
        "Tabelas-Verdade",
        "Equivalências",
        "Leis de Morgan",
        "Diagramas lógicos",
        "Lógica de primeira ordem",
        "Princípios de contagem e probabilidade",
        "Operações com conjuntos",
        "Raciocínio lógico envolvendo problemas aritméticos, geométricos e matriciais"
      ]
    },
    {
      nome: "Direito Constitucional",
      agenteResponsavel: "constitucional",
      descricao: "Constituição Federal e organização do Estado",
      topicos: [
        "Constituição de 1988: conceito, contexto histórico, características, estrutura do texto",
        "Princípios Fundamentais. Direitos e Garantias Fundamentais",
        "Direitos e Deveres Individuais e Coletivos",
        "Direitos Sociais, Nacionalidade, Direitos Políticos e Partidos Políticos",
        "Organização do Estado: Organização Político-Administrativa",
        "União, Estados, Municípios, Distrito Federal e Territórios",
        "Intervenção Federal",
        "Administração Pública: Disposições Gerais, Servidores Públicos Civis e Militares",
        "Poder Legislativo. O Congresso Nacional e suas Casas",
        "Atribuições, competências, reuniões e comissões",
        "Regime Jurídico-constitucional dos Parlamentares",
        "Processo Legislativo",
        "Fiscalização Contábil, Financeira e Orçamentária",
        "Poder Executivo: atribuições e responsabilidades do Presidente da República",
        "Atribuições dos Ministros de Estado",
        "Poder Judiciário: órgãos, composição, garantias e competências",
        "Funções Essenciais à Justiça",
        "Defesa do Estado e das Instituições Democráticas"
      ]
    },
    {
      nome: "Direito Administrativo",
      agenteResponsavel: "da",
      descricao: "Princípios, poderes, atos e processo administrativo para Policial Legislativo Federal",
      topicos: [
        "Conceitos e princípios. Estado. Governo. Administração Pública. Reformas administrativas",
        "Organização da Administração. Entidades paraestatais e o Terceiro Setor. A Administração na Constituição de 1988",
        "Poderes e Deveres Administrativos: poder discricionário, poder regulamentar, poder hierárquico e disciplinar, poder de polícia. Uso e abuso de poder",
        "Atos Administrativos: conceito, requisitos, atributos",
        "Classificação, espécies, extinção, nulidades e revogação dos atos administrativos",
        "Agentes Públicos: disposições constitucionais, regime jurídico, Lei nº 8.112/1990, cargo público, provimento, investidura, estabilidade, acumulação, regime disciplinar e seguridade social",
        "Processo Administrativo Federal. Lei nº 9.784/1999",
        "Licitações e contratos administrativos: Lei nº 14.133/2021, conceito, princípios, contratação direta, modalidades, tipos e aspectos procedimentais",
        "Controle Interno e Externo da Administração",
        "Responsabilidade Civil do Estado",
        "Improbidade Administrativa",
        "Lei de Acesso à Informação (Lei nº 12.527/2011)",
        "Lei Geral de Proteção de Dados (Lei nº 13.709/2018)",
        "Regime jurídico-administrativo na Lei de Introdução às Normas do Direito Brasileiro (Lei nº 4.657/1942) e suas alterações"
      ]
    },
    {
      nome: "Direito Penal",
      agenteResponsavel: "penal",
      descricao: "Direito Penal e teoria do crime",
      topicos: [
        "Princípios penais. Disposições constitucionais aplicáveis",
        "Lei penal: fontes, classificação, interpretação e aplicação no tempo e no espaço",
        "Imunidades substanciais e formais",
        "Teoria geral do crime: conceitos, classificação, conduta, resultado, nexo de causalidade",
        "Tipo e tipicidade, dolo e culpa, crime preterdoloso, antijuridicidade, culpabilidade",
        "Erro de tipo e erro de proibição, consumação e tentativa",
        "Concurso de pessoas e concurso de crimes",
        "Crimes contra a pessoa",
        "Crimes contra o patrimônio",
        "Crimes contra a Administração Pública"
      ]
    },
    {
      nome: "Direito Processual Penal",
      agenteResponsavel: "processual-penal",
      descricao: "Processo penal e investigação criminal",
      topicos: [
        "Princípios e Garantias Processuais. Sistemas Processuais",
        "Aplicação da lei processual penal no tempo, no espaço e sua interpretação",
        "Investigação criminal",
        "Ação penal",
        "Jurisdição e Competência",
        "Comunicação dos atos processuais",
        "Prova"
      ]
    },
    {
      nome: "Legislação Penal e Processual Penal Especial",
      agenteResponsavel: "penal-especial",
      descricao: "Leis penais especiais e crimes específicos",
      topicos: [
        "Lei nº 9.296/1996 (Interceptação Telefônica)",
        "Lei nº 12.850/2013 (Organizações criminosas)",
        "Prisão; medidas cautelares; liberdade provisória. Lei nº 7.960/1989 (Prisão Temporária)",
        "Lei nº 7.716/1989 (Crimes de Racismo)",
        "Lei nº 8.069/1990 (Estatuto da Criança e do Adolescente)",
        "Lei nº 8.072/1990 (Crimes Hediondos)",
        "Lei nº 9.099/1995 (Juizados Especiais Criminais)",
        "Lei nº 10.259/2001 (Juizados Especiais Criminais Federais)",
        "Lei nº 9.455/1997 (Lei dos crimes de tortura)",
        "Lei nº 10.741/2003 (Estatuto do Idoso)",
        "Lei nº 10.826/2003 (Estatuto do desarmamento)",
        "Lei nº 11.340/2006 (Lei Maria da Penha)",
        "Lei nº 11.343/2006 (Lei de drogas)",
        "Lei nº 13.869/2019 (Lei dos crimes de abuso de autoridade)"
      ]
    },
    {
      nome: "Direitos Humanos",
      agenteResponsavel: "direitos-humanos",
      descricao: "Direitos humanos e proteção internacional",
      topicos: [
        "Conceito. Evolução. Abrangência. Sistema de Proteção",
        "Declaração Universal dos Direitos Humanos de 1948",
        "Convenção Americana sobre Direitos Humanos (Pacto de São José e Decreto nº 678/1992)"
      ]
    },
    {
      nome: "Informática",
      agenteResponsavel: "informatica",
      descricao: "Tecnologia da informação e segurança digital",
      topicos: [
        "Hardware e Software",
        "Redes de computadores",
        "Internet e Intranet",
        "Internet das coisas",
        "Sistema Operacional Microsoft Windows (versões 8.1 e 10 e 11)",
        "Sistema Operacional Mobile: IOS e Android",
        "Navegadores web",
        "Cliente de correio eletrônico (e-mail)",
        "Edição de textos, planilhas e apresentações",
        "Ferramentas de mídias sociais",
        "Sistemas de gestão de documentos eletrônicos",
        "Backup e recuperação de dados",
        "Tratamento de incidentes e problemas",
        "Vírus de computador e outros malwares",
        "Ataques e proteções",
        "Segurança de Redes",
        "Monitoramento de tráfego",
        "Sniffer de rede",
        "Interpretação de pacotes",
        "Detecção e prevenção de ataques (IDS e IPS)",
        "Arquiteturas de firewalls",
        "Ataques e ameaças da Internet",
        "Criptografia",
        "Certificação e assinatura digital",
        "Protocolos criptográficos"
      ]
    },
    {
      nome: "Direito Digital",
      agenteResponsavel: "direito-digital",
      descricao: "Direito digital e proteção de dados",
      topicos: [
        "Proteção de dados e direito de privacidade de informação",
        "Responsabilidade de provedores de internet",
        "Quebra do sigilo telemático",
        "Redes sociais, direitos de personalidade e notícias falsas",
        "Lei nº 9.609/1998 (Propriedade intelectual de programa de computador)",
        "Lei nº 12.737/2012 (Lei dos crimes cibernéticos)",
        "Lei nº 12.965/2014 (Marco Civil da Internet)",
        "Lei nº 13.188/2015 (Direito de resposta)",
        "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais)"
      ]
    },
    {
      nome: "Língua Estrangeira (Inglês)",
      agenteResponsavel: "ingles",
      descricao: "Compreensão e interpretação em inglês",
      topicos: [
        "Conhecimento e uso das formas contemporâneas da linguagem inglesa",
        "Compreensão e interpretação de textos variados",
        "Itens gramaticais relevantes para a compreensão dos conteúdos semânticos",
        "Palavras e expressões equivalentes",
        "Elementos de referência"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Inteligência",
      agenteResponsavel: "inteligencia",
      descricao: "Doutrina e estratégia de inteligência",
      topicos: [
        "Doutrina da Atividade de Inteligência",
        "Política Nacional de Inteligência",
        "Estratégia Nacional de Inteligência",
        "Sistema Brasileiro de Inteligência",
        "Política Nacional de Inteligência de Segurança Pública",
        "Estratégia Nacional de Inteligência de Segurança Pública",
        "Subsistema de Inteligência de Segurança Pública",
        "Doutrina Nacional de Inteligência de Segurança Pública",
        "Produção de Conhecimento; Operações de Inteligência",
        "Inteligência: Contrainteligência",
        "Controle da atividade de Inteligência no Brasil"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Segurança de Dignitários",
      agenteResponsavel: "seguranca-dignitarios",
      descricao: "Segurança de autoridades e dignitários",
      topicos: [
        "Segurança de Dignitários: Conceitos; Princípios; Vulnerabilidades",
        "Atentados e ameaças; Explosivos; Varreduras",
        "Organização da cápsula de segurança",
        "Segurança familiar e residencial",
        "Noções de primeiros socorros no trânsito",
        "Direção Defensiva",
        "Direção Ofensiva",
        "Trânsito: Normas de circulação e conduta"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Segurança Orgânica",
      agenteResponsavel: "seguranca-organica",
      descricao: "Segurança institucional e orgânica",
      topicos: [
        "Segurança Orgânica: Doutrina; Conceitos; Princípios",
        "Segurança das áreas e instalações",
        "Segurança Ativa: Doutrina; Conceitos; Princípios",
        "Uso da Força: Regulação geral do uso da força no Brasil",
        "Plano de Segurança Orgânica",
        "Prevenção e combate a incêndio",
        "Classes de incêndio; Métodos de extinção do fogo",
        "Noções de primeiros socorros"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Noções de Relações Humanas",
      agenteResponsavel: "relacoes-humanas",
      descricao: "Relações humanas e trabalho em equipe",
      topicos: [
        "Qualidade no atendimento ao público",
        "Trabalho em equipe"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Defesa Pessoal",
      agenteResponsavel: "defesa-pessoal",
      descricao: "Técnicas de defesa pessoal",
      topicos: [
        "Fundamentos",
        "Técnicas",
        "Legislação aplicada"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Armamento e Tiro",
      agenteResponsavel: "armamento-tiro",
      descricao: "Armamento e técnicas de tiro",
      topicos: [
        "Armamento",
        "Regras de Segurança com Armas",
        "Técnicas de tiro"
      ]
    },
    {
      nome: "Conhecimentos Específicos - Técnicas de Negociação e Gerenciamento de Crises",
      agenteResponsavel: "negociacao-crises",
      descricao: "Negociação e gerenciamento de crises",
      topicos: [
        "Negociação, etapas da negociação, postura e critérios de ação",
        "Habilidades avançadas de negociação",
        "Negociação e tomada de decisão: conceitos e tipologia",
        "Elementos operacionais e essenciais",
        "Critérios de ação",
        "Classificação dos graus de risco: tipologia dos causadores",
        "Perímetros táticos",
        "Organização do posto de comando",
        "Táticas de negociação",
        "Uso progressivo da força"
      ]
    },
    {
      nome: "Câmara dos Deputados",
      agenteResponsavel: "camara-deputados",
      descricao: "Regimento interno e normas da Câmara",
      topicos: [
        "Resolução nº 18/2003 - CÂMARA DOS DEPUTADOS",
        "Regimento Interno da Câmara dos Deputados: Título IX, Cap. III - Da Polícia da Câmara dos Deputados"
      ]
    }
  ]
};

// Função para buscar disciplina por nome ou tópico
export function buscarDisciplinaPorTopico(topic: string): DisciplinaEdital | null {
  const topicLower = topic.toLowerCase();
  
  for (const disciplina of conhecimentoEdital.disciplinas) {
    // Busca por nome da disciplina
    if (disciplina.nome.toLowerCase().includes(topicLower)) {
      return disciplina;
    }
    
    // Busca por tópicos específicos
    for (const topico of disciplina.topicos) {
      if (topico.toLowerCase().includes(topicLower)) {
        return disciplina;
      }
    }
  }
  
  return null;
}

// Função para obter todas as disciplinas de um agente
export function getDisciplinasPorAgente(agenteId: string): DisciplinaEdital[] {
  return conhecimentoEdital.disciplinas.filter(d => d.agenteResponsavel === agenteId);
}

// Função para obter informações gerais do concurso
export function getInfoConcurso() {
  return {
    concurso: conhecimentoEdital.concurso,
    instituicao: conhecimentoEdital.instituicao,
    cargo: conhecimentoEdital.cargo,
    status: conhecimentoEdital.status,
    totalDisciplinas: conhecimentoEdital.disciplinas.length,
    totalTopicos: conhecimentoEdital.disciplinas.reduce((acc, d) => acc + d.topicos.length, 0)
  };
}
