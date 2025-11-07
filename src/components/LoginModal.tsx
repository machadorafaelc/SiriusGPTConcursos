import React, { useState } from "react";
import { X, Lock, Mail } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Entrar</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
              <Mail className="w-4 h-4 text-white/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent p-2 text-white outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">Senha</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
              <Lock className="w-4 h-4 text-white/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent p-2 text-white outline-none"
                placeholder="••••••••"
                required
                minLength={4}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-600/20 p-2 text-rose-300 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}


