'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/components/Loading'

/**
 * Página de Login
 * Permite que usuários cadastrados façam login no sistema
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { signIn, user, loading } = useAuth()
  const router = useRouter()

  // Redireciona se já estiver logado
  if (!loading && user) {
    router.push('/produtos')
    return null
  }

  if (loading) {
    return <Loading />
  }

  /**
   * Processa o formulário de login
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    // Validação básica
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos')
      setCarregando(false)
      return
    }

    try {
      await signIn(email, senha)
      router.push('/produtos')
    } catch (error: any) {
      setErro(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          {/* Card de Login */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary text-center mb-8">
              Entrar na sua conta
            </h1>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Link para cadastro */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="text-highlight font-semibold hover:underline">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
