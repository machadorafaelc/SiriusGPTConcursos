import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, BookOpen, Target, Zap } from 'lucide-react';
import { Header } from './Header';

interface LandingPageProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export function LandingPage({ onLoginClick, isAuthenticated, userEmail, onLogout }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "GPTs Especializados",
      description: "Inteligência artificial treinada especificamente para cada disciplina de concurso"
    },
    {
      icon: BookOpen,
      title: "Milhares de Exercícios",
      description: "Base de dados com questões de provas anteriores e exercícios direcionados"
    },
    {
      icon: Target,
      title: "Foco no Objetivo",
      description: "Estudo direcionado para concursos específicos e cargos desejados"
    },
    {
      icon: Zap,
      title: "Resultados Rápidos",
      description: "Metodologia otimizada para maximizar seu aproveitamento"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <Header 
        onLoginClick={onLoginClick}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src="figma:asset/615da908da1190e89d265469d04ec183c76d51ba.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-900/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              <span className="text-blue-200">Sistema em funcionamento</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              O Universo da
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Sua Aprovação
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore o cosmos dos concursos públicos com GPTs especializados, 
              milhões de dados de concursos específicos e o caminho para sua aprovação.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 px-4 py-2 border border-blue-400/30">
                🤖 GPTs Especializados
              </Badge>
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 px-4 py-2 border border-purple-400/30">
                📚 Conteúdo Direcionado
              </Badge>
              <Badge variant="secondary" className="bg-indigo-900/50 text-indigo-200 px-4 py-2 border border-indigo-400/30">
                🎯 Resultados Comprovados
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 via-blue-950 to-purple-950 relative">
        <div className="absolute inset-0 opacity-20">
          <img
            src="figma:asset/e0ddc240a8b4b42f367ea2e49a4fdf6cc506e2cf.png"
            alt="Galaxy background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Como Funciona o Sistema
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Nossa plataforma utiliza GPTs especializados para cada disciplina, 
              criando uma experiência de estudo personalizada e eficiente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-900/50 border-blue-800/30 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-200">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-gradient-to-b from-purple-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Explore os GPTs Disponíveis
            </h2>
            <p className="text-xl text-blue-100">
              Cada GPT é especializado em uma disciplina específica do seu concurso
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 opacity-20 rounded-2xl blur-xl" />
            <Card className="bg-slate-900/50 border-blue-800/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">Concurso Câmara dos Deputados</CardTitle>
                    <CardDescription className="text-blue-200">Cargo: Policial Legislativo</CardDescription>
                  </div>
                  <Badge className="bg-blue-900/50 text-blue-300 border border-blue-400/50">
                    Disponível
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Língua Portuguesa", "Raciocínio Lógico", "Direito Constitucional",
                    "Direito Administrativo", "Direito Penal", "Direito Processual Penal",
                    "Direitos Humanos", "Informática", "Inglês"
                  ].map((disciplina, index) => (
                    <div 
                      key={index}
                      className="bg-slate-800/50 border border-blue-800/30 rounded-lg p-3 hover:bg-slate-800/70 hover:border-blue-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-100">{disciplina}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
