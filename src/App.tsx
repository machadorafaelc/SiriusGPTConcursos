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
      <main className="min-h-screen bg-gradient-to-b from-[#0c0c1e] to-[#04040c] text-white">
        {/* Navigation para outras telas */}
        {tela !== "home" && (
          <div className="p-6">
            <div className="mb-6 flex gap-4 justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setTela("home")}
                  className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
                >
                  Home
                </button>
                <button
                  onClick={() => setTela("dashboard")}
                  className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setTela("orientador")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-700"
                >
                  Vega Orientador
                </button>
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
