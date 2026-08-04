# Code Review Verification Checklist

Before approving any Pull Request or merging feature branches, verify the following:

- [ ] **Architecture**: Follows Controller -> Service -> Repository isolation.
- [ ] **Multi-Tenancy**: Scoped with `tenant_id` and checks soft delete (`deleted_at IS NULL`).
- [ ] **Validation**: Zod schema validation is applied to all incoming request payloads.
- [ ] **Error Handling**: Custom `AppError` subclasses used instead of generic errors.
- [ ] **Database Audit**: Base audit columns (`id`, `created_at`, `updated_at`, `deleted_at`, `version`, `tenant_id`) present on all new Prisma models.
- [ ] **Security**: No secrets or hardcoded credentials checked in. Rate limiting and auth applied.
- [ ] **Testing**: Unit and integration tests added with passing status.
- [ ] **Documentation**: `/docs` and Swagger OpenAPI specs updated.
