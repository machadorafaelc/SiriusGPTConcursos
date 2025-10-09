import { apiPost } from "./apiClient";

type Ementa = {
  referencia: string;
  resumo: string;
  fonte: string;
};

type BuscarJurisResponse = {
  ementas: Ementa[];
};

export async function buscarJuris(params: {
  tema: string;
  tribunal?: string;
}): Promise<BuscarJurisResponse> {
  try {
    return await apiPost<BuscarJurisResponse>("/api/juris", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ementas: [
              {
                referencia: "STF, RE 123456",
                resumo: "Súmula sobre direitos fundamentais aplicáveis ao concurso...",
                fonte: "https://www.stf.jus.br/",
              },
              {
                referencia: "STJ, REsp 789012",
                resumo: "Jurisprudência consolidada sobre servidor público...",
                fonte: "https://www.stj.jus.br/",
              },
            ],
          }),
        500
      )
    );
  }
}
