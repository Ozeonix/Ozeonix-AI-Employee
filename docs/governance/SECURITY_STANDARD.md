# Security Architecture & OWASP Standards

## 1. Authentication & Tokens
- Access Tokens: Short-lived JWT (1d expiry) signed with RS256 or strong HS256 secret.
- Refresh Tokens: Long-lived (7d expiry), stored in database with revocation status.
- API Keys: 48-character high entropy keys with `oz_` prefix. Only SHA-256 key hash stored in database.

## 2. Multi-Tenant Scoping
- Every request must validate `tenant_id`.
- Tenant context MUST be injected into database repository queries to guarantee complete isolation.

## 3. Defense in Depth
- **Helmet**: Enforce secure HTTP headers (HSTS, CSP, X-Frame-Options).
- **CORS**: Explicit whitelist of allowed origins.
- **Rate Limiting**: IP-based rate limiting per window.
- **Password Security**: Bcrypt hashing with salt factor >= 10.
