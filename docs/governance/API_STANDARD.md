# RESTful API Design Standards

## 1. URL Path Structure
- Resource paths must use plural nouns (e.g. `/api/v1/platform/company`, `/api/v1/rbac/users`).
- Use kebab-case for multi-word paths (`/api-keys`, `/company-settings`).

## 2. HTTP Verbs
- `GET`: Retrieve resource (Idempotent, Read-Only).
- `POST`: Create resource or execute domain actions.
- `PUT`: Full update of a resource.
- `PATCH`: Partial update of a resource.
- `DELETE`: Soft-delete resource.

## 3. Standard JSON Response Envelope
All API endpoints must return a standardized JSON structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  },
  "timestamp": "2026-08-05T00:00:00.000Z"
}
```

## 4. Payload Validation
- All incoming payloads MUST be validated using Zod schemas before hitting Service logic.
