import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export function Header({ onLoginClick, isAuthenticated, userEmail, onLogout }: HeaderProps) {
  // Se não tem email, não está realmente autenticado
  const reallyAuthenticated = isAuthenticated && userEmail;
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Lado Esquerdo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-blue-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Vega GPT Concursos</h1>
              <p className="text-xs text-blue-200">O universo da sua aprovação</p>
            </div>
          </div>

          {/* Botão Login - Lado Direito */}
          {reallyAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-blue-200">Bem-vindo, {userEmail}!</span>
              <button 
                onClick={onLogout}
                className="border border-blue-400/50 text-blue-200 hover:bg-blue-900/50 px-4 py-2 rounded-md transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white px-6 py-2 rounded-md font-medium inline-flex items-center gap-2 transition-all"
            >
              <Rocket className="w-4 h-4" />
              Fazer Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
