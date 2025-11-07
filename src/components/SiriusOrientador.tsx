import React, { useState } from "react";
import { gerarPlano } from "../services/gerarPlano";
import { usePlano } from "../PlanoContext";
import { VegaChat } from "./VegaChat";
import { MessageSquare, Settings, Sparkles } from "lucide-react";

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
            onChange={(e) => setHoras(Number(e.target.value))}
            className="mt-1 w-full rounded-md bg-white/10 p-2 text-white"
          />
        </label>

        <label>
          Prazo (em semanas):
          <input
            type="number"
            value={prazo}
            onChange={(e) => setPrazo(Number(e.target.value))}
            className="mt-1 w-full rounded-md bg-white/10 p-2 text-white"
          />
        </label>

        <label>
          Nível:
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="mt-1 w-full rounded-md bg-white/10 p-2 text-white"
          >
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </label>

        <div>
          Disciplinas:
          <div className="mt-1 flex flex-wrap gap-2">
            {opcoesDisciplinas.map((d) => (
              <button
                key={d}
                onClick={() => toggleDisciplina(d)}
                className={`rounded-xl px-3 py-1 ${
                  disciplinas.includes(d)
                    ? "bg-emerald-600 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGerarPlano}
        className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
      >
        Gerar Plano
      </button>

      {cronograma.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold">Plano de Estudos</h3>
          {cronograma.map((semana) => (
            <div
              key={semana.semana}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h4 className="mb-2 font-bold">
                Semana {semana.semana}: {semana.foco}
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-white/90">
                {semana.tarefas.map((t, i) => (
                  <li key={i}>{t}</li>
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
