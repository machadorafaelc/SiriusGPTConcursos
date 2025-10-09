import { apiPost } from "./apiClient";

type Trecho = {
  titulo: string;
  trecho: string;
  fonte: string;
};

type ConsultaEditaisResponse = {
  trechos: Trecho[];
};

export async function consultaEditais(params: {
  concurso: string;
  banca?: string;
  topico?: string;
}): Promise<ConsultaEditaisResponse> {
  try {
    return await apiPost<ConsultaEditaisResponse>("/api/consulta-editais", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            trechos: [
              {
                titulo: "Língua Portuguesa",
                trecho: "Compreensão e interpretação de textos; Tipologia textual...",
                fonte: "Edital 001/2024 - Câmara dos Deputados",
              },
              {
                titulo: "Direito Constitucional",
                trecho: "Princípios fundamentais; Direitos e garantias fundamentais...",
                fonte: "Edital 001/2024 - Câmara dos Deputados",
              },
            ],
          }),
        500
      )
    );
  }
}
