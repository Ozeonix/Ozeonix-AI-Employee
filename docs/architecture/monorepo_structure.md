# Monorepo Architecture & Directory Governance

## Overview
**Ozeonix AI Employee** is organized as a true enterprise monorepo (`backend/`, `frontend/`, `database/`, `infrastructure/`, `ai/`, `integrations/`, `docs/`).

---

## Directory Responsibilities

### 1. Backend Service (`backend/`)
- **Canonical Home**: All backend TypeScript application code, modules, controllers, services, repositories, and middlewares reside strictly within `backend/src/`.
- **Root `src/` Removal**: Deprecated root `src/` has been consolidated into `backend/src/` to eliminate developer confusion and guarantee a single source of truth.

### 2. Database & Prisma (`database/prisma/`)
- **Canonical Schema**: `database/prisma/schema.prisma` is the single authoritative Prisma ORM schema for database migrations, model definitions, and client generation.
- **Root `prisma/`**: Kept synchronized or symlinked solely for root CLI tool convenience.

### 3. Container Management (Development vs. Production)
- **Root `Dockerfile` & `docker-compose.yml`**:
  - **Purpose**: Local Developer Entrypoint.
  - Enables instant local development (`docker compose up`) with hot reloading, local PostgreSQL 16 (`pgvector`), and Redis 7.
- **`infrastructure/Dockerfile` & `infrastructure/docker-compose.yml`**:
  - **Purpose**: Production Container Blueprint.
  - Multi-stage Docker build optimized for minimal image size, security hardening, and Kubernetes/Cloud deployment.
