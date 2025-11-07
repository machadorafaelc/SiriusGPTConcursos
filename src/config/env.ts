// Configuração de variáveis de ambiente
export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
    model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4",
    maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || "4000"),
    temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || "0.7")
  }
};

console.log("🔧 Configuração carregada:", {
  apiKeyAvailable: !!config.openai.apiKey,
  apiKeyLength: config.openai.apiKey.length,
  model: config.openai.model,
  maxTokens: config.openai.maxTokens,
  temperature: config.openai.temperature
});