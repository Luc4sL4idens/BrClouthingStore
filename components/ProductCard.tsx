import Image from 'next/image'
import { Produto } from '@/types'
import { formatarMoeda } from '@/lib/utils'

interface ProductCardProps {
  produto: Produto
  onComprar: (produto: Produto) => void
}

/**
 * Componente ProductCard - Exibe um produto com imagem, descrição e botão de compra
 */
export default function ProductCard({ produto, onComprar }: ProductCardProps) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      {/* Imagem do produto */}
      <div className="relative h-64 bg-gray-200">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary mb-2">
          {produto.nome}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {produto.descricao}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-highlight">
            {formatarMoeda(produto.preco)}
          </span>
          <button
            onClick={() => onComprar(produto)}
            className="btn-primary text-sm"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}
