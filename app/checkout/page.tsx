'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Produto } from '@/types'
import { formatarMoeda, gerarChavePIX } from '@/lib/utils'
import Loading from '@/components/Loading'
import Image from 'next/image'

/**
 * Página de Checkout
 * Finaliza a compra com pagamento via PIX
 */
export default function CheckoutPage() {
  const [produto, setProduto] = useState<Produto | null>(null)
  const [chavePix, setChavePix] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const produtoId = searchParams.get('produto')

  /**
   * Verifica autenticação e carrega produto
   */
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
        return
      }
      if (produtoId) {
        carregarProduto(produtoId)
      } else {
        router.push('/produtos')
      }
    }
  }, [user, authLoading, produtoId])

  /**
   * Carrega os dados do produto selecionado
   */
  async function carregarProduto(id: string) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setProduto(data)
      // Gera uma chave PIX para pagamento
      setChavePix(gerarChavePIX())
    } catch (error: any) {
      console.error('Erro ao carregar produto:', error)
      setErro('Produto não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  /**
   * Confirma a compra e registra no banco
   */
  async function confirmarCompra() {
    if (!produto || !user) return

    setProcessando(true)
    setErro('')

    try {
      // Registra a compra no banco de dados
      const { error } = await supabase.from('compras').insert({
        id_usuario: user.id,
        id_produto: produto.id,
        valor: produto.preco,
        chave_pix: chavePix,
      })

      if (error) throw error

      setSucesso(true)

      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push('/produtos')
      }, 3000)
    } catch (error: any) {
      console.error('Erro ao confirmar compra:', error)
      setErro('Erro ao processar compra. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  if (authLoading || carregando) {
    return <Loading />
  }

  if (erro && !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{erro}</p>
          <button onClick={() => router.push('/produtos')} className="btn-primary">
            Voltar aos Produtos
          </button>
        </div>
      </div>
    )
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Compra realizada com sucesso!
          </h2>
          <p className="text-gray-600 mb-4">
            Obrigado por comprar na BrClouthingStore
          </p>
          <p className="text-sm text-gray-500">
            Você será redirecionado em instantes...
          </p>
        </div>
      </div>
    )
  }

  if (!produto) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">
            Finalizar Compra
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Detalhes do Produto */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

              <div className="flex gap-4 mb-6">
                <div className="relative w-24 h-24 bg-gray-200 rounded">
                  {produto.imagem_url && (
                    <Image
                      src={produto.imagem_url}
                      alt={produto.nome}
                      fill
                      className="object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{produto.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {produto.descricao}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Preço:</span>
                  <span className="font-semibold">
                    {formatarMoeda(produto.preco)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-highlight">
                    {formatarMoeda(produto.preco)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pagamento PIX */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Pagamento via PIX</h2>

              <div className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-lg mb-4">
                <p className="text-sm mb-2">Chave PIX para pagamento:</p>
                <p className="font-mono text-sm break-all bg-white/20 p-2 rounded">
                  {chavePix}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2 text-blue-900">
                  Instruções de Pagamento:
                </h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Selecione "Pix Copia e Cola"</li>
                  <li>Cole a chave acima</li>
                  <li>Confirme o pagamento</li>
                  <li>
                    Após pagar, clique em "Confirmar Pagamento" abaixo
                  </li>
                </ol>
              </div>

              {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {erro}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={confirmarCompra}
                  disabled={processando}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processando ? 'Processando...' : 'Confirmar Pagamento'}
                </button>

                <button
                  onClick={() => router.push('/produtos')}
                  className="w-full btn-secondary"
                >
                  Cancelar
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                * Este é um sistema de demonstração. O pagamento PIX é
                simulado e não será processado em um banco real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
