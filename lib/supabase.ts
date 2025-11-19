import { createClient } from '@supabase/supabase-js'

// Verificação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam variáveis de ambiente do Supabase. Verifique o arquivo .env.local'
  )
}

/**
 * Cliente do Supabase configurado para toda a aplicação
 * Usado para autenticação e acesso ao banco de dados
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
