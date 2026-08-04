# Ozeonix Core Backend Engine

## Overview
The backend is a Node.js + Express + TypeScript enterprise service built using Domain-Driven Design (DDD) & Clean Architecture principles. It is structured to be NestJS-migration ready.

## Directory Structure
```
backend/
├── src/
│   ├── config/         # Env, Database, Logger, Swagger specs
│   ├── middleware/     # Auth, Tenant Isolation, RBAC, Rate Limiting, Audit
│   ├── modules/
│   │   ├── auth/       # Auth controller, service, repository, DTOs
│   │   ├── platform/   # Company & settings controller, service, repository
│   │   └── rbac/       # Users, Roles, Permissions & API Key management
│   ├── shared/         # Custom error classes, BaseRepository, response helpers
│   ├── app.ts          # Express setup & middleware chain
│   └── server.ts       # Server entrypoint & graceful shutdown
├── package.json
├── tsconfig.json
└── jest.config.ts
```
