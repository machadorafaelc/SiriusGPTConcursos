export type AgentSpec = {
    id: string;
    nome: string;
    disciplina: string;
    politica: {
      exigirCitacoes: boolean;
    };
    padraoResposta: string[]; // ordem das seções na resposta
    systemPrompt: (ctx: {
      concurso?: string;
      banca?: string;
      assunto?: string;
      planoCompartilhado?: any;
    }) => string;
  };

  