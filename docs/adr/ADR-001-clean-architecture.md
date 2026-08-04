# ADR 001: Clean Architecture & Monorepo Directory Organization

## Context
As Ozeonix scales into an enterprise SaaS platform serving multiple AI Employees (Sales, Support, Marketing, HR, Finance), the repository structure must remain modular, maintainable, and decoupled.

## Decision
1. Organize the repository into explicit top-level domain folders: `backend/`, `frontend/`, `database/`, `infrastructure/`, `automation/`, `ai/`, `integrations/`, `scripts/`, `tests/`, `tools/`, `examples/`, `templates/`, `assets/`, `.archive/`, and `/docs`.
2. Follow Clean Architecture / DDD in `backend/` with distinct Controller, Service, and Repository layers.
3. Use Prisma ORM in `database/` with multi-tenant `tenant_id` scoping and base audit fields on all models.

## Status
ACCEPTED
