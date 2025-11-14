import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njgzlqioklveaatzhddd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZ3pscWlva2x2ZWFhdHpoZGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTgyODQsImV4cCI6MjA3ODY5NDI4NH0.epOcqdWprUem86LX9YanF4F0Hn12d6zbh0NyWFVmUeY'

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos do banco de dados
export interface Profile {
  id: string
  email: string
  nome: string
  cpf?: string
  telefone?: string
  role: 'user' | 'admin' | 'super_admin'
  avatar_url?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Concurso {
  id: string
  nome: string
  orgao: string
  cargo: string
  banca?: string
  descricao?: string
  status: 'ativo' | 'inativo' | 'encerrado'
  preco: number // em centavos
  imagem_url?: string
  disciplinas: string[]
  ordem: number
  created_at: string
  updated_at: string
}

export interface GPT {
  id: string
  concurso_id: string
  nome: string
  disciplina: string
  agent_id: string
  descricao?: string
  icone?: string
  ordem: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  concurso_id: string
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  end_date?: string
  payment_id?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  concurso_id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'refunded'
  payment_method?: 'credit_card' | 'pix' | 'boleto' | 'manual'
  transaction_id?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface StudyPlan {
  id: string
  user_id: string
  concurso_id?: string
  tempo_estudo_diario?: number
  disciplina_da_semana?: string
  metodo_estudo?: string
  dias_estudo?: string[]
  horario_preferencial?: string
  ativo: boolean
  created_at: string
  updated_at: string
}
