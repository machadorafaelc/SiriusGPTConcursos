import React from 'react';
import { Rocket } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export function Header({ onLoginClick, isAuthenticated, userEmail, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vega-bg/95 backdrop-blur-sm border-b border-vega-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Lado Esquerdo */}
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-full bg-vega-cta flex items-center justify-center shadow-vega">
              <div className="absolute w-8 h-8 bg-vega-text rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-vega-neon rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-vega-text">Vega GPT Concursos</h1>
              <p className="text-sm text-vega-text-2">Um universo de possibilidades</p>
            </div>
          </div>

          {/* Botão Login - Lado Direito */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-vega-text-2 text-sm">{userEmail}</span>
                <button 
                  onClick={onLogout} 
                  className="rounded-lg bg-red-600 px-4 py-2 text-vega-text hover:bg-red-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="vega-btn inline-flex items-center justify-center px-6 py-3"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Fazer Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}