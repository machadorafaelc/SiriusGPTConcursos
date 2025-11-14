import { useState } from "react";
import { X, Sparkles, Mail, Lock, User, Phone, CreditCard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register fields
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const { data, error: loginError } = await signIn(email, password);
    setLoading(false);
    
    if (loginError) {
      setError(loginError);
    } else if (data) {
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validações
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    
    const { data, error: registerError } = await signUp({
      email,
      password,
      nome,
      cpf: cpf || undefined,
      telefone: telefone || undefined
    });
    
    setLoading(false);
    
    if (registerError) {
      setError(registerError);
    } else if (data) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMode('login');
        // Reset form
        setNome("");
        setCpf("");
        setTelefone("");
        setPassword("");
        setConfirmPassword("");
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-blue-800/30 rounded-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">
              {mode === 'login' ? 'Acesse sua jornada' : 'Crie sua conta'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="rounded-md bg-green-500/10 border border-green-500/30 p-3 text-green-400 text-sm mb-4">
            ✅ Conta criada com sucesso! Faça login para continuar.
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Senha</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar na Plataforma"}
            </button>

            {/* Switch to Register */}
            <div className="text-center text-sm text-gray-400">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Registre-se
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nome Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="João Silva"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* CPF Input (opcional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>CPF (opcional)</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            {/* Telefone Input (opcional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Telefone (opcional)</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 98765-4321"
                maxLength={15}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Senha</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Confirmar Senha</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-800 border border-blue-800/30 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>

            {/* Switch to Login */}
            <div className="text-center text-sm text-gray-400">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Faça login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
