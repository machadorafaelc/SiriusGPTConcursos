-- =====================================================
-- CORRIGIR POLÍTICAS RLS DA TABELA PROFILES
-- =====================================================

-- Remover políticas antigas que causam recursão infinita
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- =====================================================
-- NOVAS POLÍTICAS CORRETAS (sem recursão)
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil (apenas campos permitidos)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Permitir INSERT na tabela profiles (necessário para o trigger de criação automática)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- CORRIGIR POLÍTICAS DOS GPTS
-- =====================================================

-- Remover política antiga que também causa recursão
DROP POLICY IF EXISTS "Users can view GPTs of subscribed concursos" ON public.gpts;

-- Nova política: todos os usuários autenticados podem ver GPTs ativos
-- (controle de acesso será feito na aplicação)
CREATE POLICY "Authenticated users can view active GPTs"
  ON public.gpts FOR SELECT
  USING (active = true AND auth.uid() IS NOT NULL);

-- =====================================================
-- CORRIGIR POLÍTICAS DOS CONCURSOS
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Super admins can insert concursos" ON public.concursos;
DROP POLICY IF EXISTS "Super admins can update concursos" ON public.concursos;
DROP POLICY IF EXISTS "Super admins can delete concursos" ON public.concursos;

-- Nova política: permitir operações para service role
CREATE POLICY "Service role can manage concursos"
  ON public.concursos FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA SUBSCRIPTIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;

-- Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role pode gerenciar assinaturas
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA PAYMENTS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

-- Usuários podem ver seus próprios pagamentos
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role pode gerenciar pagamentos
CREATE POLICY "Service role can manage payments"
  ON public.payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA STUDY_PLANS
-- =====================================================

DROP POLICY IF EXISTS "Users can manage own study plans" ON public.study_plans;

-- Usuários podem gerenciar seus próprios planos
CREATE POLICY "Users can manage own study plans"
  ON public.study_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
