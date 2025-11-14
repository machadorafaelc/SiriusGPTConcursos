import React, { createContext, useContext, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { Profile } from '../lib/supabase'
import { useAuth as useSupabaseAuth } from '../hooks/useAuth'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: string | null }>
  signUp: (data: {
    email: string
    password: string
    nome: string
    cpf?: string
    telefone?: string
  }) => Promise<{ data: any; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  updateProfile: (updates: Partial<{
    nome: string
    cpf: string
    telefone: string
    avatar_url: string
  }>) => Promise<{ data: any; error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
