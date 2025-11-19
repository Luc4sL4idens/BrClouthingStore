'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/Loading'

/**
 * Página inicial do BrClouthingStore
 * Apresenta a marca e direciona para produtos ou cadastro
 */
export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bem-vindo à BrClouthingStore
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            As melhores roupas e tendências da moda em um só lugar
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/produtos" className="btn-primary text-lg">
              Ver Produtos
            </Link>
            {!user && (
              <Link href="/cadastro" className="btn-secondary text-lg">
                Criar Conta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Por que escolher a BrClouthingStore?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-highlight rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-xl font-semibold mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600">
                Produtos selecionados com os melhores materiais e acabamento
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-highlight rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamento Fácil</h3>
              <p className="text-gray-600">
                Pague com PIX de forma rápida e segura
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-highlight rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Receba seus produtos no conforto da sua casa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent to-secondary text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para renovar seu guarda-roupa?
          </h2>
          <p className="text-xl mb-8">
            Confira nossa coleção completa de roupas e acessórios
          </p>
          <Link href="/produtos" className="btn-primary text-lg">
            Explorar Produtos
          </Link>
        </div>
      </section>
    </div>
  )
}
