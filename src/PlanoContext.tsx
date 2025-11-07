import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
  } from "react";
  
  type SemanaDeEstudo = {
    semana: number;
    foco: string;
    tarefas: string[];
  };
  
  type PlanoPorDisciplina = Record<string, SemanaDeEstudo[]>;
  
  type PlanoContextType = {
    plano: PlanoPorDisciplina;
    setPlano: (p: PlanoPorDisciplina) => void;
    getPlanoDaDisciplina: (disciplina: string) => SemanaDeEstudo[] | null;
  };
  
  const PlanoContext = createContext<PlanoContextType | undefined>(undefined);
  
  export function PlanoProvider({ children }: { children: ReactNode }) {
    const [plano, setPlano] = useState<PlanoPorDisciplina>({});
  
    function getPlanoDaDisciplina(disciplina: string) {
      return plano[disciplina] ?? null;
    }
  
    return (
      <PlanoContext.Provider value={{ plano, setPlano, getPlanoDaDisciplina }}>
        {children}
      </PlanoContext.Provider>
    );
  }
  
  export function usePlano() {
    const ctx = useContext(PlanoContext);
    if (!ctx) {
      throw new Error("usePlano precisa estar dentro de <PlanoProvider>");
    }
    return ctx;
  }
  