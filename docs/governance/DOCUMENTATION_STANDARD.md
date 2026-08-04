# Enterprise Documentation Standards

## 1. Documentation Organization
- `/docs` is the primary documentation store.
- Major decision updates MUST create an Architecture Decision Record in `/docs/adr/`.

## 2. README Requirements
- Every root directory (`backend/`, `frontend/`, `database/`, `infrastructure/`, etc.) MUST contain a dedicated `README.md` detailing its purpose, folder layout, and run instructions.

## 3. OpenAPI Specifications
- All public endpoints MUST be documented in `swagger.ts` or `openapi.yaml`.
- Interactive Swagger UI MUST be exposed at `/api-docs`.
