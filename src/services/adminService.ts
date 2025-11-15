import { supabase, Profile } from '../lib/supabase';

export interface UserWithProfile extends Profile {
  auth_id: string;
  last_sign_in?: string;
}

export const adminService = {
  /**
   * Lista todos os usuários do sistema (apenas super_admin)
   */
  async getAllUsers(): Promise<{ data: UserWithProfile[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualiza o role de um usuário
   */
  async updateUserRole(
    userId: string,
    newRole: 'super_admin' | 'admin' | 'user'
  ): Promise<{ data: Profile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      return { data: null, error };
    }
  },

  /**
   * Deleta um usuário (apenas super_admin)
   */
  async deleteUser(userId: string): Promise<{ error: any }> {
    try {
      // Primeiro deleta o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Nota: Deletar do auth.users requer função do servidor
      // Por enquanto, apenas deletamos o perfil
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return { error };
    }
  },

  /**
   * Busca usuários por email ou nome
   */
  async searchUsers(query: string): Promise<{ data: UserWithProfile[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.%${query}%,nome.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtém estatísticas do sistema
   */
  async getStats(): Promise<{
    data: {
      totalUsers: number;
      superAdmins: number;
      admins: number;
      regularUsers: number;
    } | null;
    error: any;
  }> {
    try {
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('role');

      if (error) throw error;

      const stats = {
        totalUsers: allUsers?.length || 0,
        superAdmins: allUsers?.filter(u => u.role === 'super_admin').length || 0,
        admins: allUsers?.filter(u => u.role === 'admin').length || 0,
        regularUsers: allUsers?.filter(u => u.role === 'user').length || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return { data: null, error };
    }
  },
};
