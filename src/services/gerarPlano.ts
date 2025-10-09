import { apiPost } from "./apiClient";

type Semana = {
  semana: number;
  foco: string;
  tarefas: string[];
};

type GerarPlanoResponse = {
  cronograma: Semana[];
};

export async function gerarPlano(params: {
  horasSemanais: number;
  prazoSemanas: number;
  disciplinas: string[];
  nivel: string;
}): Promise<GerarPlanoResponse> {
  try {
    return await apiPost<GerarPlanoResponse>("/api/plano", params);
  } catch {
    // MOCK (remover quando API existir)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            cronograma: [
              {
                semana: 1,
                foco: "Direito Constitucional - Princípios Fundamentais",
                tarefas: [
                  "Leitura: Arts. 1º a 4º da CF/88",
                  "Resolver 20 questões de fixação",
                  "Criar resumo em fichas",
                  "Assistir videoaula sobre República e Democracia",
                ],
              },
              {
                semana: 2,
                foco: "Direito Constitucional - Direitos Fundamentais",
                tarefas: [
                  "Leitura: Art. 5º da CF/88 (incisos I a XXXV)",
                  "Resolver 30 questões de fixação",
                  "Criar mapas mentais",
                  "Revisar súmulas do STF",
                ],
              },
              {
                semana: 3,
                foco: "Língua Portuguesa - Compreensão e Interpretação",
                tarefas: [
                  "Resolver 15 textos com questões",
                  "Praticar técnicas de leitura dinâmica",
                  "Identificar tipologias textuais",
                  "Revisar conectivos e coesão",
                ],
              },
              {
                semana: 4,
                foco: "Raciocínio Lógico - Proposições",
                tarefas: [
                  "Estudar conceitos básicos de lógica",
                  "Resolver 25 questões de proposições simples",
                  "Praticar tabelas-verdade",
                  "Resolver questões de negação",
                ],
              },
            ],
          }),
        700
      )
    );
  }
}
