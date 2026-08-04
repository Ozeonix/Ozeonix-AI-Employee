# Ozeonix AI Employee – Enterprise Business Operating System

Ozeonix AI Employee is a modular, scalable, cloud-native enterprise SaaS platform for deploying autonomous AI Employees across business operations.

---

## 📦 Modular Repository Architecture

```
Ozeonix-AI-Employee/
├── .github/                     # Copilot instructions & CI workflows
├── .antigravity/                # AGENTS.md rules
├── .claude/                     # CLAUDE.md guidelines
├── .gemini/                     # GEMINI.md guidelines
├── .cursor/                     # rules.md for Cursor
├── .vscode/                     # Workspace settings & configuration
│
├── docs/                        # Subdirectories: architecture/, adr/, api/, database/, diagrams/, deployment/, roadmap/, security/
├── backend/                     # Node.js + Express + TypeScript Core Engine
├── frontend/                    # Modern React / Next.js UI
├── database/                    # Prisma ORM, DDL, seed scripts & migrations
├── infrastructure/              # Docker, NGINX, Cloudflare & K8s
├── automation/                  # n8n & BullMQ workflows
├── ai/                          # AI Model Providers & Prompts
├── integrations/                # Integration drivers (WhatsApp, Email, Webhooks)
├── scripts/                     # DevOps helper scripts
├── tests/                       # Global integration test suite
├── tools/                       # Developer tools
├── examples/                    # Sample integration scripts
├── templates/                   # Architecture templates
├── assets/                      # Static branding assets
└── .archive/                    # Historical snapshots
```

---

## 🚀 Quick Start Guide

### 1. Environment Setup
```bash
cp backend/.env.example backend/.env
```

### 2. Infrastructure Containers
```bash
cd infrastructure
docker-compose up -d --build
```

### 3. Database Migration & Seed
```bash
cd database
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 4. Backend Server Run
```bash
cd backend
npm run dev
```

API Server: `http://localhost:3000/api/v1`  
OpenAPI Specs: `http://localhost:3000/api-docs`

---

## 📚 Master Documentation

- Master Constitution: [docs/PROJECT_CONSTITUTION.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/PROJECT_CONSTITUTION.md)
- Architecture Overview: [docs/architecture/overview.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/architecture/overview.md)
- ADR 001: [docs/adr/ADR-001-clean-architecture.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/adr/ADR-001-clean-architecture.md)
- Developer Onboarding: [docs/development/developer-guide.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/development/developer-guide.md)
- Development Roadmap: [docs/roadmap/roadmap.md](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/docs/roadmap/roadmap.md)
