import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, ArrowLeft, BookOpen, MessageSquare, FileText, BarChart3, ExternalLink, Sparkles } from 'lucide-react';
import { Chatbot } from './Chatbot';
import { VegaOrientador } from './SiriusOrientador';

type ViewType = 'concursos' | 'cargos' | 'disciplinas' | 'gpt' | 'orientador';

interface BreadcrumbItem {
  label: string;
  view: ViewType;
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState('concursos');
  const { isAuthenticated } = useAuth();
  const [selectedConcurso, setSelectedConcurso] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([
    { label: 'Concursos', view: 'concursos' }
  ]);

  const concursos: Array<{
    id: string;
    nome: string;
    descricao: string;
    status: string;
    cargos: string[];
  }> = [
    {
      id: 'camara-deputados',
      nome: 'Câmara dos Deputados',
      descricao: 'Concurso para Policial Legislativo Federal',
      status: 'Ativo',
      cargos: ['Policial Legislativo Federal']
    }
  ];

  const disciplinas: Record<string, Array<{ nome: string; topicos: number; exercicios: number }>> = {
    'Policial Legislativo Federal': [
      { nome: 'Língua Portuguesa', topicos: 17, exercicios: 2340 },
      { nome: 'Raciocínio Lógico-Matemático', topicos: 12, exercicios: 1890 },
      { nome: 'Direito Constitucional', topicos: 18, exercicios: 3120 },
      { nome: 'Direito Administrativo', topicos: 22, exercicios: 2780 },
      { nome: 'Direito Penal', topicos: 16, exercicios: 2456 },
      { nome: 'Direito Processual Penal', topicos: 14, exercicios: 1923 },
      { nome: 'Legislação Penal Especial', topicos: 25, exercicios: 3456 },
      { nome: 'Direitos Humanos', topicos: 8, exercicios: 945 },
      { nome: 'Informática', topicos: 20, exercicios: 2234 },
      { nome: 'Direito Digital', topicos: 12, exercicios: 1567 },
      { nome: 'Língua Inglesa', topicos: 10, exercicios: 1234 },
      { nome: 'Inteligência', topicos: 6, exercicios: 678 },
      { nome: 'Segurança de Dignitários', topicos: 8, exercicios: 567 },
      { nome: 'Segurança Orgânica', topicos: 7, exercicios: 789 },
      { nome: 'Relações Humanas', topicos: 5, exercicios: 456 },
      { nome: 'Defesa Pessoal', topicos: 4, exercicios: 234 },
      { nome: 'Armamento e Tiro', topicos: 6, exercicios: 345 },
      { nome: 'Técnicas de Negociação', topicos: 9, exercicios: 567 }
    ]
  };

  const gptFeatures: Array<{ icon: any; label: string; description: string }> = [
    { icon: MessageSquare, label: 'Chat Interativo', description: 'Tire dúvidas em tempo real' },
    { icon: FileText, label: 'Exercícios', description: 'Milhares de questões comentadas' },
    { icon: BookOpen, label: 'Resumos', description: 'Construção automática de resumos' },
    { icon: BarChart3, label: 'Progresso', description: 'Acompanhe sua evolução' },
    { icon: ExternalLink, label: 'Links Diretos', description: 'Acesso a plataformas de questões' }
  ];

  const navigateTo = (view: ViewType, data?: any) => {
    const newBreadcrumb = [...breadcrumb];
    
        switch (view) {
          case 'orientador':
            setCurrentView('orientador');
            newBreadcrumb.push({ label: 'GPT Orientador Vega', view: 'orientador' });
            break;
      case 'cargos':
        setSelectedConcurso(data.id);
        setCurrentView('cargos');
        newBreadcrumb.push({ label: data.nome, view: 'cargos' });
        break;
      case 'disciplinas':
        setSelectedCargo(data);
        setCurrentView('disciplinas');
        newBreadcrumb.push({ label: data, view: 'disciplinas' });
        break;
      case 'gpt':
        setSelectedDisciplina(data.nome);
        setCurrentView('gpt');
        newBreadcrumb.push({ label: data.nome, view: 'gpt' });
        break;
    }
    
    setBreadcrumb(newBreadcrumb);
  };

  const navigateBack = (targetView: ViewType) => {
    const targetIndex = breadcrumb.findIndex(item => item.view === targetView);
    if (targetIndex !== -1) {
      setBreadcrumb(breadcrumb.slice(0, targetIndex + 1));
      setCurrentView(targetView);
      
      if (targetView === 'concursos') {
        setSelectedConcurso('');
        setSelectedCargo('');
        setSelectedDisciplina('');
      } else if (targetView === 'cargos') {
        setSelectedCargo('');
        setSelectedDisciplina('');
      } else if (targetView === 'disciplinas') {
        setSelectedDisciplina('');
      }
    }
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 mb-6 text-sm">
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="text-vega-text-2 mx-2">/</span>}
          <button
            onClick={() => navigateBack(item.view)}
            className="text-vega-neon hover:text-vega-text transition-colors"
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );

  const renderConcursos = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl text-vega-text mb-2">Seja Bem-vindo ao Vega GPT Concursos!</h2>
        <p className="text-vega-text-2">Configure seu plano de estudos ou explore diretamente as disciplinas</p>
      </div>

          {/* GPT Orientador Card */}
          <Card className="vega-card mb-6">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-vega-cta rounded-full flex items-center justify-center shadow-vega-cta">
                    <div className="w-14 h-14 bg-vega-bg rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-vega-text" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-vega-neon rounded-full animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-vega-neon">
                    🌟 GPT Orientador Vega
                  </CardTitle>
                  <CardDescription className="text-vega-text-2 text-lg">
                    Configure seu plano personalizado de estudos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-vega-text-2 mb-4">
                Comece criando um plano de estudos personalizado que será usado por todos os GPTs especializados.
                O Orientador Vega analisa seu perfil e tempo disponível para otimizar sua jornada de aprovação.
              </p>
              <Button
                onClick={() => navigateTo('orientador')}
                className="w-full vega-btn py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Acessar GPT Orientador
              </Button>
            </CardContent>
          </Card>

      
      <div className="grid gap-6">
        {concursos.map((concurso) => (
          <Card key={concurso.id} className="vega-card hover:brightness-110 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-vega-text text-xl">{concurso.nome}</CardTitle>
                  <CardDescription className="text-vega-text-2 mt-2">
                    {concurso.descricao}
                  </CardDescription>
                </div>
                <Badge className="bg-vega-neon/20 text-vega-neon border border-vega-neon/50">
                  {concurso.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {concurso.cargos.map((cargo) => (
                  <Badge key={cargo} variant="secondary" className="bg-vega-bg/50 text-vega-text-2 border-vega-border">
                    {cargo}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={() => navigateTo('cargos', concurso)}
                className="w-full vega-btn"
              >
                Explorar Concurso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCargos = () => {
    const concurso = concursos.find(c => c.id === selectedConcurso);
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl text-vega-text mb-2">Escolha seu Cargo</h2>
          <p className="text-vega-text-2">Selecione o cargo específico para ver as disciplinas</p>
        </div>
        
        <div className="grid gap-4">
          {concurso?.cargos.map((cargo) => (
            <Card key={cargo} className="vega-card hover:brightness-110 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-vega-text">{cargo}</CardTitle>
                <CardDescription className="text-vega-text-2">
                  {disciplinas[cargo as keyof typeof disciplinas]?.length || 0} disciplinas disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('disciplinas', cargo)}
                  className="w-full vega-btn"
                >
                  Ver Disciplinas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDisciplinas = () => {
    const disciplinasList = disciplinas[selectedCargo as keyof typeof disciplinas] || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl text-vega-text mb-2">GPTs por Disciplina</h2>
          <p className="text-vega-text-2">Cada GPT é especializado em uma disciplina específica</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplinasList.map((disciplina, index) => (
            <Card key={index} className="vega-card hover:brightness-110 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-vega-cta rounded-lg flex items-center justify-center shadow-vega-cta">
                    <Brain className="w-4 h-4 text-vega-text" />
                  </div>
                  <CardTitle className="text-vega-text text-lg">{disciplina.nome}</CardTitle>
                </div>
                <div className="flex space-x-4 text-sm text-vega-neon">
                  <span>{disciplina.topicos} tópicos</span>
                  <span>{disciplina.exercicios} exercícios</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => isAuthenticated ? navigateTo('gpt', disciplina) : alert('Faça login para acessar os GPTs.')}
                  className="w-full vega-btn"
                >
                  Acessar GPT
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderGPT = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-vega-cta rounded-xl flex items-center justify-center shadow-vega-cta">
            <Brain className="w-6 h-6 text-vega-text" />
          </div>
          <h2 className="text-3xl text-vega-text">GPT - {selectedDisciplina}</h2>
        </div>
        <p className="text-vega-text-2">Seu assistente de estudos especializado</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gptFeatures.map((feature, index) => (
          <Card key={index} className="vega-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <feature.icon className="w-5 h-5 text-vega-neon" />
                <h3 className="text-vega-text">{feature.label}</h3>
              </div>
              <p className="text-vega-text-2 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="vega-card">
        <CardHeader>
          <CardTitle className="text-vega-text">Interface do Chat</CardTitle>
          <CardDescription className="text-vega-text-2">
            Seu assistente especializado em {selectedDisciplina}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Chatbot disciplina={selectedDisciplina} />
        </CardContent>
      </Card>
    </div>
  );

  const renderOrientador = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-vega-cta rounded-full flex items-center justify-center shadow-vega-cta">
              <div className="w-14 h-14 bg-vega-bg rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-vega-text" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-vega-neon rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl text-vega-neon">
              GPT Orientador Vega
            </h2>
            <p className="text-vega-text-2">Criador de planos personalizados de estudo</p>
          </div>
        </div>
      </div>

      <Card className="vega-card">
        <CardHeader>
          <CardTitle className="text-vega-text">Interface do Orientador</CardTitle>
          <CardDescription className="text-vega-text-2">
            Configure seu plano de estudos personalizado para a Câmara dos Deputados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VegaOrientador />
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="min-h-screen bg-vega-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderBreadcrumb()}
        
            {currentView === 'concursos' && renderConcursos()}
            {currentView === 'orientador' && renderOrientador()}
            {currentView === 'cargos' && renderCargos()}
            {currentView === 'disciplinas' && renderDisciplinas()}
            {currentView === 'gpt' && renderGPT()}
      </div>
    </div>
  );
}