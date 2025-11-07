import React, { useState, useEffect, useRef } from "react";
import { chatSirius } from "../services/apiService";
import { usePlano } from "../PlanoContext";
import { Sparkles, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function SiriusChatAPI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { setPlano } = usePlano();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Inicia a conversa com o Sirius
    if (messages.length === 0) {
      handleSendMessage("olá", true);
    }
  }, []);

  const handleSendMessage = async (messageContent: string, isInitial = false) => {
    if (!messageContent.trim() && !isInitial) return;

    const newMessage: Message = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatSirius({
        message: messageContent,
        history: messages, // Passa o histórico para contexto
      });

      const siriusMessage: Message = { role: "assistant", content: response.answer };
      setMessages((prev) => [...prev, siriusMessage]);

      if (response.plan) {
        // Organiza e salva o plano por disciplina no contexto global
        const porDisciplina: Record<string, typeof response.plan> = {};
        response.plan.forEach((s) => {
          const disciplina = s.foco.split(":")[0].trim(); // Assume "Disciplina: Foco"
          if (!porDisciplina[disciplina]) porDisciplina[disciplina] = [];
          porDisciplina[disciplina].push(s);
        });
        setPlano(porDisciplina);
        console.log("Plano salvo no contexto:", porDisciplina);
      }
    } catch (error) {
      console.error("Erro ao interagir com Sirius:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Desculpe, tive um erro ao processar sua solicitação. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 rounded-xl border border-white/10 p-4">
      <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {msg.role === "assistant" && <Sparkles className="inline-block w-4 h-4 mr-2 text-rose-300" />}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-white/10 text-white animate-pulse">
              <Sparkles className="inline-block w-4 h-4 mr-2 text-rose-300" />
              Digitando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-white/50"
          placeholder="Converse com o Sirius Orientador..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(input);
            }
          }}
          disabled={loading}
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          disabled={loading || !input.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
