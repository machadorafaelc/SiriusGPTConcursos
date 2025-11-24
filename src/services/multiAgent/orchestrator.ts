// Agente Orquestrador - Analisa a intenção do usuário e roteia para agentes especializados

import { OpenAIService } from '../openaiService';
import { AgentType, UserIntent, AgentRequest } from './types';

export class OrchestratorAgent {
  private openai: OpenAIService;

  constructor() {
    this.openai = new OpenAIService();
  }

  /**
   * Analisa a mensagem do usuário e identifica qual(is) agente(s) deve(m) ser acionado(s)
   */
  async analyzeIntent(request: AgentRequest): Promise<UserIntent> {
    console.log('🎯 Orquestrador: Analisando intenção do usuário...');

    const systemPrompt = `Você é um orquestrador de agentes especializados em Direito Administrativo.

Sua função é analisar a mensagem do usuário e identificar qual agente especializado deve responder.

AGENTES DISPONÍVEIS:
1. "conceitos" - Explica teoria, conceitos, definições, princípios
2. "questoes" - Cria questões, analisa questões, explica gabaritos
3. "resumos" - Cria resumos estruturados, esquemas, fichamentos
4. "jurisprudencia" - Busca e explica súmulas, decisões, precedentes
5. "mapas" - Cria mapas mentais, diagramas, estruturas visuais
6. "geral" - Resposta geral (saudações, conversas gerais)

INSTRUÇÕES:
- Analise a mensagem do usuário
- Identifique o agente PRINCIPAL mais adequado
- Se necessário, identifique agentes SECUNDÁRIOS
- Retorne APENAS um JSON válido no formato:

{
  "primaryAgent": "nome_do_agente",
  "secondaryAgents": ["agente2", "agente3"],
  "confidence": 0.95,
  "reasoning": "Breve explicação da escolha"
}

EXEMPLOS:

Usuário: "Me explica o que é poder de polícia"
Resposta: {"primaryAgent": "conceitos", "confidence": 0.95, "reasoning": "Usuário quer entender um conceito"}

Usuário: "Cria 5 questões sobre atos administrativos"
Resposta: {"primaryAgent": "questoes", "confidence": 0.98, "reasoning": "Usuário quer criar questões"}

Usuário: "Me explica atos administrativos e depois cria questões"
Resposta: {"primaryAgent": "conceitos", "secondaryAgents": ["questoes"], "confidence": 0.90, "reasoning": "Usuário quer explicação E questões"}

Usuário: "Resume o tema de licitações"
Resposta: {"primaryAgent": "resumos", "confidence": 0.95, "reasoning": "Usuário quer um resumo"}

Usuário: "Quais as súmulas sobre processo administrativo?"
Resposta: {"primaryAgent": "jurisprudencia", "confidence": 0.97, "reasoning": "Usuário quer jurisprudência"}

Usuário: "Cria um mapa mental de poderes administrativos"
Resposta: {"primaryAgent": "mapas", "confidence": 0.98, "reasoning": "Usuário quer mapa mental"}

Usuário: "Olá" ou "Bom dia"
Resposta: {"primaryAgent": "geral", "confidence": 1.0, "reasoning": "Saudação simples"}`;

    const userMessage = `Contexto:
- Disciplina: ${request.context.disciplina}
- Assunto: ${request.context.assunto}
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}

Mensagem do usuário: "${request.userMessage}"

Analise e retorne o JSON com o agente adequado.`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        userMessage,
        []
      );

      console.log('📋 Resposta do orquestrador:', response);

      // Extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta do orquestrador não contém JSON válido');
      }

      const intent: UserIntent = JSON.parse(jsonMatch[0]);
      
      console.log('✅ Intenção identificada:', intent);
      
      return intent;
    } catch (error) {
      console.error('❌ Erro ao analisar intenção:', error);
      
      // Fallback: análise simples baseada em palavras-chave
      return this.fallbackAnalysis(request.userMessage);
    }
  }

  /**
   * Análise fallback usando palavras-chave (caso a OpenAI falhe)
   */
  private fallbackAnalysis(message: string): UserIntent {
    const lowerMessage = message.toLowerCase();

    // Saudações
    if (/^(ol[aá]|oi|bom dia|boa tarde|boa noite|hey|hello)/i.test(lowerMessage)) {
      return {
        primaryAgent: 'geral',
        confidence: 1.0,
        reasoning: 'Saudação detectada'
      };
    }

    // Questões
    if (/quest[õo]|exerc[íi]cio|prova|gabarito|certo ou errado/i.test(lowerMessage)) {
      return {
        primaryAgent: 'questoes',
        confidence: 0.85,
        reasoning: 'Palavras-chave de questões detectadas'
      };
    }

    // Resumos
    if (/resum|esquema|sintetiz|fichamento/i.test(lowerMessage)) {
      return {
        primaryAgent: 'resumos',
        confidence: 0.85,
        reasoning: 'Palavras-chave de resumo detectadas'
      };
    }

    // Mapas mentais
    if (/mapa mental|diagrama|organograma|estrutura/i.test(lowerMessage)) {
      return {
        primaryAgent: 'mapas',
        confidence: 0.85,
        reasoning: 'Palavras-chave de mapa mental detectadas'
      };
    }

    // Jurisprudência
    if (/s[úu]mula|jurisprud[êe]ncia|stf|stj|decis[ãa]o|precedente/i.test(lowerMessage)) {
      return {
        primaryAgent: 'jurisprudencia',
        confidence: 0.85,
        reasoning: 'Palavras-chave de jurisprudência detectadas'
      };
    }

    // Conceitos (padrão)
    return {
      primaryAgent: 'conceitos',
      confidence: 0.70,
      reasoning: 'Análise padrão - explicação de conceito'
    };
  }
}
