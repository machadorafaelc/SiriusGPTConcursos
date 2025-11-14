import { supabase, Concurso, GPT } from '../lib/supabase'

export const concursosService = {
  // Listar todos os concursos ativos
  async listConcursos() {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .eq('status', 'ativo')
        .order('ordem', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Obter detalhes de um concurso específico
  async getConcurso(id: string) {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Listar GPTs de um concurso
  async getGPTsByConcurso(concursoId: string) {
    try {
      const { data, error } = await supabase
        .from('gpts')
        .select('*')
        .eq('concurso_id', concursoId)
        .eq('active', true)
        .order('ordem', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Verificar se usuário tem acesso a um concurso
  async hasAccess(userId: string, concursoId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', userId)
        .eq('concurso_id', concursoId)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error
      return { hasAccess: !!data, error: null }
    } catch (error: any) {
      return { hasAccess: false, error: error.message }
    }
  },

  // Listar concursos que o usuário tem acesso
  async getUserConcursos(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          status,
          start_date,
          end_date,
          concursos (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error
      
      // Extrair apenas os concursos
      const concursos = data?.map((sub: any) => sub.concursos).filter(Boolean) || []
      return { data: concursos, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Criar novo concurso (admin only)
  async createConcurso(concurso: Omit<Concurso, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .insert(concurso)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Atualizar concurso (admin only)
  async updateConcurso(id: string, updates: Partial<Concurso>) {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Deletar concurso (admin only)
  async deleteConcurso(id: string) {
    try {
      const { error } = await supabase
        .from('concursos')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  },

  // Criar novo GPT (admin only)
  async createGPT(gpt: Omit<GPT, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('gpts')
        .insert(gpt)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Atualizar GPT (admin only)
  async updateGPT(id: string, updates: Partial<GPT>) {
    try {
      const { data, error } = await supabase
        .from('gpts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Deletar GPT (admin only)
  async deleteGPT(id: string) {
    try {
      const { error } = await supabase
        .from('gpts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}
