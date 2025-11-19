-- BrClouthingStore - Schema do Banco de Dados
-- Execute este script no SQL Editor do Supabase

-- Tabela de usuários
-- Armazena informações completas dos usuários cadastrados
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  endereco TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
-- Catálogo de roupas disponíveis para venda
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compras
-- Registro de todas as transações realizadas
CREATE TABLE IF NOT EXISTS compras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID NOT NULL REFERENCES usuarios(id),
  id_produto UUID NOT NULL REFERENCES produtos(id),
  valor DECIMAL(10, 2) NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  chave_pix VARCHAR(255) NOT NULL
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(id_usuario);
CREATE INDEX IF NOT EXISTS idx_compras_produto ON compras(id_produto);

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON usuarios FOR SELECT
  USING (auth.uid()::text = id::text);

-- Usuários podem atualizar seus próprios dados
CREATE POLICY "Usuários podem atualizar seus dados"
  ON usuarios FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Políticas para produtos
-- Todos podem ver os produtos
CREATE POLICY "Todos podem ver produtos"
  ON produtos FOR SELECT
  TO public
  USING (true);

-- Políticas para compras
-- Usuários podem ver apenas suas próprias compras
CREATE POLICY "Usuários veem suas compras"
  ON compras FOR SELECT
  USING (auth.uid()::text = id_usuario::text);

-- Usuários podem criar suas próprias compras
CREATE POLICY "Usuários podem criar compras"
  ON compras FOR INSERT
  WITH CHECK (auth.uid()::text = id_usuario::text);

-- Inserir produtos de exemplo
INSERT INTO produtos (nome, descricao, preco, imagem_url) VALUES
  ('Camiseta Básica Preta', 'Camiseta 100% algodão, cor preta, confortável e versátil', 49.90, 'https://placehold.co/400x500/000000/FFFFFF?text=Camiseta+Preta'),
  ('Calça Jeans Slim', 'Calça jeans slim fit, lavagem escura, ajuste perfeito', 189.90, 'https://placehold.co/400x500/1a5490/FFFFFF?text=Calça+Jeans'),
  ('Jaqueta Corta-Vento', 'Jaqueta leve e resistente à água, ideal para dias frescos', 259.90, 'https://placehold.co/400x500/2d3748/FFFFFF?text=Jaqueta'),
  ('Vestido Floral', 'Vestido feminino com estampa floral, tecido leve e fluido', 149.90, 'https://placehold.co/400x500/e94560/FFFFFF?text=Vestido'),
  ('Moletom Cinza', 'Moletom com capuz, cor cinza mescla, super confortável', 129.90, 'https://placehold.co/400x500/808080/FFFFFF?text=Moletom'),
  ('Camisa Social Branca', 'Camisa social masculina, tecido anti-amassado, branca', 99.90, 'https://placehold.co/400x500/FFFFFF/000000?text=Camisa+Social'),
  ('Short Jeans', 'Short jeans com barra desfiada, estilo casual', 79.90, 'https://placehold.co/400x500/4a5568/FFFFFF?text=Short'),
  ('Blazer Preto', 'Blazer feminino preto, corte moderno e elegante', 299.90, 'https://placehold.co/400x500/000000/FFFFFF?text=Blazer'),
  ('Regata Esportiva', 'Regata dry-fit para atividades físicas, várias cores', 39.90, 'https://placehold.co/400x500/059669/FFFFFF?text=Regata'),
  ('Saia Midi', 'Saia midi plissada, tecido fluido, cores variadas', 119.90, 'https://placehold.co/400x500/c026d3/FFFFFF?text=Saia');

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Dados dos usuários cadastrados no sistema';
COMMENT ON TABLE produtos IS 'Catálogo de produtos disponíveis para venda';
COMMENT ON TABLE compras IS 'Registro histórico de todas as compras realizadas';
