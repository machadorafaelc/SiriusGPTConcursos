import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Brain, Send, RotateCcw, Calendar, Clock, Target, BookOpen, Save, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isCard?: boolean;
  cardData?: StudyPlan;
}

interface StudyPlan {
  diasPorSemana: number;
  horasPorDia: number;
  nivel: number;
  totalMeses: number;
  totalHoras: number;
}

interface DisciplineData {
  name: string;
  proporção: number;
  horas: number;
  color: string;
  icon: string;
  horasSemanais: string;
  dias: string[];
  sessao: string;
}

export function SiriusOrientador() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá, concurseiro(a)! 👋✨\nMe ajude a te guiar de uma forma mais interessante!\n\nMe responda:\n\n1️⃣ Quantos dias na semana você pretende se dedicar aos estudos?\n2️⃣ Quanto tempo por dia?",
      isBot: true
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [step, setStep] = useState(1);
  const [studyData, setStudyData] = useState<Partial<StudyPlan>>({});

  const disciplineDistribution: DisciplineData[] = [
    { name: 'Língua Portuguesa', proporção: 18, horas: 0, color: '#3B82F6', icon: '📚', horasSemanais: '2h40', dias: ['Segunda'], sessao: '1h' },
    { name: 'Raciocínio Lógico-Matemático', proporção: 10, horas: 0, color: '#8B5CF6', icon: '🧮', horasSemanais: '1h30', dias: ['Segunda'], sessao: '45min' },
    { name: 'Direito Constitucional', proporção: 12, horas: 0, color: '#06B6D4', icon: '⚖️', horasSemanais: '1h50', dias: ['Segunda'], sessao: '1h15' },
    { name: 'Direito Administrativo', proporção: 12, horas: 0, color: '#10B981', icon: '🏛️', horasSemanais: '1h50', dias: ['Terça'], sessao: '1h30' },
    { name: 'Direito Penal', proporção: 8, horas: 0, color: '#F59E0B', icon: '🚨', horasSemanais: '1h10', dias: ['Terça'], sessao: '1h30' },
    { name: 'Direito Processual Penal', proporção: 8, horas: 0, color: '#EF4444', icon: '⚡', horasSemanais: '1h10', dias: ['Quarta'], sessao: '1h30' },
    { name: 'Legislação Penal Especial', proporção: 8, horas: 0, color: '#EC4899', icon: '📋', horasSemanais: '1h10', dias: ['Quarta'], sessao: '1h30' },
    { name: 'Direitos Humanos', proporção: 4, horas: 0, color: '#14B8A6', icon: '🤝', horasSemanais: '40min', dias: ['Quinta'], sessao: '1h' },
    { name: 'Informática', proporção: 5, horas: 0, color: '#6366F1', icon: '💻', horasSemanais: '45min', dias: ['Quinta'], sessao: '1h' },
    { name: 'Direito Digital', proporção: 4, horas: 0, color: '#8B5CF6', icon: '🌐', horasSemanais: '40min', dias: ['Quinta'], sessao: '1h' },
    { name: 'Inglês', proporção: 3, horas: 0, color: '#F97316', icon: '🗣️', horasSemanais: '30min', dias: ['Sexta'], sessao: '45min' },
    { name: 'Conhecimentos Específicos', proporção: 8, horas: 0, color: '#84CC16', icon: '🎯', horasSemanais: '1h10', dias: ['Sexta'], sessao: '1h15' }
  ];

  const weeklySchedule = [
    {
      dia: 'Segunda-feira',
      disciplinas: ['Língua Portuguesa', 'Raciocínio Lógico-Matemático', 'Direito Constitucional'],
      estrutura: '1h Português + 45min Lógico + 1h15 Constitucional',
      horario: '08:00–09:00 → Língua Portuguesa\n09:00–09:45 → Raciocínio Lógico\n10:00–11:15 → Direito Constitucional'
    },
    {
      dia: 'Terça-feira', 
      disciplinas: ['Direito Administrativo', 'Direito Penal'],
      estrutura: '1h30 Administrativo + 1h30 Penal',
      horario: '08:00–09:30 → Direito Administrativo\n09:45–11:15 → Direito Penal'
    },
    {
      dia: 'Quarta-feira',
      disciplinas: ['Direito Processual Penal', 'Legislação Penal Especial'],
      estrutura: '1h30 cada',
      horario: '08:00–09:30 → Direito Processual Penal\n09:45–11:15 → Legislação Penal Especial'
    },
    {
      dia: 'Quinta-feira',
      disciplinas: ['Informática', 'Direito Digital', 'Direitos Humanos'],
      estrutura: '1h Informática + 1h Digital + 1h Direitos Humanos',
      horario: '08:00–09:00 → Informática\n09:00–10:00 → Direito Digital\n10:00–11:00 → Direitos Humanos'
    },
    {
      dia: 'Sexta-feira',
      disciplinas: ['Inglês', 'Conhecimentos Específicos', 'Revisão Integrada'],
      estrutura: '45min Inglês + 1h15 Conhecimentos Específicos + 1h Revisão',
      horario: '08:00–08:45 → Inglês\n08:45–10:00 → Conhecimentos Específicos\n10:15–11:15 → Revisão Integrada'
    }
  ];

  const monthlyModules = [
    { mes: '1º mês', foco: 'Fundamentos e Leitura da Lei Seca', estrategia: 'Leitura dirigida + anotações + 10 questões diárias' },
    { mes: '2º mês', foco: 'Interpretação e Compreensão', estrategia: 'Análise textual, interpretação e primeiros simulados' },
    { mes: '3º mês', foco: 'Consolidação teórica', estrategia: 'Revisões semanais + exercícios intermediários' },
    { mes: '4º mês', foco: 'Questões e jurisprudência', estrategia: 'Prática intensiva + fichas-resumo automáticas' },
    { mes: '5º mês', foco: 'Revisão avançada', estrategia: 'Ciclos curtos + simulados temáticos' },
    { mes: '6º mês', foco: 'Simulados gerais + Redação oficial', estrategia: 'Simulações de prova e refinamento de tempo/resumo' }
  ];

  const calculateHours = (data: StudyPlan) => {
    const totalHoras = data.diasPorSemana * data.horasPorDia * 4 * data.totalMeses;
    return disciplineDistribution.map(disc => ({
      ...disc,
      horas: Math.round((totalHoras * disc.proporção) / 100)
    }));
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: currentInput,
      isBot: false
    };

    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      let botResponse: Message;

      if (step === 1) {
        const match = currentInput.match(/(\d+).*?(\d+)/);
        if (match) {
          setStudyData(prev => ({
            ...prev,
            diasPorSemana: parseInt(match[1]),
            horasPorDia: parseInt(match[2])
          }));
        }

        botResponse = {
          id: messages.length + 2,
          text: "Perfeito! 🚀\nPosso montar seu plano de estudos?\nPara isso, me conte seu nível pessoal de conhecimento da nossa disciplina (de 0 a 10).",
          isBot: true
        };
        setStep(2);
      } else if (step === 2) {
        const nivel = parseInt(currentInput);
        const finalData: StudyPlan = {
          ...studyData,
          nivel,
          totalMeses: 6,
          totalHoras: 0
        } as StudyPlan;

        const totalHoras = finalData.diasPorSemana * finalData.horasPorDia * 4 * finalData.totalMeses;
        finalData.totalHoras = totalHoras;

        setStudyData(finalData);

        botResponse = {
          id: messages.length + 2,
          text: "Entendido! 🌠\nAqui está seu plano de estudos personalizado, com base no edital da Câmara dos Deputados — Cargo: Policial Legislativo.",
          isBot: true
        };

        setTimeout(() => {
          const cardMessage: Message = {
            id: messages.length + 3,
            text: "",
            isBot: true,
            isCard: true,
            cardData: finalData
          };
          setMessages(prev => [...prev, cardMessage]);
        }, 1000);

        setStep(3);
      } else {
        botResponse = {
          id: messages.length + 2,
          text: "🌟 Seu plano foi atualizado, viajante do conhecimento!\nVocê percorrerá 15 horas de estudo distribuídas entre 12 disciplinas semanalmente.\n\nTodos os seus GPTs já sabem quando e quanto tempo têm com você — e cada um está programado para extrair o máximo de aprendizado dentro desse período.\n\nQue a constância seja sua propulsão. 🚀✨",
          isBot: true
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Olá, concurseiro(a)! 👋✨\nMe ajude a te guiar de uma forma mais interessante!\n\nMe responda:\n\n1️⃣ Quantos dias na semana você pretende se dedicar aos estudos?\n2️⃣ Quanto tempo por dia?",
        isBot: true
      }
    ]);
    setStep(1);
    setStudyData({});
    setCurrentInput('');
  };

  const saveStudyPlan = () => {
    // Salvar no localStorage para usar nos GPTs de disciplina
    const disciplinesWithHours = calculateHours(studyData as StudyPlan);
    const planData = {
      ...studyData,
      disciplines: disciplinesWithHours,
      weeklySchedule,
      monthlyModules,
      currentMonth: 1,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('siriusStudyPlan', JSON.stringify(planData));
    
    // Mostrar feedback
    const feedbackMessage: Message = {
      id: messages.length + 1,
      text: "✅ Plano salvo com sucesso!\n\n🌌 **Seus GPTs já estão configurados com:**\n• Cronograma semanal personalizado\n• Etapa atual de cada disciplina\n• Tempo dedicado e nível informado\n• Integração entre as matérias\n\nAgora você pode acessar qualquer GPT de disciplina e começar sua jornada galática rumo à aprovação! 🚀✨\n\n*Lembre-se: este plano pode ser ajustado a qualquer momento conforme sua evolução.*",
      isBot: true
    };
    setMessages(prev => [...prev, feedbackMessage]);
  };

  const renderStudyPlanCard = (data: StudyPlan) => {
    const disciplinesWithHours = calculateHours(data);
    
    return (
      <Card className="bg-gradient-to-br from-blue-950/80 to-purple-950/80 border-cyan-400/40 backdrop-blur-sm max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-blue-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                🌌 Plano Galáctico de Estudos
              </CardTitle>
              <p className="text-blue-200 text-sm">Câmara dos Deputados — Policial Legislativo</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-300" />
                <span className="text-blue-200 text-sm">Duração</span>
              </div>
              <p className="text-white">{data.totalMeses} meses</p>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm">Carga diária</span>
              </div>
              <p className="text-white">{data.horasPorDia}h por dia</p>
            </div>
            <div className="bg-cyan-900/30 rounded-lg p-3 border border-cyan-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-cyan-300" />
                <span className="text-cyan-200 text-sm">Frequência</span>
              </div>
              <p className="text-white">{data.diasPorSemana} dias/semana</p>
            </div>
            <div className="bg-pink-900/30 rounded-lg p-3 border border-pink-500/30">
              <div className="flex items-center space-x-2 mb-1">
                <BookOpen className="w-4 h-4 text-pink-300" />
                <span className="text-pink-200 text-sm">Total</span>
              </div>
              <p className="text-white">{data.totalHoras}h estimadas</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gráfico de Pizza */}
            <div className="bg-slate-900/40 rounded-lg p-6 border border-blue-800/30">
              <h3 className="text-white mb-4 text-center">📊 Distribuição por Disciplina</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={disciplinesWithHours}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="horas"
                    >
                      {disciplinesWithHours.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}h`, name]}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabela de Disciplinas */}
            <div className="bg-slate-900/40 rounded-lg p-6 border border-blue-800/30">
              <h3 className="text-white mb-4">🎯 Tempo por Disciplina</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {disciplinesWithHours.map((disc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{disc.icon}</span>
                      <span className="text-blue-100 text-sm">{disc.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        style={{ backgroundColor: disc.color + '20', color: disc.color, borderColor: disc.color + '50' }}
                        className="text-xs"
                      >
                        {disc.proporção}%
                      </Badge>
                      <span className="text-white text-sm">{disc.horas}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informações Detalhadas do Plano */}
          <div className="space-y-6">
            {/* Distribuição Semanal */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-cyan-500/30">
              <h3 className="text-white mb-4 flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                🪐 Distribuição Semanal (15h/semana)
              </h3>
              <div className="grid gap-4">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-blue-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-cyan-300 font-medium">{day.dia}</h4>
                      <span className="text-blue-200 text-sm">{day.estrutura}</span>
                    </div>
                    <div className="text-blue-100 text-sm whitespace-pre-line mb-2">
                      {day.horario}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {day.disciplinas.map((disc, idx) => {
                        const disciplineInfo = disciplineDistribution.find(d => d.name === disc);
                        return disciplineInfo && (
                          <Badge 
                            key={idx}
                            style={{ backgroundColor: disciplineInfo.color + '20', color: disciplineInfo.color }}
                            className="text-xs"
                          >
                            {disciplineInfo.icon} {disc}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estrutura Modular */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-white mb-4 flex items-center text-lg">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                🌠 Estrutura Modular (6 meses)
              </h3>
              <p className="text-purple-100 mb-4 text-sm">
                Cada módulo dura 4 semanas, com ciclo de progressão gradual:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {monthlyModules.map((module, index) => (
                  <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-purple-800/30">
                    <h4 className="text-purple-300 font-medium mb-2">{module.mes}</h4>
                    <p className="text-purple-100 text-sm mb-2 font-medium">{module.foco}</p>
                    <p className="text-purple-200 text-xs">{module.estrategia}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuração dos GPTs */}
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
              <h3 className="text-white mb-3 flex items-center text-lg">
                <Brain className="w-5 h-5 mr-2 text-cyan-400" />
                🌌 Função dos GPTs neste Cenário
              </h3>
              <p className="text-cyan-100 mb-4">
                Cada GPT de disciplina já nasce com o seguinte contexto personalizado:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Tempo total de estudo previsto</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Dia(s) da semana específicos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Duração média por sessão</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Etapa atual do plano (mês/foco)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Nível inicial informado</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm">Integração com outras disciplinas</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-800/30">
                <p className="text-cyan-100 text-sm italic">
                  <strong>Exemplo:</strong> "Hoje temos 1h de Direito Constitucional. Vamos revisar os Princípios Fundamentais e resolver 5 questões sobre o artigo 5º da CF/88. No final, posso gerar um resumo automático baseado na nossa conversa."
                </p>
              </div>
            </div>

            {/* Aviso de Flexibilidade */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h4 className="text-yellow-300 font-medium">✨ Flexibilidade Total</h4>
              </div>
              <p className="text-yellow-100 text-sm">
                Este plano pode ser ajustado a qualquer momento conforme sua evolução e necessidades. 
                Os GPTs se adaptarão automaticamente às mudanças mantendo a eficiência do seu estudo.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={saveStudyPlan}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Plano
            </Button>
            <Button 
              onClick={resetChat}
              variant="outline"
              className="flex-1 border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Gerar Novo Plano
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-950/60 rounded-lg border border-cyan-800/30 backdrop-blur-sm h-96 overflow-y-auto p-4 space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            {message.isCard ? (
              <div className="w-full flex justify-center">
                {renderStudyPlanCard(message.cardData!)}
              </div>
            ) : (
              <div className={`max-w-md px-4 py-3 rounded-lg ${
                message.isBot 
                  ? 'bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90 text-white border border-cyan-400/30' 
                  : 'bg-slate-700/90 text-slate-100 border border-slate-600/50'
              }`}>
                <div className="whitespace-pre-wrap text-sm">{message.text}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua resposta..."
          className="flex-1 bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/70 focus:border-cyan-400/50"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!currentInput.trim()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}