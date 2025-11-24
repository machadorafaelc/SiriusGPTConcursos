-- Script para confirmar email do usuário manualmente
-- Execute este script no Supabase SQL Editor

-- Confirmar email do usuário caiosantiago11@gmail.com
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'caiosantiago11@gmail.com';

-- Verificar se foi atualizado
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = 'caiosantiago11@gmail.com';
