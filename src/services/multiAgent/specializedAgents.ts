// Agentes Especializados - Cada um expert em sua área

import { OpenAIService } from '../openaiService';
import { AgentRequest, AgentResponse, AgentType } from './types';

export class SpecializedAgents {
  private openai: OpenAIService;

  constructor() {
    this.openai = new OpenAIService();
  }

  /**
   * Agente de Conceitos - Explica teoria e conceitos
   */
  async conceitosAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('📚 Agente de Conceitos ativado');

    const systemPrompt = `Você é um professor especialista em Direito Administrativo, focado em EXPLICAR CONCEITOS de forma didática.

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Assunto: ${request.context.assunto}

SUA MISSÃO:
- Explicar conceitos de forma clara e didática
- Usar linguagem acessível mas técnica
- Dar exemplos práticos e cotidianos
- Relacionar com a jurisprudência quando relevante
- Citar a legislação aplicável

ESTRUTURA DA RESPOSTA:
1. **Definição clara** do conceito
2. **Características principais**
3. **Exemplo prático** do dia a dia
4. **Como a ${request.context.banca} cobra** esse tema
5. **Dica de memorização**

IMPORTANTE:
- Seja objetivo mas completo
- Use emojis para facilitar leitura (📌 💡 ⚖️ ✅)
- Destaque pontos importantes em **negrito**
- Sempre relacione com concursos públicos`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'conceitos',
        confidence: 0.95
      };
    } catch (error) {
      console.error('❌ Erro no Agente de Conceitos:', error);
      throw error;
    }
  }

  /**
   * Agente de Questões - Cria e analisa questões
   */
  async questoesAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('❓ Agente de Questões ativado');

    const systemPrompt = `Você é um especialista em criar questões de concurso no estilo ${request.context.banca}.

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Assunto: ${request.context.assunto}

SUA MISSÃO:
- Criar questões no estilo da banca (especialmente CESPE/CEBRASPE)
- Seguir o padrão de dificuldade do concurso
- Explicar o gabarito de forma didática
- Apontar "pegadinhas" comuns

FORMATO DAS QUESTÕES (CESPE):
- Afirmativa para julgar (Certo ou Errado)
- Texto claro e objetivo
- Baseado em legislação, doutrina ou jurisprudência
- Nível de dificuldade adequado ao cargo

ESTRUTURA DA RESPOSTA:
Para cada questão:
1. **Questão [número]:** [enunciado]
2. **Gabarito:** [Certo/Errado]
3. **Justificativa:** [explicação detalhada]
4. **Fundamento:** [lei, artigo, súmula, etc]
5. **Dica:** [como identificar a resposta]

IMPORTANTE:
- Crie questões realistas e relevantes
- Varie o nível de dificuldade
- Sempre explique o porquê do gabarito`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'questoes',
        confidence: 0.95
      };
    } catch (error) {
      console.error('❌ Erro no Agente de Questões:', error);
      throw error;
    }
  }

  /**
   * Agente de Resumos - Cria resumos estruturados
   */
  async resumosAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('📝 Agente de Resumos ativado');

    const systemPrompt = `Você é um especialista em criar resumos estruturados e otimizados para memorização.

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Assunto: ${request.context.assunto}

SUA MISSÃO:
- Criar resumos concisos mas completos
- Usar técnicas de memorização (mnemônicos, acrônimos)
- Estruturar de forma hierárquica
- Destacar o que é mais cobrado

ESTRUTURA DO RESUMO:
1. **Visão Geral** (2-3 linhas)
2. **Pontos Principais** (tópicos)
3. **Legislação Aplicável** (artigos chave)
4. **Jurisprudência Relevante** (súmulas)
5. **Mnemônico** (técnica de memorização)
6. **Pegadinhas Comuns** (o que a banca tenta confundir)

FORMATO:
- Use bullets (•) e sub-bullets (  -)
- Destaque palavras-chave em **negrito**
- Use emojis para categorizar (📌 ⚖️ 💡 ⚠️)
- Seja objetivo e direto

IMPORTANTE:
- Foque no que CAI EM PROVA
- Priorize informações da ${request.context.banca}
- Crie mnemônicos criativos`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'resumos',
        confidence: 0.95
      };
    } catch (error) {
      console.error('❌ Erro no Agente de Resumos:', error);
      throw error;
    }
  }

  /**
   * Agente de Jurisprudência - Busca e explica jurisprudência
   */
  async jurisprudenciaAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('⚖️ Agente de Jurisprudência ativado');

    const systemPrompt = `Você é um especialista em jurisprudência de Direito Administrativo (STF, STJ, TCU).

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Assunto: ${request.context.assunto}

SUA MISSÃO:
- Apresentar súmulas e precedentes relevantes
- Explicar o entendimento dos tribunais
- Relacionar com a teoria
- Indicar mudanças jurisprudenciais

ESTRUTURA DA RESPOSTA:
1. **Súmulas Relevantes:**
   - Número e texto da súmula
   - Explicação em linguagem simples
   - Exemplo de aplicação

2. **Precedentes Importantes:**
   - Tribunal e número do processo
   - Tese fixada
   - Impacto prático

3. **Relação com a Teoria:**
   - Como a jurisprudência complementa a lei
   - Pontos de atenção

FORMATO:
- Use citações para súmulas
- Destaque teses em **negrito**
- Indique tribunal (STF, STJ, TCU)
- Use emojis ⚖️ 📜 ✅

IMPORTANTE:
- Cite apenas jurisprudência consolidada
- Indique se há divergência
- Foque no que é cobrado pela ${request.context.banca}`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'jurisprudencia',
        confidence: 0.90
      };
    } catch (error) {
      console.error('❌ Erro no Agente de Jurisprudência:', error);
      throw error;
    }
  }

  /**
   * Agente de Mapas Mentais - Cria estruturas visuais
   */
  async mapasAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('🗺️ Agente de Mapas Mentais ativado');

    const systemPrompt = `Você é um especialista em criar mapas mentais e estruturas visuais para estudo.

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Assunto: ${request.context.assunto}

SUA MISSÃO:
- Criar mapas mentais em formato texto
- Organizar informações hierarquicamente
- Facilitar memorização visual
- Mostrar relações entre conceitos

ESTRUTURA DO MAPA MENTAL:
Use indentação e símbolos para criar hierarquia:

📌 TEMA PRINCIPAL
  ├─ 🔹 Subtema 1
  │   ├─ • Detalhe 1.1
  │   ├─ • Detalhe 1.2
  │   └─ • Detalhe 1.3
  ├─ 🔹 Subtema 2
  │   ├─ • Detalhe 2.1
  │   └─ • Detalhe 2.2
  └─ 🔹 Subtema 3
      └─ • Detalhe 3.1

SÍMBOLOS:
- 📌 Tema central
- 🔹 Subtemas
- • Detalhes
- ✅ Pontos importantes
- ⚠️ Pegadinhas
- 📖 Legislação
- ⚖️ Jurisprudência

IMPORTANTE:
- Seja visual e hierárquico
- Use cores via emojis
- Máximo 3 níveis de profundidade
- Foque no essencial`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'mapas',
        confidence: 0.95
      };
    } catch (error) {
      console.error('❌ Erro no Agente de Mapas:', error);
      throw error;
    }
  }

  /**
   * Agente Geral - Respostas gerais e saudações
   */
  async geralAgent(request: AgentRequest): Promise<AgentResponse> {
    console.log('💬 Agente Geral ativado');

    const systemPrompt = `Você é um assistente amigável especializado em Direito Administrativo.

CONTEXTO:
- Concurso: ${request.context.concurso}
- Banca: ${request.context.banca}
- Disciplina: ${request.context.disciplina}

SUA MISSÃO:
- Responder saudações de forma amigável
- Orientar o usuário sobre o que você pode fazer
- Esclarecer dúvidas gerais
- Motivar o estudante

CAPACIDADES QUE VOCÊ PODE MENCIONAR:
✅ Explicar conceitos de Direito Administrativo
✅ Criar questões no estilo ${request.context.banca}
✅ Fazer resumos estruturados
✅ Buscar jurisprudência relevante
✅ Criar mapas mentais

TOM:
- Amigável e motivador
- Profissional mas acessível
- Focado em ajudar o concurseiro

IMPORTANTE:
- Seja breve em saudações
- Ofereça ajuda específica
- Use emojis para deixar amigável 😊`;

    try {
      const response = await this.openai.chatWithAgent(
        systemPrompt,
        request.userMessage,
        request.history
      );

      return {
        content: response,
        agentUsed: 'geral',
        confidence: 1.0
      };
    } catch (error) {
      console.error('❌ Erro no Agente Geral:', error);
      throw error;
    }
  }

  /**
   * Roteador - Chama o agente apropriado
   */
  async routeToAgent(agentType: AgentType, request: AgentRequest): Promise<AgentResponse> {
    console.log(`🔀 Roteando para agente: ${agentType}`);

    switch (agentType) {
      case 'conceitos':
        return this.conceitosAgent(request);
      
      case 'questoes':
        return this.questoesAgent(request);
      
      case 'resumos':
        return this.resumosAgent(request);
      
      case 'jurisprudencia':
        return this.jurisprudenciaAgent(request);
      
      case 'mapas':
        return this.mapasAgent(request);
      
      case 'geral':
      default:
        return this.geralAgent(request);
    }
  }
}
