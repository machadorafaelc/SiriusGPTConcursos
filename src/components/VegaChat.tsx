import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, RotateCcw, Sparkles } from "lucide-react";
import { siriusService, type PerfilAluno, type PlanoCompleto } from "../services/siriusService";
import { usePlano } from "../PlanoContext";

interface Mensagem {
  id: string;
  texto: string;
  isAluno: boolean;
  timestamp: Date;
}

export function VegaChat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(`sirius_${Date.now()}`);
  const [planoGerado, setPlanoGerado] = useState<PlanoCompleto | null>(null);
  const [conversaIniciada, setConversaIniciada] = useState(false);
  const conversaIniciadaRef = useRef(false);
  const useEffectExecutadoRef = useRef(false);
  
  // const { setPlano } = usePlano(); // Temporariamente removido para debug
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  // Inicia a conversa quando o componente monta
  useEffect(() => {
    console.log("🔍 useEffect executado - mensagens:", mensagens.length, "conversaIniciada:", conversaIniciada, "conversaIniciadaRef:", conversaIniciadaRef.current, "useEffectExecutadoRef:", useEffectExecutadoRef.current);
    
    if (useEffectExecutadoRef.current) {
      console.log("⚠️ useEffect já foi executado, ignorando");
      return;
    }
    
    if (mensagens.length === 0 && !conversaIniciada && !conversaIniciadaRef.current) {
      console.log("🚀 Iniciando conversa com Vega Orientador");
      useEffectExecutadoRef.current = true;
      conversaIniciadaRef.current = true;
      const mensagemInicial = siriusService.iniciarConversa(sessionIdRef.current);
      adicionarMensagem(mensagemInicial, false);
      setConversaIniciada(true);
    }
  }, []); // Removido dependências desnecessárias

  const iniciarConversa = () => {
    if (!conversaIniciada && mensagens.length === 0) {
      console.log("🚀 Iniciando conversa manualmente");
      const mensagemInicial = siriusService.iniciarConversa(sessionIdRef.current);
      adicionarMensagem(mensagemInicial, false);
      setConversaIniciada(true);
    }
  };

  const adicionarMensagem = (texto: string, isAluno: boolean) => {
    console.log("📝 adicionarMensagem chamado:", { texto: texto.substring(0, 50) + "...", isAluno });
    console.log("📝 Mensagens atuais:", mensagens.length);
    
    const novaMensagem: Mensagem = {
      id: `msg_${Date.now()}_${Math.random()}`,
      texto,
      isAluno,
      timestamp: new Date()
    };
    
    setMensagens(prev => {
      console.log("📝 Adicionando mensagem ao estado. Total anterior:", prev.length);
      return [...prev, novaMensagem];
    });
  };

  const enviarMensagem = async () => {
    if (!input.trim() || loading) return;

    const mensagem = input.trim();
    setInput("");
    setLoading(true);

    // Adiciona mensagem do aluno
    adicionarMensagem(mensagem, true);

    try {
      // Processa mensagem com o Vega
      const resposta = await siriusService.processarMensagem(sessionIdRef.current, mensagem);
      
      // Adiciona resposta do Vega
      adicionarMensagem(resposta, false);

      // Verifica se o plano foi gerado
      const perfil = siriusService.getPerfil(sessionIdRef.current);
      if (perfil.horasSemanais && perfil.prazoSemanas && perfil.disciplinas && perfil.nivel) {
        // Simula geração do plano completo
        const plano = siriusService['criarPlanoAdaptativo'](perfil as PerfilAluno);
        setPlanoGerado(plano);
        
        // Salva no contexto global
        // setPlano(plano.distribuicaoPorDisciplina); // Temporariamente comentado para debug
      }

    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      adicionarMensagem("Desculpe, ocorreu um erro. Tente novamente.", false);
    } finally {
      setLoading(false);
    }
  };

  const reiniciarConversa = () => {
    siriusService.limparSessao(sessionIdRef.current);
    setMensagens([]);
    setPlanoGerado(null);
    setConversaIniciada(false);
    conversaIniciadaRef.current = false;
    useEffectExecutadoRef.current = false;
    iniciarConversa();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Vega Orientador</h3>
            <p className="text-sm text-white/70">Seu assistente pessoal de estudos</p>
          </div>
        </div>
        
        <button
          onClick={reiniciarConversa}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Reiniciar conversa"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isAluno ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.isAluno
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.texto}
              </div>
              <div className={`text-xs mt-1 ${
                msg.isAluno ? 'text-indigo-200' : 'text-white/50'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white border border-white/20 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua resposta..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            onClick={enviarMensagem}
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plano Gerado */}
      {planoGerado && (
        <div className="p-4 border-t border-white/10 bg-green-500/10">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Plano personalizado gerado com sucesso!</span>
          </div>
          <p className="text-xs text-white/70">
            Seu plano foi salvo e os agentes disciplinares já podem acessá-lo.
          </p>
        </div>
      )}
    </div>
  );
}
