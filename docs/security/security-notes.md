# Security Architecture & OWASP Compliance

1. **Strict Input Validation**: Zod runtime schema validation on all controller inputs to prevent SQL Injection & XSS.
2. **Tenant Isolation**: Middleware enforcing tenant scoping (`X-Tenant-ID` or JWT payload `tenantId`) on every request.
3. **Password Security**: Bcrypt salt factor 10 hashing for credentials.
4. **JWT Rotation**: Access tokens expire in 1 day; refresh tokens expire in 7 days and can be revoked.
5. **API Key Hash Verification**: API Key raw tokens are generated with high entropy (`oz_` prefix + 48 hex chars) and only stored as SHA-256 hashes in the database.
6. **Audit Trails**: Every security-sensitive mutation automatically logs actor ID, action type, IP address, user agent, and timestamp.
