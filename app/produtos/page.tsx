'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Produto } from '@/types'
import ProductCard from '@/components/ProductCard'
import Loading from '@/components/Loading'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Página de Produtos
 * Lista todos os produtos disponíveis para compra
 */
export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  /**
   * Carrega os produtos do banco de dados
   */
  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProdutos(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error)
      setErro('Erro ao carregar produtos. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  /**
   * Inicia o processo de compra de um produto
   */
  const handleComprar = (produto: Produto) => {
    // Verifica se o usuário está logado
    if (!user) {
      alert('Você precisa estar logado para comprar. Redirecionando para login...')
      router.push('/login')
      return
    }

    // Redireciona para a página de checkout com o produto selecionado
    router.push(`/checkout?produto=${produto.id}`)
  }

  if (authLoading || carregando) {
    return <Loading />
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{erro}</p>
          <button onClick={carregarProdutos} className="btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Nossa Coleção
          </h1>
          <p className="text-xl text-gray-600">
            Confira os melhores produtos em moda e estilo
          </p>
        </div>

        {/* Grid de Produtos */}
        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum produto disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onComprar={handleComprar}
              />
            ))}
          </div>
        )}

        {/* Informação adicional */}
        {!user && produtos.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              <strong>Dica:</strong> Faça login ou cadastre-se para poder comprar nossos produtos!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
