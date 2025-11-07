import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { VegaOrientador } from "./components/SiriusOrientador";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./AuthContext";
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

  return (
    <ErrorBoundary fallback={null} children={
      <main className="min-h-screen vega-page">
        {/* Navigation para outras telas */}
        {tela !== "home" && (
          <div className="p-6 bg-vega-bg/50 border-b border-vega-border">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => setTela("home")}
                    className="vega-btn-secondary"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setTela("dashboard")}
                    className="vega-btn-secondary"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setTela("orientador")}
                    className="vega-btn"
                  >
                    Vega Orientador
                  </button>
                </div>
                
                {isAuthenticated && (
                  <div className="flex items-center gap-3">
                    <span className="text-vega-text-2 text-sm">{userEmail}</span>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition-colors"
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
                onLogout={logout}
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
      <AppInner />
    </AuthProvider>
  );
}
