import { apiPost } from "./apiClient";

type Resposta = {
  questaoId: string;
  alternativa: string;
  correta: boolean;
};

type AnalisarDesempenhoResponse = {
  acertos: number;
  erros: number;
  recomendacoes: string[];
};

export async function analisarDesempenho(params: {
  usuarioId: string;
  respostas: Resposta[];
}): Promise<AnalisarDesempenhoResponse> {
  try {
    return await apiPost<AnalisarDesempenhoResponse>("/api/analisar-desempenho", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            acertos: 7,
            erros: 3,
            recomendacoes: [
              "Revisar Direito Constitucional - Arts. 1º a 5º",
              "Praticar mais questões de Língua Portuguesa - Concordância verbal",
              "Focar em Raciocínio Lógico - Proposições compostas",
            ],
          }),
        500
      )
    );
  }
}
