// Sistema Multi-Agente Principal
// Integra o orquestrador e os agentes especializados

import { OrchestratorAgent } from './orchestrator';
import { SpecializedAgents } from './specializedAgents';
import { AgentRequest, MultiAgentResponse } from './types';

export class MultiAgentSystem {
  private orchestrator: OrchestratorAgent;
  private agents: SpecializedAgents;

  constructor() {
    this.orchestrator = new OrchestratorAgent();
    this.agents = new SpecializedAgents();
  }

  /**
   * Processa a mensagem do usuário usando o sistema multi-agente
   */
  async processMessage(request: AgentRequest): Promise<MultiAgentResponse> {
    console.log('🚀 Sistema Multi-Agente iniciado');
    console.log('📨 Mensagem:', request.userMessage);

    try {
      // 1. Orquestrador analisa a intenção
      const intent = await this.orchestrator.analyzeIntent(request);
      console.log('🎯 Intenção identificada:', intent);

      const agentsUsed = [intent.primaryAgent];
      const breakdown: MultiAgentResponse['breakdown'] = [];

      // 2. Chama o agente principal
      console.log(`📞 Chamando agente principal: ${intent.primaryAgent}`);
      const primaryResponse = await this.agents.routeToAgent(
        intent.primaryAgent,
        request
      );

      breakdown.push({
        agent: intent.primaryAgent,
        response: primaryResponse.content
      });

      let finalAnswer = primaryResponse.content;

      // 3. Se houver agentes secundários, chama eles também
      if (intent.secondaryAgents && intent.secondaryAgents.length > 0) {
        console.log('📞 Chamando agentes secundários:', intent.secondaryAgents);

        for (const secondaryAgent of intent.secondaryAgents) {
          agentsUsed.push(secondaryAgent);

          const secondaryResponse = await this.agents.routeToAgent(
            secondaryAgent,
            request
          );

          breakdown.push({
            agent: secondaryAgent,
            response: secondaryResponse.content
          });

          // Combina as respostas
          finalAnswer += `\n\n---\n\n${secondaryResponse.content}`;
        }
      }

      // 4. Adiciona indicador de qual agente respondeu (para debug/transparência)
      const agentIndicator = this.getAgentIndicator(intent.primaryAgent);
      finalAnswer = `${agentIndicator}\n\n${finalAnswer}`;

      console.log('✅ Sistema Multi-Agente concluído');
      console.log('🤖 Agentes usados:', agentsUsed);

      return {
        finalAnswer,
        agentsUsed,
        breakdown
      };

    } catch (error) {
      console.error('❌ Erro no Sistema Multi-Agente:', error);
      throw error;
    }
  }

  /**
   * Retorna um indicador visual do agente que respondeu
   */
  private getAgentIndicator(agentType: string): string {
    const indicators: Record<string, string> = {
      'conceitos': '📚 **Agente de Conceitos**',
      'questoes': '❓ **Agente de Questões**',
      'resumos': '📝 **Agente de Resumos**',
      'jurisprudencia': '⚖️ **Agente de Jurisprudência**',
      'mapas': '🗺️ **Agente de Mapas Mentais**',
      'geral': '💬 **Assistente Geral**'
    };

    return indicators[agentType] || '🤖 **Assistente**';
  }
}

// Exportar tipos também
export * from './types';
