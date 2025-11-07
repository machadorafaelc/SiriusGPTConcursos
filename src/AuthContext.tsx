import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<boolean> {
    // Mock simples de autenticação
    const ok = email.trim().length > 3 && password.trim().length >= 4;
    if (ok) {
      setIsAuthenticated(true);
      setUserEmail(email);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    setUserEmail(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}


