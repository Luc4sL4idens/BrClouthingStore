import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BrClouthingStore - Moda e Estilo',
  description: 'E-commerce completo de roupas com as melhores marcas e tendências',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-primary text-white py-8 mt-16">
            <div className="container-custom text-center">
              <p>&copy; 2024 BrClouthingStore - Todos os direitos reservados</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
