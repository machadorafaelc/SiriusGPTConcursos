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
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6E00FF 0%, #E4007C 100%)'
            }}>
              <Rocket className="w-6 h-6 text-white" />
            </div>
            
            {/* Text */}
            <div>
              <h1 className="text-xl font-bold text-white">Vega GPT Concursos</h1>
              <p className="text-xs text-gray-400">Um universo de possibilidades</p>
            </div>
          </div>

          {/* Botão Login - Lado Direito */}
          <div className="flex items-center ml-auto">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{userEmail}</span>
                <button 
                  onClick={onLogout} 
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="vega-btn inline-flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Fazer Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
