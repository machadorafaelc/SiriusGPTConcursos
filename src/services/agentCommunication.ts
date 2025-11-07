// Serviço de comunicação entre agentes
import { usePlano } from "../PlanoContext";

export interface PlanoCompartilhado {
  disciplina: string;
  foco: string;
  tarefas: string[];
  semana: number;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  horasSemanais: number;
  prazoSemanas: number;
}

export interface MensagemInterAgente {
  from: string;
  to: string;
  type: 'plano_estudo' | 'orientacao' | 'consulta';
  data: any;
  timestamp: Date;
}

class AgentCommunicationService {
  private mensagens: Map<string, MensagemInterAgente[]> = new Map();
  private planosCompartilhados: Map<string, PlanoCompartilhado[]> = new Map();

  // Enviar plano do Sirius Orientador para outros agentes
  enviarPlanoParaAgentes(plano: Record<string, any[]>, sessionId: string) {
    console.log("📤 Enviando plano para agentes:", plano);
    
    // Processar plano por disciplina
    Object.entries(plano).forEach(([disciplina, semanas]) => {
      const planoCompartilhado: PlanoCompartilhado[] = semanas.map(semana => ({
        disciplina,
        foco: semana.foco,
        tarefas: semana.tarefas,
        semana: semana.semana,
        nivel: 'intermediario', // Default, pode ser ajustado
        horasSemanais: 20, // Default, pode ser ajustado
        prazoSemanas: semanas.length
      }));

      this.planosCompartilhados.set(`${sessionId}_${disciplina}`, planoCompartilhado);
      
      // Enviar mensagem para agentes específicos
      this.enviarMensagem({
        from: 'sirius',
        to: this.getAgentIdByDisciplina(disciplina),
        type: 'plano_estudo',
        data: planoCompartilhado,
        timestamp: new Date()
      }, sessionId);
    });
  }

  // Obter plano compartilhado para uma disciplina
  getPlanoCompartilhado(sessionId: string, disciplina: string): PlanoCompartilhado[] | null {
    return this.planosCompartilhados.get(`${sessionId}_${disciplina}`) || null;
  }

  // Enviar mensagem entre agentes
  enviarMensagem(mensagem: MensagemInterAgente, sessionId: string) {
    const mensagens = this.mensagens.get(sessionId) || [];
    mensagens.push(mensagem);
    this.mensagens.set(sessionId, mensagens);
    
    console.log(`📨 Mensagem enviada de ${mensagem.from} para ${mensagem.to}:`, mensagem.type);
  }

  // Obter mensagens para um agente
  getMensagensParaAgente(sessionId: string, agentId: string): MensagemInterAgente[] {
    const mensagens = this.mensagens.get(sessionId) || [];
    return mensagens.filter(m => m.to === agentId);
  }

  // Mapear disciplina para ID do agente
  private getAgentIdByDisciplina(disciplina: string): string {
    const mapeamento: Record<string, string> = {
      'Direito Administrativo': 'da',
      'Português – Gramática': 'portugues',
      'Raciocínio Lógico-Matemático': 'raciocinio',
      'Direito Constitucional': 'constitucional',
      'Direito Penal': 'penal',
      'Informática': 'informatica'
    };
    
    return mapeamento[disciplina] || 'da'; // Default para Direito Administrativo
  }

  // Limpar mensagens de uma sessão
  limparSessao(sessionId: string) {
    this.mensagens.delete(sessionId);
    // Limpar planos compartilhados
    const keys = Array.from(this.planosCompartilhados.keys()).filter(key => key.startsWith(sessionId));
    keys.forEach(key => this.planosCompartilhados.delete(key));
  }
}

export const agentCommunicationService = new AgentCommunicationService();


