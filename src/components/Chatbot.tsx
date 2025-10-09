import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Brain, Send, RotateCcw, Calendar, Clock, Target, BookOpen, Sparkles, TrendingUp, FileText, Lightbulb, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { chatRag } from '../services/chat';

interface Citation {
  title: string;
  url: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isCard?: boolean;
  features?: boolean;
  citations?: Citation[];
  blocked?: boolean;
}

interface StudyPlanData {
  diasPorSemana: number;
  horasPorDia: number;
  nivel: number;
  totalMeses: number;
  totalHoras: number;
  currentMonth: number;
  disciplines: Array<{
    name: string;
    proporção: number;
    horas: number;
    color: string;
    icon: string;
    horasSemanais: string;
    dias: string[];
    sessao: string;
  }>;
  weeklySchedule: Array<{
    dia: string;
    disciplinas: string[];
    estrutura: string;
    horario: string;
  }>;
  monthlyModules: Array<{
    mes: string;
    foco: string;
    estrategia: string;
  }>;
  createdAt: string;
}

interface ChatbotProps {
  disciplina: string;
}

export function Chatbot({ disciplina }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [disciplineData, setDisciplineData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Campos de contexto para RAG
  const [concurso] = useState('Câmara dos Deputados - Policial Legislativo');
  const [banca] = useState('CESPE/CEBRASPE');
  const [assunto, setAssunto] = useState('');

  useEffect(() => {
    // Carregar dados do plano de estudos
    const savedPlan = localStorage.getItem('siriusStudyPlan');
    if (savedPlan) {
      const planData = JSON.parse(savedPlan);
      setStudyPlan(planData);
      
      // Encontrar dados específicos da disciplina
      const discData = planData.disciplines.find((d: any) => d.name === disciplina);
      setDisciplineData(discData);
      
      // Mensagem inicial contextualizada
      const initialMessage = getInitialMessage(disciplina, discData, planData);
      setMessages([initialMessage]);
    } else {
      // Fallback para quando não há plano salvo
      setMessages([
        {
          id: 1,
          text: `Olá, concurseiro(a)! 🌟\n\nEu sou o GPT especializado em ${disciplina}!\n\nPara oferecer a melhor experiência, recomendo que você primeiro configure seu plano de estudos geral com o GPT Orientador Sirius.\n\nEnquanto isso, posso te ajudar com dúvidas, exercícios e conteúdo sobre ${disciplina}!\n\nComo posso te auxiliar hoje?`,
          isBot: true
        }
      ]);
    }
  }, [disciplina]);

  const getInitialMessage = (disciplina: string, discData: any, planData: StudyPlanData) => {
    const icon = discData?.icon || '🌟';
    const horasTotal = discData?.horas || 0;
    const horasSemanais = discData?.horasSemanais || 'N/A';
    const diasEstudo = discData?.dias?.join(', ') || 'A definir';
    const sessaoDuracao = discData?.sessao || 'N/A';
    const nivel = planData.nivel;
    const mesAtual = planData.currentMonth || 1;
    const moduloAtual = planData.monthlyModules?.[mesAtual - 1];

    // Encontrar o dia específico da disciplina
    const diaEspecifico = planData.weeklySchedule?.find(schedule => 
      schedule.disciplinas.includes(disciplina)
    );

    let contextMessage = "";
    
    if (disciplina === 'Língua Portuguesa') {
      contextMessage = `Olá, concurseiro(a)! ${icon}\nSei que você vai estudar Língua Portuguesa por aproximadamente ${horasTotal}h ao longo de 6 meses, dedicando ${horasSemanais} semanais.\n\n📅 **Seu cronograma:** ${diasEstudo} (${sessaoDuracao} por sessão)\n🎯 **Etapa atual:** ${moduloAtual?.mes} - ${moduloAtual?.foco}\n📊 **Seu nível:** ${nivel}/10\n\nCom esse tempo, posso te ajudar a:\n\n• Priorizar temas de maior peso no edital\n• Gerar resumos semanais personalizados\n• Criar ciclos de revisão otimizados\n• Selecionar questões conforme seu progresso\n\nComo posso começar a te ajudar hoje?`;
    } else if (disciplina === 'Direito Constitucional') {
      contextMessage = `Saudações, explorador jurídico! ${icon}\nVocê tem ${horasTotal}h de estudo previstas para esta disciplina.\n\n📅 **Cronograma:** ${diasEstudo} (${sessaoDuracao} por sessão)\n🎯 **Etapa atual:** ${moduloAtual?.mes} - ${moduloAtual?.foco}\n📈 **Estratégia:** ${moduloAtual?.estrategia}\n\nVamos organizar esse tempo entre:\n\n• Leitura dirigida da CF/88\n• Questões comentadas e jurisprudência\n• Revisões de princípios fundamentais\n• Simulados mensais temáticos\n\nPor onde gostaria de começar nossa jornada constitucional?`;
    } else {
      contextMessage = `Olá, estudante! ${icon}\nEu sou seu GPT especializado em ${disciplina}.\n\n📊 **Configuração personalizada:**\n• ${horasTotal}h totais durante 6 meses\n• ${horasSemanais} semanais nos ${diasEstudo}\n• Sessões de ${sessaoDuracao} cada\n• Nível atual: ${nivel}/10\n\n🎯 **Etapa atual:** ${moduloAtual?.mes} - ${moduloAtual?.foco}\n📚 **Estratégia:** ${moduloAtual?.estrategia}\n\nEstou configurado para adaptar o conteúdo ao seu tempo e nível. Como posso te auxiliar hoje?`;
    }

    if (diaEspecifico) {
      contextMessage += `\n\n⏰ **Próxima sessão:** ${diaEspecifico.dia}\n${diaEspecifico.horario.split('\n').find(linha => linha.includes(disciplina)) || ''}`;
    }

    return {
      id: 1,
      text: contextMessage,
      isBot: true,
      features: true
    };
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Progresso Personalizado',
      description: `Acompanho seu desenvolvimento em ${disciplina} com base no seu tempo disponível`
    },
    {
      icon: FileText,
      title: 'Exercícios Direcionados',
      description: 'Questões selecionadas conforme seu nível e objetivos específicos'
    },
    {
      icon: Lightbulb,
      title: 'Resumos Inteligentes',
      description: 'Sínteses otimizadas para maximizar sua retenção de conteúdo'
    },
    {
      icon: Target,
      title: 'Foco no Edital',
      description: 'Conteúdo 100% alinhado com o edital da Câmara dos Deputados'
    }
  ];

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: currentInput,
      isBot: false
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Chamar API com RAG
      const response = await chatRag({
        message: currentInput,
        concurso,
        banca,
        disciplina,
        assunto: assunto || undefined
      });

      const botResponse: Message = {
        id: messages.length + 2,
        text: response.answer,
        isBot: true,
        citations: response.citations,
        blocked: response.citations.length === 0
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        isBot: true,
        citations: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    if (studyPlan && disciplineData) {
      const initialMessage = getInitialMessage(disciplina, disciplineData, studyPlan);
      setMessages([initialMessage]);
    } else {
      setMessages([
        {
          id: 1,
          text: `Olá! 🌟\n\nEu sou o GPT especializado em ${disciplina}.\n\nPara uma experiência personalizada, configure primeiro seu plano geral com o GPT Orientador Sirius.\n\nComo posso te ajudar hoje?`,
          isBot: true
        }
      ]);
    }
    setCurrentInput('');
  };

  const renderCitations = (citations: Citation[]) => (
    <div className="citations-panel">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <h4 className="text-cyan-200">Fontes consultadas</h4>
        <Badge className="badge-traceable">
          <ShieldCheck className="w-3 h-3" />
          Rastreável
        </Badge>
      </div>
      <div className="space-y-2">
        {citations.map((citation, index) => (
          <a
            key={index}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-sm"
          >
            <ExternalLink className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="text-cyan-100">{citation.title}</span>
          </a>
        ))}
      </div>
    </div>
  );

  const renderBlockedMessage = (retryFn: () => void) => (
    <div className="citations-panel border-yellow-600/30 bg-yellow-950/20">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <h4 className="text-yellow-200">Resposta sem fontes</h4>
      </div>
      <p className="text-yellow-100 text-sm mb-3">
        Esta resposta não possui fontes rastreáveis e foi bloqueada pela política de governança da IA.
      </p>
      <Button
        onClick={retryFn}
        size="sm"
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        Tentar novamente com RAG
      </Button>
    </div>
  );

  const renderFeatureCards = () => (
    <div className="w-full mb-4">
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <Card key={index} className="universe-card p-3">
            <div className="flex items-center space-x-2 mb-2">
              <feature.icon className="w-4 h-4 text-cyan-400" />
              <h4 className="text-white text-sm">{feature.title}</h4>
            </div>
            <p className="text-cyan-200 text-xs">{feature.description}</p>
          </Card>
        ))}
      </div>
      
      {studyPlan && disciplineData && (
        <Card className="universe-card mt-3 p-4 border-cyan-500/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{disciplineData.icon}</span>
                </div>
                <div>
                  <h3 className="text-white text-sm">Configuração Personalizada</h3>
                  <p className="text-cyan-200 text-xs">
                    {disciplineData.horasSemanais} semanais • {disciplineData.horas}h totais • Nível {studyPlan.nivel}/10
                  </p>
                </div>
              </div>
              <Badge 
                style={{ backgroundColor: disciplineData.color + '20', color: disciplineData.color }}
                className="text-xs"
              >
                {disciplineData.proporção}% do tempo
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded p-2">
                <span className="text-cyan-300">Dias: </span>
                <span className="text-white">{disciplineData.dias?.join(', ')}</span>
              </div>
              <div className="bg-slate-800/50 rounded p-2">
                <span className="text-cyan-300">Sessão: </span>
                <span className="text-white">{disciplineData.sessao}</span>
              </div>
            </div>

            {studyPlan.monthlyModules && studyPlan.currentMonth && (
              <div className="bg-slate-800/50 rounded p-2">
                <div className="text-xs">
                  <span className="text-cyan-300">Etapa atual: </span>
                  <span className="text-white">{studyPlan.monthlyModules[studyPlan.currentMonth - 1]?.mes} - {studyPlan.monthlyModules[studyPlan.currentMonth - 1]?.foco}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Campos de contexto */}
      <Card className="universe-card p-4">
        <h3 className="text-cyan-200 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Contexto da consulta
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-cyan-300 text-xs block mb-1">Concurso</label>
            <Input
              value={concurso}
              disabled
              className="bg-slate-900/50 border-cyan-800/30 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-cyan-300 text-xs block mb-1">Banca</label>
            <Input
              value={banca}
              disabled
              className="bg-slate-900/50 border-cyan-800/30 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-cyan-300 text-xs block mb-1">Assunto específico (opcional)</label>
            <Input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              placeholder="Ex: Concordância verbal"
              className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50 text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Área de mensagens */}
      <div className="universe-card backdrop-blur-sm h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            {message.features ? (
              <div className="w-full space-y-4">
                <div className="max-w-md px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90 text-white border border-cyan-400/30">
                  <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                </div>
                {renderFeatureCards()}
              </div>
            ) : (
              <div className="max-w-2xl w-full">
                <div className={`px-4 py-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90 text-white border border-cyan-400/30' 
                    : 'bg-slate-700/90 text-slate-100 border border-slate-600/50'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                </div>
                
                {/* Renderizar citações ou mensagem de bloqueio */}
                {message.isBot && message.citations && (
                  <>
                    {message.blocked ? (
                      renderBlockedMessage(() => handleSendMessage())
                    ) : message.citations.length > 0 ? (
                      renderCitations(message.citations)
                    ) : null}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-md space-y-2">
              <Skeleton className="h-4 w-64 bg-slate-700" />
              <Skeleton className="h-4 w-48 bg-slate-700" />
              <Skeleton className="h-4 w-56 bg-slate-700" />
            </div>
          </div>
        )}
      </div>
      
      {/* Input de mensagem */}
      <div className="flex space-x-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Pergunte sobre ${disciplina}... (Shift+Enter para quebra de linha)`}
          className="flex-1 bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/70 focus:border-cyan-400/50"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!currentInput.trim() || isLoading}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600"
        >
          <Send className="w-4 h-4" />
        </Button>
        <Button 
          onClick={resetChat}
          variant="outline"
          className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/30"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
