import { supabase } from '../lib/supabase'

export interface SignUpData {
  email: string
  password: string
  nome: string
  cpf?: string
  telefone?: string
}

export interface SignInData {
  email: string
  password: string
}

export const authService = {
  // Registrar novo usuário
  async signUp(data: SignUpData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nome: data.nome,
            cpf: data.cpf,
            telefone: data.telefone
          }
        }
      })

      if (authError) throw authError

      // Atualizar profile com dados adicionais
      if (authData.user && data.cpf) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            cpf: data.cpf,
            telefone: data.telefone
          })
          .eq('id', authData.user.id)

        if (profileError) console.error('Erro ao atualizar profile:', profileError)
      }

      return { data: authData, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Login
  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error

      return { data: authData, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  },

  // Recuperar senha
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  },

  // Atualizar senha
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { data: user, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Obter sessão atual
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { data: session, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Obter profile do usuário
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Atualizar profile
  async updateProfile(userId: string, updates: Partial<{
    nome: string
    cpf: string
    telefone: string
    avatar_url: string
  }>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Verificar se usuário é admin
  async isAdmin(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data?.role === 'admin' || data?.role === 'super_admin'
    } catch (error) {
      return false
    }
  },

  // Verificar se usuário é super admin
  async isSuperAdmin(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data?.role === 'super_admin'
    } catch (error) {
      return false
    }
  }
}
