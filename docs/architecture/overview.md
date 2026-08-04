# Ozeonix System Architecture Overview

## Architectural Patterns
Ozeonix AI Employee is designed as a high-throughput, multi-tenant Business Operating System built on Clean Architecture and Hexagonal/Domain-Driven Design (DDD) principles.

```mermaid
graph TD
    Client[Client App / Frontend / Third Party API] --> API_Gateway[Express Router / API Gateway]
    API_Gateway --> Middlewares[Security, JWT/ApiKey, Tenant Isolation, RBAC]
    Middlewares --> Controllers[Controllers Layer]
    Controllers --> Services[Domain Services Layer]
    Services --> Repositories[Repositories Layer]
    Repositories --> Database[(PostgreSQL 16 + pgvector)]
    Services --> Cache[(Redis Cache & Queues)]
```

## Layers & Responsibilities
1. **Controllers Layer**: Express controllers handling HTTP requests, standardizing Zod request validation, and formatting JSON responses.
2. **Service Layer**: Pure domain logic execution, business rules enforcement, tenant validation, and event handling.
3. **Repository Layer**: Abstraction over Prisma ORM database transactions, entity queries, and soft deletion.
4. **Middleware Layer**: Enforces rate limiting, JWT token rotation, API key validation, multi-tenant context injection (`X-Tenant-ID`), and fine-grained RBAC permission evaluation.
