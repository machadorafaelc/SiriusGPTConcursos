export async function gerarPlano(params: {
  horasSemanais: number;
  prazoSemanas: number;
  disciplinas: string[];
  nivel: string;
}): Promise<{
  cronograma: {
    semana: number;
    foco: string;
    tarefas: string[];
  }[];
}> {
  // MOCK: gerar um plano básico simulado
  const { prazoSemanas, disciplinas, nivel } = params;

  const cronograma = [];

  for (let semana = 1; semana <= prazoSemanas; semana++) {
    const foco =
      disciplinas[semana % disciplinas.length] ?? "Revisão geral";

    cronograma.push({
      semana,
      foco: `${foco} (${nivel})`,
      tarefas: [
        `Estudar tópico ${semana} de ${foco}`,
        `Resolver 5 questões de ${foco}`,
        `Revisar anotações da semana anterior`,
      ],
    });
  }

  return { cronograma };
}
