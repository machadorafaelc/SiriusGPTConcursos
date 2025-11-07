import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StudyPlan {
  // Informações do usuário
  userName: string;
  userEmail: string;
  
  // Configurações de estudo
  tempoEstudoDiario: number; // em horas
  disciplinaDaSemana: string;
  metodoEstudo: string;
  
  // Cronograma
  diasEstudo: string[]; // ['segunda', 'terça', etc]
  horarioPreferencial: string;
  
  // Objetivos
  concursoAlvo: string;
  cargoAlvo: string;
  dataProva?: string;
  
  // Metadata
  criadoEm: string;
  atualizadoEm: string;
  ativo: boolean;
}

interface StudyPlanContextType {
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan) => void;
  clearStudyPlan: () => void;
  hasActivePlan: boolean;
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined);

export function StudyPlanProvider({ children }: { children: React.ReactNode }) {
  const [studyPlan, setStudyPlanState] = useState<StudyPlan | null>(null);

  // Carregar plano do localStorage ao iniciar
  useEffect(() => {
    const savedPlan = localStorage.getItem('sirius_study_plan');
    if (savedPlan) {
      try {
        const plan = JSON.parse(savedPlan);
        setStudyPlanState(plan);
      } catch (error) {
        console.error('Erro ao carregar plano de estudos:', error);
      }
    }
  }, []);

  // Salvar plano no localStorage quando mudar
  const setStudyPlan = (plan: StudyPlan) => {
    const updatedPlan = {
      ...plan,
      atualizadoEm: new Date().toISOString(),
      ativo: true
    };
    setStudyPlanState(updatedPlan);
    localStorage.setItem('sirius_study_plan', JSON.stringify(updatedPlan));
  };

  const clearStudyPlan = () => {
    setStudyPlanState(null);
    localStorage.removeItem('sirius_study_plan');
  };

  const hasActivePlan = studyPlan !== null && studyPlan.ativo;

  return (
    <StudyPlanContext.Provider value={{ 
      studyPlan, 
      setStudyPlan, 
      clearStudyPlan,
      hasActivePlan 
    }}>
      {children}
    </StudyPlanContext.Provider>
  );
}

export function useStudyPlan() {
  const context = useContext(StudyPlanContext);
  if (context === undefined) {
    throw new Error('useStudyPlan must be used within a StudyPlanProvider');
  }
  return context;
}
