# Ozeonix AI Employee – Architecture Freeze Constitution v1.0

## 1. Vision & Scope
Ozeonix AI Employee is an enterprise-grade Business Operating System designed for multi-tenant, cloud-native scalability (Salesforce / SAP tier quality). Every component must be built for production without shortcuts or toy implementations.

---

## 2. Fundamental Architecture Principles
- **Clean Architecture & DDD**: Strict separation of concerns (Controllers -> Services -> Repositories).
- **SOLID & Hexagonal**: Decoupled interface contracts allowing seamless engine migration (e.g. Express to NestJS).
- **12-Factor App & Cloud Native**: Stateless application layer, externalized environment variables, connection pooling.
- **API First & Event Driven**: OpenAPI 3.0 specification contracts and event-driven async queues (BullMQ + Redis).

---

## 3. Monorepo Directory Standards
- `backend/`: Node.js Express TypeScript API engine.
- `frontend/`: React / Next.js web application.
- `database/`: Prisma ORM schemas, DDL, migrations, seed scripts.
- `infrastructure/`: Docker Compose, Dockerfiles, NGINX, Kubernetes manifests.
- `automation/`: n8n & BullMQ workflow engine.
- `ai/`: Multi-model routing (Gemini, Claude, OpenAI, DeepSeek, Ollama) and pgvector wrappers.
- `integrations/`: Third-party drivers (WhatsApp, Email, Webhooks).
- `docs/`: Centralized enterprise documentation.
- `docs/governance/`: Immutable architecture rules and standard Operating Procedures.

---

## 4. Universal Naming Conventions
- **Files & Directories**: `kebab-case` (e.g. `auth-middleware.ts`, `company-repository.ts`).
- **Classes, Interfaces & Enums**: `PascalCase` (e.g. `AuthService`, `TenantRequest`, `UserStatus`).
- **Variables, Functions & Methods**: `camelCase` (e.g. `getUserById`, `tenantId`, `generateTokens`).
- **Database Tables & Columns**: `snake_case` (e.g. `company_subscriptions`, `password_hash`, `tenant_id`).
- **Environment Variables & Constants**: `UPPER_SNAKE_CASE` (e.g. `DATABASE_URL`, `JWT_SECRET`, `PORT`).

---

## 5. Backend Layer Isolation Standards
- **Controllers**: Parse and validate request bodies using Zod, delegate logic to Services, format responses via standard HTTP envelope. **Zero business logic allowed in Controllers.**
- **Services**: Enforce domain rules, handle transaction boundaries, format payloads for Repositories. **Zero direct Prisma or raw database calls in Services.**
- **Repositories**: Encapsulate all database operations, query scoping, and soft-delete filters.

---

## 6. Database & Prisma Standards
- **Mandatory Audit Columns**: Every model MUST include:
  - `id` UUID PRIMARY KEY (`@id @default(uuid())`)
  - `created_at` TIMESTAMPTZ (`@default(now())`)
  - `updated_at` TIMESTAMPTZ (`@updatedAt`)
  - `deleted_at` TIMESTAMPTZ (Soft delete support)
  - `created_by` UUID
  - `updated_by` UUID
  - `version` INT (`@default(1)` for Optimistic Locking)
  - `tenant_id` UUID (Multi-tenant isolation)
- **Automatic Triggers**: PostgreSQL procedure `update_updated_at_column()` MUST be bound to all tables to update `updated_at` and increment `version`.
- **Indexing**: Partial composite indexes MUST filter `WHERE deleted_at IS NULL`.

---

## 7. API Design Standards
- RESTful endpoints under versioned prefix `/api/v1`.
- Standardized Response Envelope:
  ```json
  {
    "success": true,
    "message": "Human readable summary",
    "data": {},
    "meta": {},
    "timestamp": "2026-08-05T00:00:00.000Z"
  }
  ```
- Strict HTTP Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Rate Limited, 500 Internal Error.

---

## 8. Authentication & Multi-Tenancy Scoping
- **Dual Auth Strategy**: JWT Access Tokens (1d duration, rotated via Refresh Tokens) + API Key Hashes (`oz_` prefix with SHA-256 hash validation).
- **Tenant Context**: Every non-public endpoint MUST execute `tenantMiddleware` to extract and validate `tenant_id`.

---

## 9. AI Development & Prompt Engineering Standards
- Model Agnostic: Use provider interfaces capable of falling back across Gemini, Claude, OpenAI, and DeepSeek.
- Vector Store: Use PostgreSQL `pgvector` extension for semantic search and RAG knowledge retrieval.
- Prompts: Store prompt templates with versioning in database/AI repository. Never hardcode system prompts in controller code.

---

## 10. Security & Compliance (OWASP Top 10)
- Input Sanitization & Zod Schema Validation.
- Password Security: Bcrypt salt factor 10.
- Secret Management: Secrets strictly supplied via environment variables (`.env`).
- Audit Logging: State mutations must emit audit events recording `actor_id`, `action`, `entity`, `ip_address`, and `user_agent`.

---

## 11. Testing & Coverage Policy
- **Coverage Goal**: Minimum 80% line and branch coverage across all modules.
- **Unit Tests**: Mock external dependencies and database repositories.
- **Integration Tests**: Validate end-to-end API HTTP contracts with Supertest.

---

## 12. Versioning & Git Strategy
- **Versioning**: Semantic Versioning (`vMAJOR.MINOR.PATCH`).
- **Commit Format**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Branching**: `main` (production), `develop` (staging), `feature/<feature-name>`, `bugfix/<fix-name>`.
