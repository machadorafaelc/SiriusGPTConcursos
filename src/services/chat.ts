import { apiPost } from "./apiClient";

type Citation = { title: string; url: string };
type ChatResponse = { answer: string; citations: Citation[] };

export async function chatRag(params: {
  message: string; concurso?: string; banca?: string; disciplina?: string; assunto?: string;
}): Promise<ChatResponse> {
  try {
    return await apiPost<ChatResponse>("/api/chat", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve)=>setTimeout(()=>resolve({
      answer: "Resposta simulada com base em RAG. [Exemplo] Explanação + checklist + exercícios.",
      citations: [
        { title: "Lei 8.112/90", url: "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm" },
        { title: "Informativo STJ 999", url: "https://www.stj.jus.br/" }
      ]
    }), 600));
  }
}
