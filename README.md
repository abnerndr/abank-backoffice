# ABank Backoffice

Painel administrativo da solução **ABank** — gestão de usuários, crédito de saldo, histórico de transações e aprovação/rejeição de solicitações de estorno.

Interface em **Next.js 16** com acesso restrito a usuários com role **admin**, consumindo a API [`abank-api`](../abank-api).

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| HTTP | axios (Server Actions) |
| Estado | Zustand |
| Dados | TanStack React Query |
| Formulários | react-hook-form + Zod |
| Feedback | sonner (toasts) |
| Ícones | lucide-react |

---

## Pré-requisitos

- **Node.js** >= 20.9
- **yarn** (gerenciador usado neste projeto — `yarn.lock`)
- **[abank-api](../abank-api)** rodando (padrão: `http://localhost:8000`)
- Credenciais de **admin** criadas pelo seed da API
- **WSL2** (Ubuntu): caminho típico `/home/abner/www/abnerndr/abank-backoffice`

---

## Configuração

### 1. Subir a API primeiro

```bash
cd /home/abner/www/abnerndr/abank-api
docker compose up -d db
pnpm install
cp .env.example .env   # PORT=8000, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL
pnpm seed
pnpm start:dev
```

### 2. Instalar dependências do backoffice

```bash
cd /home/abner/www/abnerndr/abank-backoffice
yarn install
```

### 3. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
EOF
```

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL da API (acessível no client) | `http://localhost:8000` |
| `API_URL` | URL da API para Server Actions | `http://localhost:8000` |

Se omitidas, o código usa `http://localhost:8000` como fallback.

---

## Como rodar

### Desenvolvimento

```bash
yarn dev
```

Abra **http://localhost:5000**

> A porta **5000** está fixada nos scripts `dev` e `start` do `package.json`.

### Build de produção

```bash
yarn build
yarn start
```

### Lint

```bash
yarn lint
```

---

## Portas e URLs

| Serviço | URL |
|---------|-----|
| Backoffice (este projeto) | http://localhost:5000 |
| API (backend) | http://localhost:8000 |
| App cliente | http://localhost:3000 |
| Docs da API | http://localhost:8000/docs |

---

## Credenciais de teste

Login **somente com conta admin** (criada pelo seed da API):

| Campo | Valor padrão |
|-------|--------------|
| E-mail | `admin@example.com` |
| Senha | `admin123` |

Definidos em `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` da API.

Usuários comuns (`alice@abank.dev`, `bob@abank.dev`) **não** têm acesso ao backoffice.

---

## Funcionalidades principais

### Autenticação
- Login JWT restrito a role `admin`
- Middleware protege rotas `/dashboard`, `/usuarios`, `/transacoes`, `/saldo`, `/estornos`
- Refresh automático de token via cookies httpOnly

### Dashboard (`/dashboard`)
- Estatísticas de usuários e transações
- Saldo da carteira admin
- Transações recentes

### Usuários (`/usuarios`)
- Listagem com busca e paginação
- Detalhe do usuário com saldo da carteira
- Verificação manual de conta

### Transações (`/transacoes`)
- Histórico completo (depósitos, transferências, estornos)
- Filtros e paginação

### Adicionar saldo (`/saldo`)
- Transferência da carteira admin para carteira de um usuário
- Não existe endpoint de crédito direto — usa-se `POST /api/wallet/transfer`

### Estornos (`/estornos`)
- Lista solicitações de estorno pendentes dos usuários
- **Aprovar** — executa reversão da transação
- **Rejeitar** — descarta a solicitação
- Estorno direto de transações reversíveis (sem solicitação prévia)

---

## Relação com os outros projetos

Ordem de subida:

```
1. abank-api        → backend + seed (porta 8000)
2. abank-backoffice → este painel (porta 5000)
3. abank-app        → app do cliente (porta 3000, opcional para testar fluxo completo)
```

| Projeto | Função |
|---------|--------|
| [`abank-api`](../abank-api) | Fonte de dados — **obrigatório** |
| [`abank-app`](../abank-app) | App do cliente — usuários solicitam estornos aqui |

Fluxo típico de estorno:
1. Usuário solicita estorno no **app**
2. Admin aprova ou rejeita no **backoffice** (`/estornos`)

Documentação do fluxo: [`../abank-api/docs/REVERSAL.md`](../abank-api/docs/REVERSAL.md)

---

## Estrutura de pastas (visão geral)

```
abank-backoffice/
├── app/
│   ├── login/                  # Tela de login admin
│   ├── (admin)/                # Rotas protegidas
│   │   ├── dashboard/
│   │   ├── usuarios/           # Lista e detalhe
│   │   ├── transacoes/
│   │   ├── saldo/              # Creditar usuário
│   │   └── estornos/           # Aprovar/rejeitar estornos
│   ├── components/             # UI (tabelas, forms, shell)
│   └── lib/
│       ├── actions/            # Server Actions
│       ├── api/                # axios, sessão, cookies
│       ├── queries/            # React Query
│       ├── mutations/          # Mutações de wallet
│       └── schemas/            # Zod
├── middleware.ts               # Guard de rotas admin
└── package.json
```

---

## Integração com a API

| Ação | Endpoint |
|------|----------|
| Login | `POST /api/auth/login` |
| Sessão | `GET /api/auth/me` |
| Listar usuários | `GET /api/users` |
| Estatísticas | `GET /api/users/stats` |
| Verificar usuário | `PUT /api/users/:id/verify` |
| Saldo admin | `GET /api/wallet/me` |
| Creditar usuário | `POST /api/wallet/transfer` |
| Listar transações (admin) | `GET /api/admin/wallet/transactions` |
| Solicitações de estorno | `GET /api/admin/wallet/refund-requests` |
| Aprovar estorno | `POST /api/admin/wallet/refund-requests/:id/approve` |
| Rejeitar estorno | `POST /api/admin/wallet/refund-requests/:id/reject` |
| Reversão direta | `POST /api/wallet/transactions/:id/reverse` |

Cookies de sessão: `abank_bo_access_token`, `abank_bo_refresh_token`.

---

## Comandos úteis

```bash
# Desenvolvimento (porta 5000)
yarn dev

# Build + produção
yarn build && yarn start

# Verificar tipos
npx tsc --noEmit
```

### Fluxo de teste rápido

1. Garantir API rodando com seed (`admin@example.com` / `admin123`)
2. Abrir http://localhost:5000/login
3. Acessar **Dashboard** → conferir stats
4. Em **Usuários**, abrir Alice → ver saldo
5. Em **Saldo**, transferir valor da carteira admin para um usuário
6. No **app** (Alice), solicitar estorno de uma transferência
7. No backoffice **Estornos**, aprovar ou rejeitar

---

## Limitações conhecidas

- Crédito em carteira de terceiros usa transferência da carteira admin (não há endpoint de crédito direto)
- "Rejeitar estorno" descarta a solicitação via API — não executa reversão parcial

---

## Licença

Privado — parte do teste técnico ABank.
