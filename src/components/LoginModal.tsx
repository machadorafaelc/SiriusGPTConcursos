import React, { useState } from "react";
import { X, Lock, Mail, Rocket } from "lucide-react";
import { useAuth } from "../AuthContext";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md vega-card p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full vega-cta flex items-center justify-center shadow-vega-cta">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-vega-text">Entrar no Sistema</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-vega-text-2 hover:text-vega-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-vega-text-2 mb-6">
          Acesse o universo de possibilidades do Vega GPT Concursos
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-vega-text mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-vega-border bg-vega-bg/50 px-4 py-3 focus-within:border-vega-neon transition-colors">
              <Mail className="w-5 h-5 text-vega-text-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-vega-text outline-none placeholder:text-vega-text-2"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-vega-text mb-2">
              Senha
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-vega-border bg-vega-bg/50 px-4 py-3 focus-within:border-vega-neon transition-colors">
              <Lock className="w-5 h-5 text-vega-text-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-vega-text outline-none placeholder:text-vega-text-2"
                placeholder="••••••••"
                required
                minLength={4}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full vega-btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Entrando...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Entrar no Sistema
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-vega-border">
          <p className="text-center text-sm text-vega-text-2">
            Não tem uma conta?{" "}
            <button className="text-vega-neon hover:underline font-medium">
              Solicitar Acesso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
