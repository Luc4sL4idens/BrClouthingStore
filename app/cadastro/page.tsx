'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validarCPF, formatarCPF } from '@/lib/utils'
import Loading from '@/components/Loading'

/**
 * Página de Cadastro
 * Permite que novos usuários se registrem no sistema
 */
export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { signUp, user, loading } = useAuth()
  const router = useRouter()

  // Redireciona se já estiver logado
  if (user) {
    router.push('/produtos')
    return <Loading />
  }

  if (loading) {
    return <Loading />
  }

  /**
   * Atualiza os valores do formulário
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Formata CPF automaticamente durante a digitação
    if (name === 'cpf') {
      const apenasNumeros = value.replace(/\D/g, '')
      if (apenasNumeros.length <= 11) {
        setFormData({ ...formData, [name]: apenasNumeros })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  /**
   * Processa o formulário de cadastro
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    // Validações
    if (!formData.nome || !formData.cpf || !formData.endereco || !formData.email || !formData.senha) {
      setErro('Por favor, preencha todos os campos')
      setCarregando(false)
      return
    }

    if (!validarCPF(formData.cpf)) {
      setErro('CPF inválido')
      setCarregando(false)
      return
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      setCarregando(false)
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem')
      setCarregando(false)
      return
    }

    try {
      await signUp({
        nome: formData.nome,
        cpf: formatarCPF(formData.cpf),
        endereco: formData.endereco,
        email: formData.email,
        senha: formData.senha,
      })
      // Redirecionamento automático quando user é definido
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta. Tente novamente.')
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Card de Cadastro */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary text-center mb-8">
              Criar nova conta
            </h1>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="João da Silva"
                  required
                />
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formatarCPF(formData.cpf)}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              {/* Endereço */}
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
                  rows={3}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha * (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
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
                {carregando ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </form>

            {/* Link para login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-highlight font-semibold hover:underline">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
