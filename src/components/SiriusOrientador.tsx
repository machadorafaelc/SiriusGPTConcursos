import { useState } from "react";
import { gerarPlano } from "../services/gerarPlano";
import { usePlano } from "../PlanoContext";
import { useStudyPlan } from "../StudyPlanContext";
import { useAuth } from "../AuthContext";
import { VegaChat } from "./VegaChat";
import { MessageSquare, Settings, Sparkles, CheckCircle } from "lucide-react";

export function VegaOrientador() {
  const [modo, setModo] = useState<"chat" | "formulario">("chat");
  const [horas, setHoras] = useState(10);
  const [prazo, setPrazo] = useState(8);
  const [nivel, setNivel] = useState("iniciante");
  const [disciplinas, setDisciplinas] = useState<string[]>([]);
  const [cronograma, setCronograma] = useState<
    { semana: number; foco: string; tarefas: string[] }[]
  >([]);
  const { setPlano } = usePlano();
  const { setStudyPlan } = useStudyPlan();
  const { userEmail } = useAuth();
  const [planoSalvo, setPlanoSalvo] = useState(false);

  const opcoesDisciplinas = [
    "Direito Administrativo",
    "Português – Gramática",
    "Raciocínio Lógico-Matemático",
  ];

  function toggleDisciplina(nome: string) {
    setDisciplinas((prev) =>
      prev.includes(nome)
        ? prev.filter((d) => d !== nome)
        : [...prev, nome]
    );
  }

  async function handleGerarPlano() {
    const plano = await gerarPlano({
      horasSemanais: horas,
      prazoSemanas: prazo,
      disciplinas,
      nivel,
    });
    setCronograma(plano.cronograma);

    // Organiza e salva o plano por disciplina no contexto global
    const porDisciplina: Record<string, typeof plano.cronograma> = {};
    plano.cronograma.forEach((s) => {
      const disciplina = s.foco.split(" (")[0];
      if (!porDisciplina[disciplina]) porDisciplina[disciplina] = [];
      porDisciplina[disciplina].push(s);
    });
    setPlano(porDisciplina);
    
    // Salva no StudyPlanContext para compartilhar com outros GPTs
    const disciplinaDaSemana = plano.cronograma.length > 0 ? plano.cronograma[0].foco : disciplinas[0] || "Não definida";
    
    setStudyPlan({
      userName: userEmail?.split('@')[0] || "Estudante",
      userEmail: userEmail || "",
      tempoEstudoDiario: horas / 7, // Converte horas semanais em diárias
      disciplinaDaSemana: disciplinaDaSemana,
      metodoEstudo: nivel === "iniciante" ? "Ciclo de estudos básico" : nivel === "intermediario" ? "Revisão espaçada" : "Resolução intensiva de questões",
      diasEstudo: ["segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
      horarioPreferencial: "Manhã",
      concursoAlvo: "Câmara dos Deputados",
      cargoAlvo: "Policial Legislativo Federal",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      ativo: true
    });
    
    setPlanoSalvo(true);
    setTimeout(() => setPlanoSalvo(false), 3000);
  }

  return (
    <div className="space-y-6 text-white">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-rose-500 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Vega Orientador
          </h2>
          <p className="text-white/70">Seu assistente pessoal para criar planos de estudos adaptativos</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setModo("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              modo === "chat"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Interativo
          </button>
          <button
            onClick={() => setModo("formulario")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              modo === "formulario"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Settings className="w-4 h-4" />
            Formulário
          </button>
        </div>
      </div>

      {/* Alerta de plano salvo */}
      {planoSalvo && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-100 font-medium">Plano de estudos criado com sucesso!</p>
            <p className="text-green-200/70 text-sm">Agora os GPTs especializados terão acesso ao seu plano personalizado.</p>
          </div>
        </div>
      )}

      {/* Conteúdo baseado no modo selecionado */}
      {modo === "chat" ? (
        <VegaChat />
      ) : (
        <div className="space-y-6">
          <p className="text-white/70">Informe seu perfil de estudo para gerar um plano adaptativo.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          Horas semanais:
          <input
            type="number"
            value={horas}
            onChange={(e) => setHoras(+e.target.value)}
            className="block w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </label>
        <label>
          Prazo (semanas):
          <input
            type="number"
            value={prazo}
            onChange={(e) => setPrazo(+e.target.value)}
            className="block w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </label>
      </div>

      <div>
        <label className="block mb-2">Nível de conhecimento:</label>
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="iniciante">Iniciante</option>
          <option value="intermediario">Intermediário</option>
          <option value="avancado">Avançado</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Disciplinas de interesse:</label>
        <div className="flex flex-wrap gap-2">
          {opcoesDisciplinas.map((d) => (
            <button
              key={d}
              onClick={() => toggleDisciplina(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                disciplinas.includes(d)
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGerarPlano}
        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
      >
        Gerar Plano de Estudos
      </button>

      {cronograma.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-bold text-white">Seu Cronograma</h3>
          {cronograma.map((s) => (
            <div
              key={s.semana}
              className="bg-slate-900/50 border border-blue-800/30 rounded-lg p-4"
            >
              <h4 className="font-semibold text-blue-300">
                Semana {s.semana}: {s.foco}
              </h4>
              <ul className="mt-2 space-y-1 text-white/70">
                {s.tarefas.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
        </div>
      )}
    </div>
  );
}
