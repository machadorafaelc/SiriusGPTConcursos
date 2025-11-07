import { agentRouter } from "../services/agentRouter";

export async function distribuirPlano(planoGerado: any) {
  const { disciplinas, aluno, metodoPrincipal, modulos } = planoGerado.planoEstudos;

  console.log("🚀 Iniciando distribuição do plano galáctico:", {
    aluno: aluno.nome,
    disciplinas: disciplinas.length,
    modulos: modulos.length
  });

  for (const disciplina of disciplinas) {
    const destino = `${disciplina.nome.replace(/\s/g, '')}GPT`;
    const payload = {
      destino,
      contexto: `Plano do aluno ${aluno.nome} – Módulo 1 (${modulos[0].nome})`,
      dados: {
        metodo: metodoPrincipal,
        cargaSemanal: disciplina.cargaSemanal,
        foco: modulos[0].nome,
        revisao: "1-7-30",
        observacoes: "Usar Pomodoro e Active Recall nas sessões diárias."
      }
    };
    
    console.log(`📤 Enviando plano para ${destino}:`, payload);
    await agentRouter.enviarPlanoParaAgentes(planoGerado, 'default');
  }

  console.log("✅ Distribuição do plano concluída!");
}
