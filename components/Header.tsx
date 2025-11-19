'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

/**
 * Componente Header - Barra de navegação principal
 * Exibe diferentes opções dependendo se o usuário está logado ou não
 */
export default function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <header className="bg-primary text-white shadow-lg">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-highlight transition-colors">
            BrClouthingStore
          </Link>

          {/* Menu de navegação */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`hover:text-highlight transition-colors ${pathname === '/' ? 'text-highlight' : ''}`}
            >
              Início
            </Link>

            <Link
              href="/produtos"
              className={`hover:text-highlight transition-colors ${pathname === '/produtos' ? 'text-highlight' : ''}`}
            >
              Produtos
            </Link>

            {user ? (
              <>
                <span className="text-sm">Olá, {user.nome.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-highlight px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-highlight transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-highlight px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
