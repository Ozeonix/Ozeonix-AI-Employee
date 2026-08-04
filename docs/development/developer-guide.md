# Developer Onboarding & Contribution Guide

## Prerequisites
- Node.js v20+
- Docker Engine & Docker Compose v2+
- PostgreSQL 16
- Git

## Folder Organization
- `/backend`: Node.js Express TypeScript API server.
- `/database`: Prisma schema, migrations, and seed scripts.
- `/infrastructure`: Docker & environment setup.
- `/docs`: Architectural Decision Records (ADRs) & specs.

## Getting Started
```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Run Database & Infrastructure
cd ../infrastructure
docker-compose up -d

# 3. Seed Database
cd ../database
npx prisma db seed

# 4. Start Development Server
cd ../backend
npm run dev
```
