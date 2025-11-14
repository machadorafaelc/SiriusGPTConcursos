-- =====================================================
-- SCHEMA DO BANCO DE DADOS - SIRIUS GPT CONCURSOS
-- Backend: Supabase (PostgreSQL)
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: profiles (extensão de auth.users do Supabase)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  telefone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(active);

-- =====================================================
-- TABELA: concursos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.concursos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  orgao TEXT NOT NULL,
  cargo TEXT NOT NULL,
  banca TEXT,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'encerrado')),
  preco INTEGER NOT NULL, -- em centavos (ex: 9900 = R$ 99,00)
  imagem_url TEXT,
  disciplinas TEXT[] DEFAULT '{}', -- array de disciplinas
  ordem INTEGER DEFAULT 0, -- ordem de exibição
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_concursos_status ON public.concursos(status);
CREATE INDEX IF NOT EXISTS idx_concursos_ordem ON public.concursos(ordem);

-- =====================================================
-- TABELA: gpts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gpts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  concurso_id UUID REFERENCES public.concursos(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  agent_id TEXT NOT NULL, -- identificador interno (ex: "da", "dc", "orientador")
  descricao TEXT,
  icone TEXT, -- emoji ou URL
  ordem INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_gpts_concurso_id ON public.gpts(concurso_id);
CREATE INDEX IF NOT EXISTS idx_gpts_active ON public.gpts(active);
CREATE INDEX IF NOT EXISTS idx_gpts_ordem ON public.gpts(ordem);

-- =====================================================
-- TABELA: subscriptions (assinaturas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concurso_id UUID REFERENCES public.concursos(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE, -- null = vitalício
  payment_id UUID, -- referência ao pagamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que usuário não tenha assinatura duplicada para mesmo concurso
  UNIQUE(user_id, concurso_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_concurso_id ON public.subscriptions(concurso_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- =====================================================
-- TABELA: payments (pagamentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concurso_id UUID REFERENCES public.concursos(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- em centavos
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('credit_card', 'pix', 'boleto', 'manual')),
  transaction_id TEXT, -- ID do gateway de pagamento (Stripe, Mercado Pago, etc)
  metadata JSONB, -- dados extras do pagamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_concurso_id ON public.payments(concurso_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);

-- =====================================================
-- TABELA: study_plans (planos de estudo)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concurso_id UUID REFERENCES public.concursos(id) ON DELETE CASCADE,
  tempo_estudo_diario NUMERIC,
  disciplina_da_semana TEXT,
  metodo_estudo TEXT,
  dias_estudo TEXT[],
  horario_preferencial TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_ativo ON public.study_plans(ativo);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concursos_updated_at BEFORE UPDATE ON public.concursos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpts_updated_at BEFORE UPDATE ON public.gpts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar profile automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile ao registrar
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: profiles
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Super admins podem ver todos os perfis
CREATE POLICY "Super admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Super admins podem atualizar qualquer perfil
CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- POLICIES: concursos
-- =====================================================

-- Todos podem ver concursos ativos
CREATE POLICY "Anyone can view active concursos"
  ON public.concursos FOR SELECT
  USING (status = 'ativo' OR status = 'inativo');

-- Apenas super admins podem inserir concursos
CREATE POLICY "Super admins can insert concursos"
  ON public.concursos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Apenas super admins podem atualizar concursos
CREATE POLICY "Super admins can update concursos"
  ON public.concursos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Apenas super admins podem deletar concursos
CREATE POLICY "Super admins can delete concursos"
  ON public.concursos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- POLICIES: gpts
-- =====================================================

-- Usuários podem ver GPTs de concursos que têm acesso
CREATE POLICY "Users can view GPTs of subscribed concursos"
  ON public.gpts FOR SELECT
  USING (
    active = true AND (
      -- Super admin vê tudo
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
      )
      OR
      -- Usuário com assinatura ativa
      EXISTS (
        SELECT 1 FROM public.subscriptions
        WHERE user_id = auth.uid()
          AND concurso_id = gpts.concurso_id
          AND status = 'active'
      )
    )
  );

-- Apenas super admins podem gerenciar GPTs
CREATE POLICY "Super admins can manage GPTs"
  ON public.gpts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- POLICIES: subscriptions
-- =====================================================

-- Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Super admins podem ver todas as assinaturas
CREATE POLICY "Super admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Apenas super admins podem inserir/atualizar assinaturas
CREATE POLICY "Super admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- POLICIES: payments
-- =====================================================

-- Usuários podem ver seus próprios pagamentos
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Super admins podem ver todos os pagamentos
CREATE POLICY "Super admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Apenas super admins podem gerenciar pagamentos
CREATE POLICY "Super admins can manage payments"
  ON public.payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- POLICIES: study_plans
-- =====================================================

-- Usuários podem ver e gerenciar seus próprios planos
CREATE POLICY "Users can manage own study plans"
  ON public.study_plans FOR ALL
  USING (auth.uid() = user_id);

-- Super admins podem ver todos os planos
CREATE POLICY "Super admins can view all study plans"
  ON public.study_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir concurso de exemplo
INSERT INTO public.concursos (nome, orgao, cargo, banca, descricao, preco, disciplinas, ordem, status)
VALUES (
  'Câmara dos Deputados - Policial Legislativo Federal',
  'Câmara dos Deputados',
  'Policial Legislativo Federal',
  'CESPE/CEBRASPE',
  'Concurso para Policial Legislativo Federal da Câmara dos Deputados com salário inicial de R$ 15.000,00',
  9900, -- R$ 99,00
  ARRAY['Direito Administrativo', 'Direito Constitucional', 'Direito Penal', 'Português', 'Raciocínio Lógico'],
  1,
  'ativo'
)
ON CONFLICT DO NOTHING;

-- Inserir GPTs do concurso de exemplo
DO $$
DECLARE
  concurso_id_var UUID;
BEGIN
  SELECT id INTO concurso_id_var FROM public.concursos WHERE nome LIKE 'Câmara dos Deputados%' LIMIT 1;
  
  IF concurso_id_var IS NOT NULL THEN
    INSERT INTO public.gpts (concurso_id, nome, disciplina, agent_id, descricao, icone, ordem)
    VALUES
      (concurso_id_var, 'GPT Orientador', 'Orientação', 'orientador', 'Seu assistente pessoal para criar planos de estudos adaptativos', '🌟', 0),
      (concurso_id_var, 'GPT Direito Administrativo', 'Direito Administrativo', 'da', 'Especialista em Direito Administrativo', '⚖️', 1),
      (concurso_id_var, 'GPT Direito Constitucional', 'Direito Constitucional', 'dc', 'Especialista em Direito Constitucional', '📜', 2),
      (concurso_id_var, 'GPT Direito Penal', 'Direito Penal', 'dp', 'Especialista em Direito Penal', '🚔', 3),
      (concurso_id_var, 'GPT Português', 'Português', 'port', 'Especialista em Língua Portuguesa', '📚', 4),
      (concurso_id_var, 'GPT Raciocínio Lógico', 'Raciocínio Lógico', 'rl', 'Especialista em Raciocínio Lógico', '🔢', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Usuários com suas assinaturas ativas
CREATE OR REPLACE VIEW public.users_with_subscriptions AS
SELECT 
  p.id,
  p.email,
  p.nome,
  p.role,
  p.active,
  COUNT(s.id) FILTER (WHERE s.status = 'active') as active_subscriptions,
  ARRAY_AGG(c.nome) FILTER (WHERE s.status = 'active') as concursos
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
LEFT JOIN public.concursos c ON s.concurso_id = c.id
GROUP BY p.id, p.email, p.nome, p.role, p.active;

-- View: Relatório de vendas
CREATE OR REPLACE VIEW public.sales_report AS
SELECT 
  c.nome as concurso,
  COUNT(s.id) as total_subscriptions,
  COUNT(s.id) FILTER (WHERE s.status = 'active') as active_subscriptions,
  SUM(p.amount) FILTER (WHERE p.status = 'approved') as total_revenue
FROM public.concursos c
LEFT JOIN public.subscriptions s ON c.id = s.concurso_id
LEFT JOIN public.payments p ON s.payment_id = p.id
GROUP BY c.id, c.nome;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Perfis de usuários (extensão de auth.users)';
COMMENT ON TABLE public.concursos IS 'Concursos públicos disponíveis';
COMMENT ON TABLE public.gpts IS 'GPTs especializados por concurso';
COMMENT ON TABLE public.subscriptions IS 'Assinaturas de usuários em concursos';
COMMENT ON TABLE public.payments IS 'Histórico de pagamentos';
COMMENT ON TABLE public.study_plans IS 'Planos de estudo personalizados';
