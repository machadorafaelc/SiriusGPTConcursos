import React, { useState, useEffect } from "react";
import { chatRag } from "../services/chat";
import type { AgentId } from "../agents";
import { agentes } from "../agents";
import { usePlano } from "../PlanoContext";
import { Brain, Send, RotateCcw, HelpCircle } from "lucide-react";
import { RichMessage } from './RichMessage';

export function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentId] = useState("da" as AgentId); // Fixo no Direito Administrativo
  const [history, setHistory] = useState([] as { role: "user" | "assistant"; content: string; citations?: { title: string; url: string }[] }[]);
  const [suggestions, setSuggestions] = useState([] as string[]);

  const { getPlanoDaDisciplina } = usePlano();

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    
    // Limpar o input imediatamente
    setInput("");
    setLoading(true);
    setSuggestions([]);
    
    // Adicionar mensagem do usuário ao histórico
    setHistory(prev => [...prev, { role: "user", content }]);
  
    const agente = agentes[agentId];
    const plano = getPlanoDaDisciplina(agente.disciplina);
    const focoDaSemana = plano?.[0]?.foco ?? content;
  
    console.log("📚 Histórico atual:", history.length, "mensagens");
    console.log("📝 Enviando para chatRag:", {
      agentId,
      message: content,
      historyLength: history.length
    });

    const r = await chatRag({
      agentId,
      message: content,
      concurso: "Policial Legislativo Federal - Câmara dos Deputados",
      banca: "CESPE",
      disciplina: agente.disciplina,
      assunto: focoDaSemana,
      history: history.map(h => ({ role: h.role, content: h.content })),
    });
  
    setLoading(false);
  
    // Adicionar resposta do assistente ao histórico
    const assistantMessage = !r.citations || r.citations.length === 0 
      ? "🚫 Resposta bloqueada por falta de fontes rastreáveis."
      : r.answer;
    
    setHistory(prev => [...prev, { 
      role: "assistant", 
      content: assistantMessage,
      citations: r.citations || []
    }]);
    
    // Sugestões dinâmicas simples com base no tema
    const tema = focoDaSemana.toLowerCase();
    const base: string[] = [
      "Traga 3 exemplos práticos",
      "Montei 5 questões no estilo CESPE",
      "Liste jurisprudência relevante"
    ];
    if (tema.includes("ato")) {
      setSuggestions([
        "Explique os atributos dos atos administrativos",
        "Diferencie ato vinculado e discricionário",
        ...base,
      ].slice(0,3));
    } else if (tema.includes("licita")) {
      setSuggestions([
        "Compare modalidades da Lei 14.133/21",
        "Explique fases interna e externa",
        ...base,
      ].slice(0,3));
    } else {
      setSuggestions(base.slice(0,3));
    }
  }
  

  return (
    <div className="min-h-screen bg-vega-page p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-vega-cta rounded-full flex items-center justify-center shadow-vega-cta">
          <Brain className="w-6 h-6 text-vega-text" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-vega-text">GPT - Direito Administrativo</h1>
          <p className="text-vega-text">Seu assistente de estudos especializado</p>
        </div>
      </div>


      {/* Seção do Chat */}
      <div className="vega-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-vega-text mb-2">Interface do Chat</h2>
          <p className="text-vega-text">Seu assistente especializado em Direito Administrativo</p>
        </div>

        {/* Contexto da Consulta */}
        <div className="bg-vega-bg/50 rounded-lg p-4 mb-6">
          <h3 className="text-vega-text font-medium mb-3">Contexto da consulta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-vega-text text-sm mb-1">Concurso</label>
              <input 
                type="text" 
                value="Câmara dos Deputados - Policial Legislativo" 
                readOnly
                className="w-full bg-vega-bg/50 border border-vega-border rounded px-3 py-2 text-vega-text text-sm"
              />
            </div>
            <div>
              <label className="block text-vega-text text-sm mb-1">Banca</label>
              <input 
                type="text" 
                value="CESPE/CEBRASPE" 
                readOnly
                className="w-full bg-vega-bg/50 border border-vega-border rounded px-3 py-2 text-vega-text text-sm"
              />
            </div>
          </div>
        </div>

        {/* Área do Chat */}
        <div className="space-y-4 mb-6">
          {history.length === 0 ? (
            <RichMessage content={`🚀 Olá, concurseiro(a)! ✨ Eu sou o GPT especializado em Direito Administrativo!

💬 Para oferecer a melhor experiência, recomendo que você primeiro configure seu plano de estudos geral com o GPT Orientador Vega. Enquanto isso, posso te ajudar com dúvidas, exercícios e conteúdo sobre Direito Administrativo!

❓ Como posso te auxiliar hoje?`} />
          ) : (
            history.map((message, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 ${
                  message.role === "user"
                    ? "ml-8 bg-vega-neon/20 border border-vega-neon/30"
                    : "mr-8"
                }`}
              >
                {message.role === "user" ? (
                  <div className="text-vega-text">
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                ) : (
                  <RichMessage content={message.content} />
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="bg-vega-bg/50 rounded-2xl p-4 text-vega-text">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-vega-text/30 border-t-vega-text"></div>
                <span>Pensando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input do Chat */}
        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-vega-bg/50 border border-vega-border rounded-lg px-4 py-3 text-vega-text placeholder-vega-text-2 focus:outline-none focus:border-vega-neon resize-none"
            placeholder="Pergunte sobre Direito Administrativo... (Shift+Enter para quebra de linha)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  // Shift+Enter: quebra de linha (comportamento padrão)
                  // Não fazer nada, deixar o comportamento padrão
                  return;
                } else {
                  // Enter: enviar mensagem
                  e.preventDefault();
                  handleSend();
                }
              }
            }}
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-10 h-10 bg-vega-cta hover:brightness-110 rounded-full flex items-center justify-center text-vega-text disabled:opacity-50 transition-all shadow-vega-cta"
          >
            <Send className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-vega-bg/50 hover:bg-vega-bg/70 rounded-full flex items-center justify-center text-vega-text transition-colors border border-vega-border">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Botão de Ajuda */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-vega-cta hover:brightness-110 rounded-full flex items-center justify-center text-vega-text shadow-vega-cta transition-all">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

