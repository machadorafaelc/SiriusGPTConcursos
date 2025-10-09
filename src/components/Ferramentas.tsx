import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { FileText, Scale, BookOpen, ClipboardCheck, TrendingUp, ExternalLink } from 'lucide-react';
import { consultaEditais } from '../services/consultaEditais';
import { buscarJuris } from '../services/buscarJuris';
import { simuladorProva } from '../services/simuladorProva';
import { analisarDesempenho } from '../services/analisadorDesempenho';

export function Ferramentas() {
  const [isLoadingEditais, setIsLoadingEditais] = useState(false);
  const [isLoadingJuris, setIsLoadingJuris] = useState(false);
  const [isLoadingSimulador, setIsLoadingSimulador] = useState(false);
  const [isLoadingAnalise, setIsLoadingAnalise] = useState(false);

  const [editaisData, setEditaisData] = useState<any>(null);
  const [jurisData, setJurisData] = useState<any>(null);
  const [simuladorData, setSimuladorData] = useState<any>(null);
  const [analiseData, setAnaliseData] = useState<any>(null);

  const [concursoQuery, setConcursoQuery] = useState('Câmara dos Deputados');
  const [topicoQuery, setTopicoQuery] = useState('');
  const [temaJuris, setTemaJuris] = useState('');
  const [tribunalJuris, setTribunalJuris] = useState('');

  const handleConsultaEditais = async () => {
    setIsLoadingEditais(true);
    try {
      const data = await consultaEditais({
        concurso: concursoQuery,
        topico: topicoQuery || undefined
      });
      setEditaisData(data);
    } catch (error) {
      console.error('Erro ao consultar editais:', error);
    } finally {
      setIsLoadingEditais(false);
    }
  };

  const handleBuscarJuris = async () => {
    setIsLoadingJuris(true);
    try {
      const data = await buscarJuris({
        tema: temaJuris,
        tribunal: tribunalJuris || undefined
      });
      setJurisData(data);
    } catch (error) {
      console.error('Erro ao buscar jurisprudência:', error);
    } finally {
      setIsLoadingJuris(false);
    }
  };

  const handleSimuladorProva = async () => {
    setIsLoadingSimulador(true);
    try {
      const data = await simuladorProva({
        banca: 'CESPE/CEBRASPE',
        nivel: 'intermediário',
        disciplinas: ['Direito Constitucional', 'Língua Portuguesa'],
        qtd: 10
      });
      setSimuladorData(data);
    } catch (error) {
      console.error('Erro ao gerar simulado:', error);
    } finally {
      setIsLoadingSimulador(false);
    }
  };

  const handleAnalisarDesempenho = async () => {
    setIsLoadingAnalise(true);
    try {
      const data = await analisarDesempenho({
        usuarioId: 'user-123',
        respostas: [
          { questaoId: 'q1', alternativa: 'B', correta: true },
          { questaoId: 'q2', alternativa: 'A', correta: false },
          { questaoId: 'q3', alternativa: 'C', correta: true },
        ]
      });
      setAnaliseData(data);
    } catch (error) {
      console.error('Erro ao analisar desempenho:', error);
    } finally {
      setIsLoadingAnalise(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div>
        <h2 className="text-cyan-100 mb-2">Ferramentas de Estudo</h2>
        <p className="text-cyan-300/70">
          Utilize as ferramentas abaixo para otimizar sua preparação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consulta Editais */}
        <Card className="universe-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <FileText className="w-5 h-5 text-cyan-400" />
              Consulta Editais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Nome do concurso"
                value={concursoQuery}
                onChange={(e) => setConcursoQuery(e.target.value)}
                className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50"
              />
              <Input
                placeholder="Tópico específico (opcional)"
                value={topicoQuery}
                onChange={(e) => setTopicoQuery(e.target.value)}
                className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50"
              />
            </div>
            
            <Button
              onClick={handleConsultaEditais}
              disabled={isLoadingEditais || !concursoQuery}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isLoadingEditais ? 'Consultando...' : 'Consultar Edital'}
            </Button>

            {isLoadingEditais && (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full bg-slate-700" />
                <Skeleton className="h-20 w-full bg-slate-700" />
              </div>
            )}

            {editaisData && !isLoadingEditais && (
              <Accordion type="single" collapsible className="w-full">
                {editaisData.trechos.map((trecho: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-cyan-800/30">
                    <AccordionTrigger className="text-cyan-200 hover:text-cyan-100">
                      {trecho.titulo}
                    </AccordionTrigger>
                    <AccordionContent className="text-cyan-300/80 space-y-2">
                      <p>{trecho.trecho}</p>
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <ExternalLink className="w-3 h-3" />
                        <span>{trecho.fonte}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Buscar Jurisprudência */}
        <Card className="universe-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <Scale className="w-5 h-5 text-purple-400" />
              Jurisprudência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Tema da pesquisa"
                value={temaJuris}
                onChange={(e) => setTemaJuris(e.target.value)}
                className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50"
              />
              <Input
                placeholder="Tribunal (opcional)"
                value={tribunalJuris}
                onChange={(e) => setTribunalJuris(e.target.value)}
                className="bg-slate-900/50 border-cyan-800/30 text-white placeholder-cyan-300/50"
              />
            </div>
            
            <Button
              onClick={handleBuscarJuris}
              disabled={isLoadingJuris || !temaJuris}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoadingJuris ? 'Buscando...' : 'Buscar Jurisprudência'}
            </Button>

            {isLoadingJuris && (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full bg-slate-700" />
                <Skeleton className="h-20 w-full bg-slate-700" />
              </div>
            )}

            {jurisData && !isLoadingJuris && (
              <Accordion type="single" collapsible className="w-full">
                {jurisData.ementas.map((ementa: any, index: number) => (
                  <AccordionItem key={index} value={`juris-${index}`} className="border-cyan-800/30">
                    <AccordionTrigger className="text-purple-200 hover:text-purple-100">
                      {ementa.referencia}
                    </AccordionTrigger>
                    <AccordionContent className="text-purple-300/80 space-y-2">
                      <p>{ementa.resumo}</p>
                      <a
                        href={ementa.fonte}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver fonte completa
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Simulador de Prova */}
        <Card className="universe-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <BookOpen className="w-5 h-5 text-green-400" />
              Simulador de Prova
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cyan-300/70 text-sm">
              Gere um simulado personalizado com questões de provas anteriores
            </p>
            
            <Button
              onClick={handleSimuladorProva}
              disabled={isLoadingSimulador}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {isLoadingSimulador ? 'Gerando...' : 'Gerar Simulado'}
            </Button>

            {isLoadingSimulador && (
              <div className="space-y-2">
                <Skeleton className="h-32 w-full bg-slate-700" />
              </div>
            )}

            {simuladorData && !isLoadingSimulador && (
              <div className="space-y-3">
                <Badge className="badge-traceable">
                  Prova ID: {simuladorData.provaId}
                </Badge>
                
                <div className="space-y-4">
                  {simuladorData.questoes.map((questao: any, index: number) => (
                    <Card key={questao.id} className="bg-slate-900/40 border-green-800/30 p-3">
                      <h4 className="text-green-200 text-sm mb-2">Questão {index + 1}</h4>
                      <p className="text-white text-sm mb-3">{questao.enunciado}</p>
                      <div className="space-y-1">
                        {questao.alternativas.map((alt: string, i: number) => (
                          <div key={i} className="text-cyan-200 text-xs">
                            {String.fromCharCode(65 + i)}) {alt}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analisador de Desempenho */}
        <Card className="universe-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Análise de Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cyan-300/70 text-sm">
              Analise seu desempenho e receba recomendações personalizadas
            </p>
            
            <Button
              onClick={handleAnalisarDesempenho}
              disabled={isLoadingAnalise}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isLoadingAnalise ? 'Analisando...' : 'Analisar Desempenho'}
            </Button>

            {isLoadingAnalise && (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full bg-slate-700" />
              </div>
            )}

            {analiseData && !isLoadingAnalise && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-green-900/20 border-green-600/30 p-3">
                    <div className="text-green-200 text-sm">Acertos</div>
                    <div className="text-green-100 text-2xl">{analiseData.acertos}</div>
                  </Card>
                  <Card className="bg-red-900/20 border-red-600/30 p-3">
                    <div className="text-red-200 text-sm">Erros</div>
                    <div className="text-red-100 text-2xl">{analiseData.erros}</div>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="text-orange-200 text-sm">Recomendações:</h4>
                  {analiseData.recomendacoes.map((rec: string, index: number) => (
                    <div key={index} className="bg-slate-900/40 border-orange-800/30 border rounded p-2">
                      <p className="text-orange-100 text-sm">• {rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
