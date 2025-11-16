// Serviço para comunicação com a API da OpenAI
import { apiPost } from "./apiClient";
import { config } from "../config/env";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIConfig {
  model: string;
  max_tokens: number;
  temperature: number;
  messages: OpenAIMessage[];
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    this.apiKey = config.openai.apiKey;
    this.model = config.openai.model;
    this.maxTokens = config.openai.maxTokens;
    this.temperature = config.openai.temperature;
    
    // Debug logs
    console.log("OpenAI Service initialized:");
    console.log("- API Key available:", !!this.apiKey);
    console.log("- API Key length:", this.apiKey.length);
    console.log("- Model:", this.model);
    console.log("- Max tokens:", this.maxTokens);
    console.log("- Temperature:", this.temperature);
  }

  async chatCompletion(messages: OpenAIMessage[]): Promise<string> {
    console.log("🎯 chatCompletion iniciado");
    
    if (!this.apiKey) {
      console.error("❌ API Key não configurada!");
      throw new Error("OpenAI API key não configurada. Configure VITE_OPENAI_API_KEY no arquivo .env");
    }

    console.log("✅ API Key configurada, preparando requisição...");

    const config: OpenAIConfig = {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      messages
    };

    console.log("📋 Configuração:", {
      model: config.model,
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      messages_count: config.messages.length
    });

    try {
      console.log("🌐 Fazendo requisição direta para OpenAI API...");
      
      // Criar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log("📡 Resposta recebida, status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro da API:", errorData);
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      console.log("✅ Dados recebidos da API:", {
        choices_count: data.choices?.length,
        usage: data.usage
      });
      
      if (data.choices && data.choices.length > 0) {
        const content = data.choices[0].message.content;
        console.log("📝 Conteúdo da resposta:", content.substring(0, 100) + "...");
        return content;
      }

      throw new Error("Resposta inválida da OpenAI API");
    } catch (error: any) {
      console.error("❌ Erro ao chamar OpenAI API:", error);
      
      // Tratamento especial para timeout
      if (error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou mais de 60 segundos. Tente uma pergunta mais simples.');
      }
      
      throw error;
    }
  }

  async chatWithAgent(
    systemPrompt: string,
    userMessage: string,
    history: OpenAIMessage[] = []
  ): Promise<string> {
    console.log("🔧 chatWithAgent chamado com:");
    console.log("- System prompt length:", systemPrompt.length);
    console.log("- User message:", userMessage);
    console.log("- History length:", history.length);
    
    const messages: OpenAIMessage[] = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage }
    ];

    console.log("📝 Messages preparadas:", messages.length);
    console.log("🔑 API Key disponível:", !!this.apiKey);
    console.log("🤖 Model:", this.model);

    return this.chatCompletion(messages);
  }
}

export const openaiService = new OpenAIService();
