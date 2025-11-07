const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock de respostas inteligentes para o Sirius Orientador
const siriusResponses = {
  greeting: "Olá! Eu sou o Sirius Orientador, seu assistente pessoal para criar planos de estudos adaptativos. Para começarmos, qual é o seu nome?",
  name: "Prazer em conhecê-lo! Quantas horas por semana você pode dedicar aos estudos?",
  hours: "Perfeito! E qual o prazo que você tem até a prova ou para atingir seu objetivo (em semanas ou meses)?",
  deadline: "Entendido. Qual o seu nível de conhecimento atual nas disciplinas que pretende estudar (iniciante, intermediário, avançado)?",
  level: "Ótimo! Agora, por favor, liste as disciplinas que você precisa estudar (ex: Direito Administrativo, Português, Raciocínio Lógico-Matemático).",
  subjects: "Excelente! Com essas informações, vou gerar seu plano de estudos adaptativo personalizado. Aguarde um momento...",
  plan: "Seu plano de estudos foi gerado com sucesso! Os agentes especializados usarão este plano para adaptar suas orientações. O que mais posso fazer por você?"
};

// Conhecimento pré-carregado para Direito Administrativo
const conhecimentoDA = {
  poderes: `
  Os poderes administrativos são instrumentos que a Administração Pública utiliza para cumprir suas finalidades:

  1. PODER HIERÁRQUICO - É o poder de organizar a estrutura administrativa, distribuir e escalonar funções, facilitar coordenação e controle.

  2. PODER DISCIPLINAR - É o poder de apurar infrações e aplicar penalidades, vinculado ao poder hierárquico, sujeito ao princípio da legalidade.

  3. PODER REGULAMENTAR - É o poder de expedir decretos e regulamentos, complementa a lei mas não pode inová-la.

  4. PODER DE POLÍCIA - É o poder de restringir direitos individuais em benefício do interesse público, fundado na supremacia do interesse público.
  `,
  
  organizacao: `
  A organização administrativa compreende a estrutura através da qual o Estado exerce suas funções:

  1. CENTRALIZAÇÃO - Concentração de competências na pessoa jurídica do Estado (Ministérios, Secretarias)

  2. DESCENTRALIZAÇÃO - Transferência de competências para outras pessoas jurídicas (Autarquias, Empresas Públicas)

  3. AUTARQUIAS - Pessoas jurídicas de direito público, criadas por lei específica, com autonomia administrativa e financeira (INSS, IBGE, ANATEL)

  4. EMPRESAS PÚBLICAS - Pessoas jurídicas de direito privado, capital exclusivamente público (Caixa Econômica Federal)
  `,
  
  licitacoes: `
  Sistema de licitações e contratos regido pela Lei 14.133/2021:

  PRINCÍPIOS: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência, Igualdade

  MODALIDADES: Pregão (eletrônico e presencial), Concorrência, Tomada de preços, Convite, Concurso, Leilão, RDC

  CONTRATOS: Características exorbitantes, alterabilidade, privilégios da Administração, formalização escrita, garantias
  `,
  
  atos: `
  Atos administrativos são manifestações unilaterais da Administração Pública:

  ELEMENTOS: Competência, Finalidade, Forma, Motivo, Objeto

  ATRIBUTOS: Presunção de legitimidade, Imperatividade, Autoexecutoriedade, Tipicidade

  CLASSIFICAÇÃO: Quanto à formação (simples, complexos, compostos), efeitos (constitutivos, declaratórios), vinculação (vinculados, discricionários)
  `,
  
  processo: `
  Processo administrativo regido pela Lei 9.784/1999:

  PRINCÍPIOS: Legalidade, Finalidade, Razoabilidade, Impessoalidade, Moralidade, Ampla defesa, Publicidade, Eficiência

  FASES: Instauração, Instrução, Relatório, Decisão, Recurso

  PRAZOS: Decisão (30 dias), Recurso (10 dias), Resposta (10 dias)
  `
};

// Mock de respostas para agentes disciplinares
const disciplineResponses = {
  "Direito Administrativo": {
    greeting: "Olá! Sou o agente especializado em Direito Administrativo. Tenho conhecimento completo sobre poderes administrativos, organização administrativa, licitações, atos administrativos e processo administrativo. Como posso ajudá-lo hoje?",
    topics: {
      "princípios": conhecimentoDA.poderes,
      "poderes": conhecimentoDA.poderes,
      "hierárquico": conhecimentoDA.poderes,
      "disciplinar": conhecimentoDA.poderes,
      "regulamentar": conhecimentoDA.poderes,
      "polícia": conhecimentoDA.poderes,
      "organização": conhecimentoDA.organizacao,
      "centralização": conhecimentoDA.organizacao,
      "descentralização": conhecimentoDA.organizacao,
      "autarquia": conhecimentoDA.organizacao,
      "empresa pública": conhecimentoDA.organizacao,
      "licitação": conhecimentoDA.licitacoes,
      "contrato": conhecimentoDA.licitacoes,
      "pregão": conhecimentoDA.licitacoes,
      "concorrência": conhecimentoDA.licitacoes,
      "atos administrativos": conhecimentoDA.atos,
      "ato": conhecimentoDA.atos,
      "atributo": conhecimentoDA.atos,
      "elemento": conhecimentoDA.atos,
      "processo administrativo": conhecimentoDA.processo,
      "processo": conhecimentoDA.processo,
      "recurso": conhecimentoDA.processo,
      "prazo": conhecimentoDA.processo
    }
  },
  "Português – Gramática": {
    greeting: "Olá! Sou o agente especializado em Português e Gramática. Como posso ajudá-lo hoje?",
    topics: {
      "concordância": "A concordância verbal e nominal segue regras específicas. Vou explicar com exemplos...",
      "regência": "A regência verbal e nominal é essencial para uma boa redação. Vamos estudar...",
      "pontuação": "O uso correto da pontuação é fundamental para a clareza textual..."
    }
  },
  "Raciocínio Lógico-Matemático": {
    greeting: "Olá! Sou o agente especializado em Raciocínio Lógico-Matemático. Como posso ajudá-lo hoje?",
    topics: {
      "lógica": "A lógica proposicional é a base do raciocínio lógico. Vamos estudar...",
      "matemática": "Os conceitos matemáticos aplicados em concursos seguem padrões específicos...",
      "probabilidade": "A probabilidade é um tópico frequente em concursos. Vamos analisar..."
    }
  }
};

// Função para gerar plano de estudos mock
function generateStudyPlan(profile) {
  const { horasSemanais = 10, prazoSemanas = 8, disciplinas = [], nivel = "iniciante" } = profile;
  
  const plan = [];
  const semanasPorDisciplina = Math.ceil(prazoSemanas / disciplinas.length);
  
  disciplinas.forEach((disciplina, index) => {
    for (let i = 0; i < semanasPorDisciplina; i++) {
      const semana = index * semanasPorDisciplina + i + 1;
      if (semana <= prazoSemanas) {
        plan.push({
          semana,
          foco: `${disciplina}: ${getTopicForDiscipline(disciplina, i)}`,
          tarefas: generateTasks(disciplina, nivel, i)
        });
      }
    }
  });
  
  return plan;
}

function getTopicForDiscipline(disciplina, weekIndex) {
  const topics = {
    "Direito Administrativo": ["Princípios Fundamentais", "Atos Administrativos", "Poder de Polícia", "Processo Administrativo"],
    "Português – Gramática": ["Concordância Verbal", "Concordância Nominal", "Regência Verbal", "Pontuação"],
    "Raciocínio Lógico-Matemático": ["Lógica Proposicional", "Análise Combinatória", "Probabilidade", "Geometria"]
  };
  
  const disciplineTopics = topics[disciplina] || ["Tópico Principal"];
  return disciplineTopics[weekIndex % disciplineTopics.length];
}

function generateTasks(disciplina, nivel, weekIndex) {
  const baseTasks = {
    "Direito Administrativo": [
      "Estudar a teoria sobre o tópico",
      "Resolver 15 questões de múltipla escolha",
      "Revisar legislação pertinente"
    ],
    "Português – Gramática": [
      "Assistir aula sobre o tópico",
      "Fazer 20 exercícios de fixação",
      "Ler texto e identificar casos práticos"
    ],
    "Raciocínio Lógico-Matemático": [
      "Estudar conceitos e fórmulas",
      "Resolver 25 exercícios",
      "Fazer revisão com questões de concursos"
    ]
  };
  
  return baseTasks[disciplina] || ["Estudar tópico", "Fazer exercícios", "Revisar conteúdo"];
}

// Rota para chat com Sirius Orientador
app.post('/api/chat/sirius', (req, res) => {
  const { message, history = [] } = req.body;
  
  let response = "";
  let plan = null;
  
  // Lógica simples para simular conversa
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || history.length === 0) {
    response = siriusResponses.greeting;
  } else if (lowerMessage.includes('meu nome é') || lowerMessage.includes('me chamo')) {
    response = siriusResponses.name;
  } else if (lowerMessage.includes('horas') || lowerMessage.includes('hora')) {
    response = siriusResponses.hours;
  } else if (lowerMessage.includes('prazo') || lowerMessage.includes('semanas') || lowerMessage.includes('meses')) {
    response = siriusResponses.deadline;
  } else if (lowerMessage.includes('nível') || lowerMessage.includes('iniciante') || lowerMessage.includes('intermediário') || lowerMessage.includes('avançado')) {
    response = siriusResponses.level;
  } else if (lowerMessage.includes('disciplina') || lowerMessage.includes('direito') || lowerMessage.includes('português') || lowerMessage.includes('raciocínio')) {
    response = siriusResponses.subjects;
    
    // Gerar plano mock
    plan = generateStudyPlan({
      horasSemanais: 10,
      prazoSemanas: 8,
      disciplinas: ["Direito Administrativo", "Português – Gramática", "Raciocínio Lógico-Matemático"],
      nivel: "intermediário"
    });
  } else {
    response = "Não entendi. Poderia reformular sua pergunta ou me dar mais detalhes sobre seu perfil de estudos?";
  }
  
  res.json({ answer: response, plan });
});

// Rota para chat com agentes disciplinares
app.post('/api/chat/disciplina', (req, res) => {
  const { message, disciplina, assunto } = req.body;
  
  const agent = disciplineResponses[disciplina];
  if (!agent) {
    return res.status(400).json({ error: "Disciplina não encontrada" });
  }
  
  let response = agent.greeting;
  
  // Buscar resposta baseada no assunto
  if (assunto && agent.topics[assunto.toLowerCase()]) {
    response = agent.topics[assunto.toLowerCase()];
  } else {
    // Resposta genérica baseada na mensagem
    const lowerMessage = message.toLowerCase();
    for (const [topic, topicResponse] of Object.entries(agent.topics)) {
      if (lowerMessage.includes(topic)) {
        response = topicResponse;
        break;
      }
    }
  }
  
  // Simular citações
  const citations = [
    { title: `Manual de ${disciplina} - Edição 2024`, url: `https://example.com/manual-${disciplina.toLowerCase().replace(/\s+/g, '-')}.pdf` },
    { title: `Questões Comentadas - ${disciplina}`, url: `https://example.com/questoes-${disciplina.toLowerCase().replace(/\s+/g, '-')}.pdf` }
  ];
  
  res.json({ 
    answer: response, 
    citations 
  });
});

// Rota para upload de PDF (mock)
app.post('/api/upload/pdf', (req, res) => {
  const { disciplina } = req.body;
  
  // Simular processamento
  setTimeout(() => {
    res.json({
      success: true,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          title: `Resumo de ${disciplina} - Parte 1`,
          content: `Conteúdo extraído do PDF para ${disciplina}`,
          discipline: disciplina
        }
      ]
    });
  }, 2000);
});

// Rota para gerar plano de estudos
app.post('/api/plano/gerar', (req, res) => {
  const { horasSemanais, prazoSemanas, disciplinas, nivel } = req.body;
  
  const plan = generateStudyPlan({
    horasSemanais,
    prazoSemanas,
    disciplinas,
    nivel
  });
  
  res.json({ cronograma: plan });
});

// Rota de teste para OpenAI
app.post('/api/test-openai', async (req, res) => {
  try {
    const { message } = req.body;

    // Simular chamada para OpenAI (mock)
    const response = {
      success: true,
      message: "Teste da API OpenAI funcionando!",
      originalMessage: message,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Proxy para OpenAI API
app.post('/api/openai/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4', max_tokens = 2000, temperature = 0.7 } = req.body;
    
    console.log('🚀 Proxy OpenAI chamado com:', { messages: messages.length, model, max_tokens, temperature });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature
      })
    });

    console.log('📡 Resposta OpenAI, status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro OpenAI:', errorData);
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || 'Erro na API OpenAI'
      });
    }

    const data = await response.json();
    console.log('✅ Dados OpenAI recebidos:', { choices: data.choices?.length, usage: data.usage });

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Erro no proxy OpenAI:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api`);
});
