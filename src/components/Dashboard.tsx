import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, ArrowLeft, BookOpen, MessageSquare, FileText, BarChart3, ExternalLink, Sparkles, Wrench } from 'lucide-react';
import { Chatbot } from './Chatbot';
import { SiriusOrientador } from './SiriusOrientador';
import { Ferramentas } from './Ferramentas';

type ViewType = 'concursos' | 'cargos' | 'disciplinas' | 'gpt' | 'orientador' | 'ferramentas';

interface BreadcrumbItem {
  label: string;
  view: ViewType;
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('concursos');
  const [selectedConcurso, setSelectedConcurso] = useState<string>('');
  const [selectedCargo, setSelectedCargo] = useState<string>('');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('');
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { label: 'Concursos', view: 'concursos' }
  ]);

  const concursos = [
    {
      id: 'camara-deputados',
      nome: 'Câmara dos Deputados',
      descricao: 'Concurso para cargos do Poder Legislativo Federal',
      status: 'Ativo',
      cargos: ['Policial Legislativo', 'Analista Legislativo', 'Técnico Legislativo']
    }
  ];

  const disciplinas = {
    'Policial Legislativo': [
      { nome: 'Língua Portuguesa', topicos: 15, exercicios: 2340 },
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

  const gptFeatures = [
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
        newBreadcrumb.push({ label: 'GPT Orientador Sirius', view: 'orientador' });
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
          {index > 0 && <span className="text-slate-400 mx-2">/</span>}
          <button
            onClick={() => navigateBack(item.view)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
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
        <h2 className="text-3xl text-white mb-2">Seja Bem-vindo ao Sirius GPT Concursos!</h2>
        <p className="text-blue-200">Configure seu plano de estudos ou explore diretamente as disciplinas</p>
      </div>

      {/* GPT Orientador Card */}
      <Card className="bg-gradient-to-br from-blue-950/70 to-purple-950/70 border-cyan-400/40 backdrop-blur-sm mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-blue-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-cyan-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                🌟 GPT Orientador Sirius
              </CardTitle>
              <CardDescription className="text-blue-200 text-lg">
                Configure seu plano personalizado de estudos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-100 mb-4">
            Comece criando um plano de estudos personalizado que será usado por todos os GPTs especializados.
            O Orientador Sirius analisa seu perfil e tempo disponível para otimizar sua jornada de aprovação.
          </p>
          <Button 
            onClick={() => navigateTo('orientador')}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Acessar GPT Orientador
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30 mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                🔧 Ferramentas de Estudo
              </CardTitle>
              <CardDescription className="text-purple-200 text-lg">
                Potencialize seus estudos com ferramentas especializadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100 mb-4">
            Acesse consulta de editais, busca de jurisprudência, simuladores de prova e análise de desempenho.
            Todas integradas com RAG e governança de IA.
          </p>
          <Button 
            onClick={() => navigateTo('ferramentas')}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 py-3"
          >
            <Wrench className="w-5 h-5 mr-2" />
            Acessar Ferramentas
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-6">
        {concursos.map((concurso) => (
          <Card key={concurso.id} className="bg-slate-900/50 border-blue-800/30 hover:bg-slate-900/70 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl">{concurso.nome}</CardTitle>
                  <CardDescription className="text-blue-200 mt-2">
                    {concurso.descricao}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                  {concurso.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {concurso.cargos.map((cargo) => (
                  <Badge key={cargo} variant="secondary" className="bg-blue-800/30 text-blue-200 border-blue-600/30">
                    {cargo}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={() => navigateTo('cargos', concurso)}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600"
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
          <h2 className="text-3xl text-white mb-2">Escolha seu Cargo</h2>
          <p className="text-slate-300">Selecione o cargo específico para ver as disciplinas</p>
        </div>
        
        <div className="grid gap-4">
          {concurso?.cargos.map((cargo) => (
            <Card key={cargo} className="bg-slate-900/50 border-blue-800/30 hover:bg-slate-900/70 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white">{cargo}</CardTitle>
                <CardDescription className="text-blue-200">
                  {disciplinas[cargo as keyof typeof disciplinas]?.length || 0} disciplinas disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('disciplinas', cargo)}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600"
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
          <h2 className="text-3xl text-white mb-2">GPTs por Disciplina</h2>
          <p className="text-slate-300">Cada GPT é especializado em uma disciplina específica</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplinasList.map((disciplina, index) => (
            <Card key={index} className="bg-slate-900/50 border-blue-800/30 hover:bg-slate-900/70 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">{disciplina.nome}</CardTitle>
                </div>
                <div className="flex space-x-4 text-sm text-blue-300">
                  <span>{disciplina.topicos} tópicos</span>
                  <span>{disciplina.exercicios} exercícios</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('gpt', disciplina)}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600"
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-white">GPT - {selectedDisciplina}</h2>
        </div>
        <p className="text-blue-200">Seu assistente de estudos especializado</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gptFeatures.map((feature, index) => (
          <Card key={index} className="bg-slate-900/50 border-blue-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <feature.icon className="w-5 h-5 text-blue-400" />
                <h3 className="text-white">{feature.label}</h3>
              </div>
              <p className="text-blue-100 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-white">Interface do Chat</CardTitle>
          <CardDescription className="text-blue-200">
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-blue-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-300" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              GPT Orientador Sirius
            </h2>
            <p className="text-blue-200">Criador de planos personalizados de estudo</p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-white">Interface do Orientador</CardTitle>
          <CardDescription className="text-blue-200">
            Configure seu plano de estudos personalizado para a Câmara dos Deputados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SiriusOrientador />
        </CardContent>
      </Card>
    </div>
  );

  const renderFerramentas = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-white">Ferramentas de Estudo</h2>
        </div>
        <p className="text-purple-200">Recursos avançados para otimizar sua preparação</p>
      </div>

      <Ferramentas />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 cosmic-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderBreadcrumb()}
        
        {currentView === 'concursos' && renderConcursos()}
        {currentView === 'orientador' && renderOrientador()}
        {currentView === 'cargos' && renderCargos()}
        {currentView === 'disciplinas' && renderDisciplinas()}
        {currentView === 'gpt' && renderGPT()}
        {currentView === 'ferramentas' && renderFerramentas()}
      </div>
    </div>
  );
}