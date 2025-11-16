import type { AgentId } from "../agents";
import { agentes } from "../agents";
import { buscarConhecimento } from "../data/direitoAdministrativo";
import { openaiService, type OpenAIMessage } from "./openaiService";
import { agentCommunicationService } from "./agentCommunication";

type Citation = { title: string; url: string };
type ChatResponse = { answer: string; citations: Citation[] };

export async function chatRag(params: {
  agentId: AgentId;
  message: string;
  concurso?: string;
  banca?: string;
  disciplina?: string;
  assunto?: string;
  history?: OpenAIMessage[];
}): Promise<ChatResponse> {
  const agent = agentes[params.agentId];

  try {
    console.log("🚀 Iniciando chamada para OpenAI...");
    console.log("Agent ID:", params.agentId);
    console.log("Message:", params.message);
    console.log("Agent encontrado:", agent);
    console.log("Histórico recebido:", params.history?.length || 0, "mensagens");
    
    // Verificar se há plano compartilhado do Sirius Orientador
    const planoCompartilhado = agentCommunicationService.getPlanoCompartilhado('default', agent.disciplina);
    console.log("📋 Plano compartilhado encontrado:", planoCompartilhado);
    
    // Usar OpenAI para gerar resposta
    const systemPrompt = agent.systemPrompt({
      concurso: params.concurso,
      banca: params.banca,
      assunto: params.assunto || params.message,
      planoCompartilhado: planoCompartilhado
    });

    console.log("System prompt length:", systemPrompt.length);
    console.log("System prompt preview:", systemPrompt.substring(0, 200) + "...");

    console.log("📞 Chamando openaiService.chatWithAgent...");
    const answer = await openaiService.chatWithAgent(
      systemPrompt,
      params.message,
      params.history || []
    );

    console.log("✅ Resposta recebida da OpenAI:", answer.substring(0, 100) + "...");
    console.log("Resposta completa length:", answer.length);

    // Gerar citações baseadas no agente
    const citations: Citation[] = generateCitations(params.agentId, params.assunto || params.message);

    return { answer, citations };
  } catch (error) {
    console.error("❌ Erro ao chamar OpenAI:", error);
    console.error("Detalhes do erro:", error);
    console.log("🔄 Usando fallback para mock...");
    console.log("Erro detalhado:", error);
    
    // Fallback para mock em caso de erro
    return generateMockResponse(params, agent);
  }
}

function generateCitations(agentId: AgentId, tema: string): Citation[] {
  const temaLower = tema.toLowerCase();
  
  if (agentId === "da") {
    if (temaLower.includes("estatuto") || temaLower.includes("servidor") || temaLower.includes("8.112")) {
      return [
        {
          title: "Lei 8.112/1990 — Estatuto dos Servidores Públicos",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm",
        },
        {
          title: "Lei 14.230/2021 — Improbidade Administrativa",
          url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm",
        },
      ];
    } else if (temaLower.includes("licitação") || temaLower.includes("contrato")) {
      return [
        {
          title: "Lei 14.133/2021 — Licitações e Contratos",
          url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm",
        },
        {
          title: "Lei 8.666/1993 — Licitações (anterior)",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8666cons.htm",
        },
      ];
    } else {
      return [
        {
          title: "Legislação de Direito Administrativo",
          url: "https://www.planalto.gov.br/ccivil_03/leis/",
        },
        {
          title: "Jurisprudência do STF e STJ",
          url: "https://www.stf.jus.br/",
        },
      ];
    }
  }

  // Citações padrão para outros agentes
  return [
    {
      title: "Legislação Aplicável",
      url: "https://www.planalto.gov.br/ccivil_03/leis/",
    },
    {
      title: "Jurisprudência dos Tribunais",
      url: "https://www.stf.jus.br/",
    },
  ];
}

function generateMockResponse(params: any, agent: any): ChatResponse {
  const mensagem = params.message?.toLowerCase() || "";
  
  // Verificar se é uma saudação simples
  const saudacoes = ["olá", "oi", "bom dia", "boa tarde", "boa noite", "hello", "hi"];
  const isSaudacao = saudacoes.some(s => mensagem.includes(s)) && mensagem.length < 10;
  
  if (isSaudacao) {
    const answer = `Olá! 👋 Sou o especialista em Direito Administrativo. Estou aqui para te ajudar com qualquer dúvida sobre esta disciplina. 

Sobre o que você gostaria de estudar hoje? Posso explicar conceitos, resolver questões, criar mapas mentais ou qualquer outro tópico do Direito Administrativo! 😊

👉 Posso te ajudar com mais alguma dúvida sobre Direito Administrativo?`;

    return {
      answer,
      citations: []
    };
  }

  // Para outras mensagens, mostrar erro claro
  const answer = `⚠️ Desculpe, estou com dificuldades para processar sua pergunta no momento.

Isso pode acontecer por:
- Problema temporário na conexão com a API
- Limite de tokens excedido
- Timeout na requisição

Por favor, tente:
1. Reformular sua pergunta de forma mais simples
2. Dividir em perguntas menores
3. Aguardar alguns segundos e tentar novamente

👉 Posso te ajudar com mais alguma dúvida sobre Direito Administrativo?`;

  return {
    answer,
    citations: []
  };
}
