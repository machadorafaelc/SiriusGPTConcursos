import { apiPost } from "./apiClient";

type Questao = {
  id: string;
  enunciado: string;
  alternativas: string[];
};

type SimuladorProvaResponse = {
  provaId: string;
  questoes: Questao[];
};

export async function simuladorProva(params: {
  banca: string;
  nivel: string;
  disciplinas: string[];
  qtd: number;
}): Promise<SimuladorProvaResponse> {
  try {
    return await apiPost<SimuladorProvaResponse>("/api/simulador", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            provaId: "prova-001",
            questoes: [
              {
                id: "q1",
                enunciado: "Questão sobre Direito Constitucional: Qual o artigo que trata dos direitos fundamentais?",
                alternativas: ["Art. 1º", "Art. 5º", "Art. 37", "Art. 144"],
              },
              {
                id: "q2",
                enunciado: "Questão sobre Língua Portuguesa: Identifique o erro gramatical:",
                alternativas: [
                  "Havia muitas pessoas na sala",
                  "Fazem dois anos que não o vejo",
                  "Devem existir soluções",
                  "Pode haver problemas",
                ],
              },
            ],
          }),
        600
      )
    );
  }
}
