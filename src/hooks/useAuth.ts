import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'
import { authService } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obter sessão inicial
    authService.getSession().then(({ data }) => {
      setSession(data)
      setUser(data?.user ?? null)
      
      if (data?.user) {
        loadProfile(data.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    const { data, error } = await authService.getProfile(userId)
    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn({ email, password })
    return { data, error }
  }

  const signUp = async (data: {
    email: string
    password: string
    nome: string
    cpf?: string
    telefone?: string
  }) => {
    const result = await authService.signUp(data)
    return result
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email)
  }

  const updatePassword = async (newPassword: string) => {
    return await authService.updatePassword(newPassword)
  }

  const updateProfile = async (updates: Partial<{
    nome: string
    cpf: string
    telefone: string
    avatar_url: string
  }>) => {
    if (!user) return { data: null, error: 'Usuário não autenticado' }
    
    const { data, error } = await authService.updateProfile(user.id, updates)
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const isSuperAdmin = profile?.role === 'super_admin'

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isSuperAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }
}
