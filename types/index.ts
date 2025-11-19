// Tipos do banco de dados Supabase

/**
 * Interface para o usuário no sistema
 */
export interface Usuario {
  id: string
  nome: string
  cpf: string
  endereco: string
  email: string
  created_at: string
}

/**
 * Interface para cadastro de novo usuário
 */
export interface CadastroUsuario {
  nome: string
  cpf: string
  endereco: string
  email: string
  senha: string
}

/**
 * Interface para produtos disponíveis
 */
export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  imagem_url?: string
  created_at?: string
}

/**
 * Interface para registro de compras
 */
export interface Compra {
  id: string
  id_usuario: string
  id_produto: string
  valor: number
  data: string
  chave_pix: string
}

/**
 * Interface para criar nova compra
 */
export interface NovaCompra {
  id_usuario: string
  id_produto: string
  valor: number
  chave_pix: string
}

/**
 * Interface para itens do carrinho
 */
export interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

/**
 * Interface para contexto de autenticação
 */
export interface AuthContextType {
  user: Usuario | null
  loading: boolean
  signIn: (email: string, senha: string) => Promise<void>
  signUp: (data: CadastroUsuario) => Promise<void>
  signOut: () => Promise<void>
}
