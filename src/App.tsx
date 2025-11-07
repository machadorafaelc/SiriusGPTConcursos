import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { VegaOrientador } from "./components/SiriusOrientador";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./AuthContext";
import { StudyPlanProvider } from "./StudyPlanContext";
import { LoginModal } from "./components/LoginModal";

function AppInner() {
  const [tela, setTela] = useState("home" as "home" | "dashboard" | "orientador");
  const [openLogin, setOpenLogin] = useState(false);
  const { isAuthenticated, userEmail, logout } = useAuth();

  // Redireciona para dashboard após login
  React.useEffect(() => {
    if (isAuthenticated && tela === "home") {
      setTela("dashboard");
    }
  }, [isAuthenticated, tela]);

  // Função de logout que redireciona para home
  const handleLogout = () => {
    logout();
    setTela("home");
  };

  return (
    <ErrorBoundary fallback={null} children={
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        {/* Navigation para outras telas */}
        {tela !== "home" && (
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 border-b border-blue-800/30 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => setTela("home")}
                    className="px-4 py-2 rounded-md bg-blue-900/50 text-blue-200 hover:bg-blue-900/70 transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setTela("dashboard")}
                    className="px-4 py-2 rounded-md bg-blue-900/50 text-blue-200 hover:bg-blue-900/70 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setTela("orientador")}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 transition-all"
                  >
                    Vega Orientador
                  </button>
                </div>
                
                {isAuthenticated && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-200 text-sm">{userEmail}</span>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-md border border-blue-400/50 text-blue-200 hover:bg-blue-900/50 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ErrorBoundary fallback={null} children={
          <>
            {tela === "home" && (
              <LandingPage 
                onLoginClick={() => setOpenLogin(true)}
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            )}
            {tela === "dashboard" && <Dashboard />}
            {tela === "orientador" && <VegaOrientador />}
          </>
        } />
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      </main>
    } />
  );
}

export function App() {
  return (
    <AuthProvider>
      <StudyPlanProvider>
        <AppInner />
      </StudyPlanProvider>
    </AuthProvider>
  );
}
