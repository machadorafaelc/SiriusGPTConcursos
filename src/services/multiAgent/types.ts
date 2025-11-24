// Tipos e interfaces para o sistema de múltiplos agentes

export type AgentType = 
  | 'conceitos'      // Explica teoria e conceitos
  | 'questoes'       // Cria e analisa questões
  | 'resumos'        // Cria resumos estruturados
  | 'jurisprudencia' // Busca e explica jurisprudência
  | 'mapas'          // Cria mapas mentais
  | 'geral';         // Resposta geral (fallback)

export interface UserIntent {
  primaryAgent: AgentType;
  secondaryAgents?: AgentType[];
  confidence: number;
  reasoning: string;
}

export interface AgentRequest {
  userMessage: string;
  context: {
    concurso: string;
    banca: string;
    disciplina: string;
    assunto: string;
  };
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AgentResponse {
  content: string;
  agentUsed: AgentType;
  confidence: number;
  sources?: string[];
}

export interface MultiAgentResponse {
  finalAnswer: string;
  agentsUsed: AgentType[];
  breakdown: {
    agent: AgentType;
    response: string;
  }[];
}
