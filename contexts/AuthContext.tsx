'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthContextType, Usuario, CadastroUsuario } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider de autenticação
 * Gerencia o estado do usuário logado e funções de login/cadastro/logout
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica se há um usuário logado ao carregar
    checkUser()

    // Escuta mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  /**
   * Verifica se há um usuário logado
   */
  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user.id)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Carrega os dados completos do usuário do banco
   */
  async function loadUserData(userId: string) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  /**
   * Realiza login do usuário
   */
  async function signIn(email: string, senha: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) throw error

      if (data.user) {
        await loadUserData(data.user.id)
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login')
    }
  }

  /**
   * Cadastra um novo usuário
   */
  async function signUp(cadastro: CadastroUsuario) {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cadastro.email,
        password: cadastro.senha,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      // 2. Inserir dados adicionais na tabela usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          nome: cadastro.nome,
          cpf: cadastro.cpf,
          endereco: cadastro.endereco,
          email: cadastro.email,
        })

      if (dbError) throw dbError

      // 3. Fazer login automático
      await signIn(cadastro.email, cadastro.senha)
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao cadastrar usuário')
    }
  }

  /**
   * Faz logout do usuário
   */
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout')
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
