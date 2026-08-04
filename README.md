# Ozeonix AI Employee – Enterprise AI Business Operating System

[![Phase](https://img.shields.io/badge/Phase_1-Project_Setup_Completed-blue.svg)](https://github.com/Ozeonix/Ozeonix-AI-Employee)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20DDD-green.svg)](docs/architecture/overview.md)
[![Governance](https://img.shields.io/badge/Governance-v1.0%20Frozen-purple.svg)](docs/governance/ARCHITECTURE_FREEZE_v1.0.md)

Ozeonix AI Employee is a modular, cloud-native enterprise SaaS platform for creating and orchestrating autonomous AI Employees across business functions (Sales, Customer Support, Marketing, HR, Recruiting, Operations, Finance, and Project Management).

---

## 📦 Monorepo Directory Layout

```
Ozeonix-AI-Employee/
├── .antigravity/                # Master Bootstrap Prompt & Agent rules
├── .claude/                     # Single-source AI governance directive
├── .gemini/                     # Single-source AI governance directive
├── .github/                     # Copilot instructions & CI workflows
├── .cursor/                     # Cursor AI rules
├── .husky/                      # Git pre-commit hooks (lint-staged)
├── .vscode/                     # Workspace settings
│
├── docs/                        # Enterprise Documentation & Governance
│   ├── PROJECT_CONSTITUTION.md # Primary constitution
│   ├── governance/              # Architecture Freeze v1.0 & Governance Standards
│   ├── architecture/            # System & DDD specs
│   ├── adr/                     # Architectural Decision Records
│   ├── api/                     # OpenAPI specs & API guides
│   ├── database/                # ER diagrams & DDL docs
│   ├── deployment/              # Docker & production scaling guides
│   └── roadmap/                 # 60-Step Roadmap
│
├── backend/                     # Node.js + Express + TypeScript Core Engine
│   ├── src/                     # Clean Architecture (config, routes, controllers, services, middlewares, utils, types, database, prisma)
│   ├── package.json             # pnpm dependencies & scripts
│   ├── tsconfig.json            # TypeScript path aliases
│   └── .eslintrc.json           # ESLint configuration
│
├── frontend/                    # React / Next.js UI structure
├── database/                    # Prisma ORM schema, seed, DDL & migrations
├── infrastructure/              # Docker Compose & Dockerfiles
├── automation/                  # n8n & BullMQ workflow engine
├── ai/                          # Multi-model AI routing (Gemini, Claude, OpenAI, Ollama)
├── integrations/                # WhatsApp, Email, Webhook drivers
├── scripts/                     # DevOps helper scripts
├── tests/                       # Global E2E & integration tests
├── tools/                       # Developer CLI tools
├── examples/                    # Integration examples
├── templates/                   # Architecture templates
├── assets/                      # Static branding assets
└── .archive/                    # Historical snapshots
```

---

## 🚀 Environment Variables Documentation

Configuration is validated at startup using Zod in `backend/src/config/env.ts`.

| Variable Name | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`development`, `test`, `production`) | `development` | Yes |
| `PORT` | HTTP server listening port | `3000` | Yes |
| `API_PREFIX` | Base REST API route prefix | `/api/v1` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | **Yes** |
| `LOG_LEVEL` | Logging level (`fatal`, `error`, `warn`, `info`, `debug`) | `info` | Yes |
| `JWT_SECRET` | Secret key for signing access JWT tokens | - | **Yes** |
| `JWT_EXPIRES_IN` | JWT access token expiration duration | `1d` | Yes |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | - | **Yes** |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration duration | `7d` | Yes |
| `REDIS_HOST` | Redis cache hostname | `localhost` | Yes |
| `REDIS_PORT` | Redis cache port | `6379` | Yes |
| `CORS_ORIGIN` | Allowed HTTP origin whitelist | `*` | Yes |

---

## 🛠️ Quick Start & Setup Instructions

### 1. Prerequisite
- **pnpm** `v9.5.0` (`npm install -g pnpm`)
- **Docker & Docker Compose** `v2+`

### 2. Environment Initialization
```bash
cp backend/.env.example backend/.env
```

### 3. Launch Local Support Infrastructure (PostgreSQL 16 + Redis 7)
```bash
cd infrastructure
docker-compose up -d --build
```

### 4. Run Database Schema & Seed Data
```bash
cd database
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 5. Start Backend Server
```bash
cd backend
pnpm run dev
```

API Endpoint: `http://localhost:3000/api/v1`  
Swagger Documentation: `http://localhost:3000/api-docs`

---

## 📜 Available NPM Scripts (`backend/package.json`)

- `pnpm run dev`: Start local development server with auto-reload (`ts-node-dev`).
- `pnpm run build`: Compile TypeScript code into `dist/`.
- `pnpm run start`: Run compiled production bundle.
- `pnpm run lint`: Execute ESLint check.
- `pnpm run lint:fix`: Execute ESLint fix automatically.
- `pnpm run format`: Format code using Prettier.
- `pnpm run test`: Run Jest test suite.

---

## 🏛️ Absolute Source of Truth
1. Primary Constitution: [docs/PROJECT_CONSTITUTION.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/PROJECT_CONSTITUTION.md)
2. Architecture Freeze v1.0: [docs/governance/ARCHITECTURE_FREEZE_v1.0.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/governance/ARCHITECTURE_FREEZE_v1.0.md)
3. Governance Suite: [docs/governance/](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/governance/)
