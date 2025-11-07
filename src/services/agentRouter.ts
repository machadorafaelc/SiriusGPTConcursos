import { agentes } from "../agents";

type PlanoEstudos = {
  aluno: {
    nome: string;
    nivel: string;
    horasSemana: number;
    prazoSemanas: number;
  };
  metodoPrincipal: string;
  modulos: Array<{
    mes: number;
    foco: string;
  }>;
  disciplinas: Array<{
    nome: string;
    percentual: number;
  }>;
  rotinaSemanal: Record<string, string[]>;
};

type PayloadPlano = {
  destino: string;
  contexto: string;
  dados: {
    horasSemana: number;
    metodo: string;
    foco: string;
    objetivos: string[];
    rotinaSemanal: Record<string, string>;
  };
};

class AgentRouter {
  private planosCompartilhados: Map<string, PlanoEstudos> = new Map();

  async enviarPlanoParaAgentes(planoGerado: { planoEstudos: PlanoEstudos }, sessionId: string) {
    console.log("🚀 Enviando plano para agentes:", planoGerado);
    
    // Salvar plano compartilhado
    this.planosCompartilhados.set(sessionId, planoGerado.planoEstudos);
    
    const disciplinas = planoGerado.planoEstudos.disciplinas;
    
    for (const disciplina of disciplinas) {
      const destino = this.mapearDisciplinaParaAgente(disciplina.nome);
      if (destino) {
        const payload: PayloadPlano = {
          destino,
          contexto: `Plano do aluno ${planoGerado.planoEstudos.aluno.nome} - Módulo 1 (Fundamentos)`,
          dados: {
            horasSemana: planoGerado.planoEstudos.aluno.horasSemana,
            metodo: planoGerado.planoEstudos.metodoPrincipal,
            foco: planoGerado.planoEstudos.modulos[0]?.foco || "Fundamentos",
            objetivos: planoGerado.planoEstudos.modulos.map(m => m.foco),
            rotinaSemanal: this.extrairRotinaDisciplina(disciplina.nome, planoGerado.planoEstudos.rotinaSemanal)
          }
        };
        
        console.log(`📤 Enviando para ${destino}:`, payload);
        await this.sendToAgent(destino, payload, sessionId);
      }
    }
  }

  private mapearDisciplinaParaAgente(nomeDisciplina: string): string | null {
    const mapeamento: Record<string, string> = {
      "Língua Portuguesa": "portugues",
      "Raciocínio Lógico-Matemático": "raciocinio",
      "Direito Constitucional": "constitucional",
      "Direito Administrativo": "da",
      "Direito Penal": "penal",
      "Direito Processual Penal": "processual-penal"
    };
    
    return mapeamento[nomeDisciplina] || null;
  }

  private extrairRotinaDisciplina(nomeDisciplina: string, rotinaSemanal: Record<string, string[]>): Record<string, string> {
    const rotina: Record<string, string> = {};
    
    for (const [dia, disciplinas] of Object.entries(rotinaSemanal)) {
      if (disciplinas.includes(nomeDisciplina)) {
        rotina[dia] = `1h30 de ${nomeDisciplina}`;
      }
    }
    
    return rotina;
  }

  private async sendToAgent(destino: string, payload: PayloadPlano, sessionId: string) {
    // Simular envio para o agente
    console.log(`📡 Enviando para agente ${destino}:`, payload);
    
    // Aqui você pode implementar a lógica real de envio
    // Por exemplo, salvar no contexto do agente ou enviar via API
    return true;
  }

  getPlanoCompartilhado(sessionId: string): PlanoEstudos | null {
    return this.planosCompartilhados.get(sessionId) || null;
  }

  limparPlanos(sessionId: string) {
    this.planosCompartilhados.delete(sessionId);
  }
}

export const agentRouter = new AgentRouter();
