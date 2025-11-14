import { supabase, Subscription, Payment } from '../lib/supabase'

export const subscriptionsService = {
  // Criar nova assinatura (após pagamento aprovado)
  async createSubscription(data: {
    user_id: string
    concurso_id: string
    payment_id?: string
  }) {
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          ...data,
          status: 'active',
          start_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return { data: subscription, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Cancelar assinatura
  async cancelSubscription(id: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          end_date: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Listar assinaturas do usuário
  async getUserSubscriptions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          concursos (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Registrar pagamento
  async createPayment(data: {
    user_id: string
    concurso_id: string
    amount: number
    payment_method?: 'credit_card' | 'pix' | 'boleto' | 'manual'
    transaction_id?: string
    metadata?: any
  }) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          ...data,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      return { data: payment, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Atualizar status do pagamento
  async updatePaymentStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'refunded'
  ) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Se aprovado, criar assinatura automaticamente
      if (status === 'approved' && data) {
        await this.createSubscription({
          user_id: data.user_id,
          concurso_id: data.concurso_id,
          payment_id: data.id
        })
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Listar pagamentos do usuário
  async getUserPayments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          concursos (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Listar todos os pagamentos (admin only)
  async getAllPayments() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles!payments_user_id_fkey (nome, email),
          concursos (nome)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  // Aprovar pagamento manual (admin only)
  async approvePayment(paymentId: string) {
    return await this.updatePaymentStatus(paymentId, 'approved')
  },

  // Rejeitar pagamento (admin only)
  async rejectPayment(paymentId: string) {
    return await this.updatePaymentStatus(paymentId, 'rejected')
  }
}
