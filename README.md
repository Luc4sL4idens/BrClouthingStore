# BrClouthingStore - E-commerce de Roupas

Sistema completo de e-commerce de roupas desenvolvido com Next.js, TypeScript e Supabase.

## Funcionalidades

- Página inicial com identidade visual da marca
- Sistema de autenticação (login e cadastro)
- Cadastro de usuários com CPF, endereço, e-mail
- Listagem de produtos
- Sistema de compra com pagamento via PIX
- Registro de todas as transações no banco de dados

## Tecnologias Utilizadas

- **Frontend:** Next.js 14 + React + TypeScript
- **Estilização:** Tailwind CSS
- **Backend:** Supabase (Auth + Database PostgreSQL)
- **Autenticação:** Supabase Auth

## Estrutura do Projeto

```
laidens/
├── app/                    # Páginas do Next.js (App Router)
│   ├── page.tsx           # Página inicial
│   ├── login/             # Página de login
│   ├── cadastro/          # Página de cadastro
│   ├── produtos/          # Listagem de produtos
│   └── checkout/          # Finalização da compra
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos React (Auth)
├── lib/                   # Utilitários e cliente Supabase
├── types/                 # Tipos TypeScript
└── supabase-schema.sql    # Schema do banco de dados
```

## Passo a Passo de Instalação

### 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings > API** e copie:
   - `Project URL`
   - `anon public key`
4. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase-schema.sql`
   - Isso criará as tabelas `usuarios`, `produtos` e `compras`
   - Também inserirá 10 produtos de exemplo

### 2. Configurar as Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o `.env.local` com suas credenciais do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em [http://localhost:3000](http://localhost:3000)

### 5. Build para Produção

```bash
npm run build
npm start
```

## Hospedagem

### Vercel (Recomendado para Next.js)

1. Faça login na [Vercel](https://vercel.com)
2. Importe o repositório
3. Configure as variáveis de ambiente no painel
4. Deploy automático

### Outras Opções

- Netlify
- Railway
- Render
- VM com Node.js

## Estrutura do Banco de Dados

### Tabela `usuarios`
| Campo      | Tipo        | Descrição                    |
|------------|-------------|------------------------------|
| id         | UUID        | Identificador único          |
| nome       | VARCHAR     | Nome completo                |
| cpf        | VARCHAR     | CPF formatado                |
| endereco   | TEXT        | Endereço completo            |
| email      | VARCHAR     | E-mail (único)               |
| created_at | TIMESTAMP   | Data de criação              |

### Tabela `produtos`
| Campo      | Tipo        | Descrição                    |
|------------|-------------|------------------------------|
| id         | UUID        | Identificador único          |
| nome       | VARCHAR     | Nome do produto              |
| descricao  | TEXT        | Descrição                    |
| preco      | DECIMAL     | Preço em reais               |
| imagem_url | TEXT        | URL da imagem                |
| created_at | TIMESTAMP   | Data de criação              |

### Tabela `compras`
| Campo      | Tipo        | Descrição                    |
|------------|-------------|------------------------------|
| id         | UUID        | Identificador único          |
| id_usuario | UUID        | FK para usuarios             |
| id_produto | UUID        | FK para produtos             |
| valor      | DECIMAL     | Valor pago                   |
| data       | TIMESTAMP   | Data da compra               |
| chave_pix  | VARCHAR     | Chave PIX usada              |

## Fluxo de Uso

1. **Página Inicial:** Apresentação da marca e botões de ação
2. **Cadastro:** Usuário preenche nome, CPF, endereço, e-mail e senha
3. **Login:** Autenticação com e-mail e senha
4. **Produtos:** Listagem de todos os produtos disponíveis
5. **Compra:** Seleção do produto e pagamento via PIX simulado
6. **Confirmação:** Registro da compra no banco

## Observações

- O sistema de pagamento PIX é simulado (não integra com banco real)
- As imagens dos produtos são placeholders
- O CPF é validado com algoritmo de verificação
- A senha deve ter no mínimo 6 caracteres

## Licença

MIT
