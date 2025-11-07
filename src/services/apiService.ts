const API_BASE_URL = 'http://localhost:3002/api';

export interface ChatResponse {
  answer: string;
  plan?: {
    semana: number;
    foco: string;
    tarefas: string[];
  }[];
}

export interface DisciplineChatResponse {
  answer: string;
  citations: { title: string; url: string }[];
}

// Serviço para chat com Sirius Orientador
export async function chatSirius(params: {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  profile?: {
    nome?: string;
    horasSemanais?: number;
    prazoSemanas?: number;
    nivel?: string;
    disciplinas?: string[];
    concurso?: string;
    banca?: string;
  };
}): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/sirius`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        history: params.history,
        profile: params.profile
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao chamar API do Sirius:', error);
    
    // Fallback para resposta mock em caso de erro
    return {
      answer: "Desculpe, estou com problemas técnicos. Tente novamente em alguns instantes.",
      plan: undefined
    };
  }
}

// Serviço para chat com agentes disciplinares
export async function chatDisciplina(params: {
  message: string;
  disciplina: string;
  assunto?: string;
}): Promise<DisciplineChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/disciplina`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        disciplina: params.disciplina,
        assunto: params.assunto
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao chamar API da disciplina:', error);
    
    // Fallback para resposta mock em caso de erro
    return {
      answer: "Desculpe, estou com problemas técnicos. Tente novamente em alguns instantes.",
      citations: []
    };
  }
}

// Serviço para upload de PDF
export async function uploadPDF(file: File, disciplina: string): Promise<{
  success: boolean;
  documents: Array<{
    id: string;
    title: string;
    content: string;
    discipline: string;
  }>;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('disciplina', disciplina);

    const response = await fetch(`${API_BASE_URL}/upload/pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer upload do PDF:', error);
    
    // Fallback para resposta mock em caso de erro
    return {
      success: false,
      documents: []
    };
  }
}

// Serviço para gerar plano de estudos
export async function gerarPlano(params: {
  horasSemanais: number;
  prazoSemanas: number;
  disciplinas: string[];
  nivel: string;
}): Promise<{
  cronograma: Array<{
    semana: number;
    foco: string;
    tarefas: string[];
  }>;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/plano/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    
    // Fallback para plano mock em caso de erro
    return {
      cronograma: [
        {
          semana: 1,
          foco: "Tópico Principal",
          tarefas: ["Estudar teoria", "Fazer exercícios", "Revisar conteúdo"]
        }
      ]
    };
  }
}

// Verificar se a API está funcionando
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API não está funcionando:', error);
    return false;
  }
}
