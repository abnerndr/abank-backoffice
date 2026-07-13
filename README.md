# ABank Backoffice

Painel administrativo para gestão de usuários, crédito de saldo e aprovação de estornos.

## Pré-requisitos

- Node.js **>= 20.9**
- [abank-api](https://github.com/abnerndr/abank-api) rodando (padrão: `http://localhost:8000`)
- Credenciais de admin (seed da API: `admin@example.com` / `admin123`)

## Configuração

```bash
cp .env.local.example .env.local
yarn install
```

## Desenvolvimento

```bash
yarn dev
```

Abra [http://localhost:5000](http://localhost:5000).

## Build

```bash
yarn build
yarn start
```

## Funcionalidades

- **Login** — autenticação JWT (somente role `admin`)
- **Dashboard** — estatísticas de usuários, saldo admin e transações recentes
- **Usuários** — listagem, busca, verificação e detalhes com saldo
- **Transações** — histórico completo (depósitos, transferências, estornos) com paginação
- **Adicionar saldo** — transferência da carteira admin para usuários
- **Estornos** — aprovação de reversão de depósitos/transferências

## Integração com a API

| Ação | Endpoint |
|------|----------|
| Login | `POST /api/auth/login` |
| Sessão | `GET /api/auth/me` |
| Listar usuários | `GET /api/users` |
| Stats | `GET /api/users/stats` |
| Verificar usuário | `PUT /api/users/:id/verify` |
| Saldo admin | `GET /api/wallet/me` |
| Depósito admin | `POST /api/wallet/deposit` |
| Creditar usuário | `POST /api/wallet/transfer` |
| Listar transações | `GET /api/admin/wallet/transactions` |
| Aprovar estorno | `POST /api/wallet/transactions/:id/reverse` |

## Limitações conhecidas

- Não existe endpoint de crédito direto em carteira de terceiros — usa-se transferência da carteira admin
- Não há fila de estornos pendentes — a tela lista transações reversíveis
- "Rejeitar estorno" é apenas descarte local na sessão (sem endpoint na API)
