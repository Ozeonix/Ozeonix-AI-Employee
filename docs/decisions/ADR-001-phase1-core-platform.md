# ADR 001: Selection of Clean Architecture, Express (NestJS-Ready) & Prisma ORM

## Context
Ozeonix AI Employee is an enterprise-grade Business Operating System. We need a modular backend foundation that can start light and rapid with Express.js while remaining 100% compliant with NestJS conventions for seamless future migration.

## Decision
1. **Architecture**: Implement Domain-Driven Design (DDD) with explicit Controller -> Service -> Repository layers.
2. **Database ORM**: Use Prisma ORM with PostgreSQL 16.
3. **Multi-Tenancy**: Use Pooled Schema with strict `tenant_id` scoping and base audit fields (`id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `version`).

## Consequences
- Clean separation of concerns allows effortless future migration to NestJS decorators and modules without rewriting business logic.
- Type safety across SQL queries and HTTP payloads via Zod & Prisma.
