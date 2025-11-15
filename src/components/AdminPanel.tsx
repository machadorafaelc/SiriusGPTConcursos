import { useState, useEffect } from 'react';
import { adminService, UserWithProfile } from '../services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Shield, UserCog, Trash2, Search, BarChart3 } from 'lucide-react';

export function AdminPanel() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdmins: 0,
    admins: 0,
    regularUsers: 0,
  });
  const [selectedRole, setSelectedRole] = useState<'all' | 'super_admin' | 'admin' | 'user'>('all');

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole, users]);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await adminService.getAllUsers();
    if (!error && data) {
      setUsers(data);
      setFilteredUsers(data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { data, error } = await adminService.getStats();
    if (!error && data) {
      setStats(data);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtro por role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole);
    }

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        u =>
          u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.nome?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateRole = async (userId: string, newRole: 'super_admin' | 'admin' | 'user') => {
    const confirmed = window.confirm(`Tem certeza que deseja alterar o role deste usuário para ${newRole}?`);
    if (!confirmed) return;

    const { error } = await adminService.updateUserRole(userId, newRole);
    if (!error) {
      alert('Role atualizado com sucesso!');
      loadUsers();
      loadStats();
    } else {
      alert('Erro ao atualizar role: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(
      `⚠️ ATENÇÃO: Tem certeza que deseja deletar o usuário ${userEmail}?\n\nEsta ação não pode ser desfeita!`
    );
    if (!confirmed) return;

    const { error } = await adminService.deleteUser(userId);
    if (!error) {
      alert('Usuário deletado com sucesso!');
      loadUsers();
      loadStats();
    } else {
      alert('Erro ao deletar usuário: ' + error.message);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'admin':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Usuário';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel de Administração</h1>
          <p className="text-blue-200">Gerencie usuários e permissões do sistema</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="vega-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-vega-text-2">Total de Usuários</p>
                  <p className="text-3xl font-bold text-vega-text">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-vega-neon" />
              </div>
            </CardContent>
          </Card>

          <Card className="vega-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-vega-text-2">Super Admins</p>
                  <p className="text-3xl font-bold text-red-300">{stats.superAdmins}</p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="vega-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-vega-text-2">Admins</p>
                  <p className="text-3xl font-bold text-yellow-300">{stats.admins}</p>
                </div>
                <UserCog className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="vega-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-vega-text-2">Usuários</p>
                  <p className="text-3xl font-bold text-blue-300">{stats.regularUsers}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="vega-card">
          <CardHeader>
            <CardTitle className="text-vega-text">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vega-text-2" />
                <input
                  type="text"
                  placeholder="Buscar por email ou nome..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-vega-text-2 focus:outline-none focus:border-vega-neon"
                />
              </div>

              {/* Filtro por Role */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRole('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRole === 'all'
                      ? 'bg-vega-neon text-slate-900 font-semibold'
                      : 'bg-slate-800/50 text-vega-text-2 hover:bg-slate-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedRole('super_admin')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRole === 'super_admin'
                      ? 'bg-red-500 text-white font-semibold'
                      : 'bg-slate-800/50 text-vega-text-2 hover:bg-slate-800'
                  }`}
                >
                  Super Admins
                </button>
                <button
                  onClick={() => setSelectedRole('admin')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRole === 'admin'
                      ? 'bg-yellow-500 text-slate-900 font-semibold'
                      : 'bg-slate-800/50 text-vega-text-2 hover:bg-slate-800'
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setSelectedRole('user')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRole === 'user'
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-slate-800/50 text-vega-text-2 hover:bg-slate-800'
                  }`}
                >
                  Usuários
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card className="vega-card">
          <CardHeader>
            <CardTitle className="text-vega-text">
              Usuários ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-vega-text-2">
              Gerencie roles e permissões dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-500/30">
                    <th className="text-left py-3 px-4 text-vega-text-2 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-vega-text-2 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 text-vega-text-2 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-vega-text-2 font-semibold">Criado em</th>
                    <th className="text-center py-3 px-4 text-vega-text-2 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-blue-500/10 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-vega-text">{user.email}</td>
                      <td className="py-3 px-4 text-vega-text">{user.nome || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-vega-text-2">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Dropdown de Role */}
                          <select
                            value={user.role}
                            onChange={e => handleUpdateRole(user.id, e.target.value as any)}
                            className="bg-slate-800/50 border border-blue-500/30 rounded px-2 py-1 text-sm text-vega-text focus:outline-none focus:border-vega-neon"
                          >
                            <option value="user">Usuário</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>

                          {/* Botão Deletar */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Deletar usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-vega-text-2">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
