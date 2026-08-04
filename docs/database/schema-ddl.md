# PostgreSQL Schema & DDL Reference

Refer to [prisma/migrations/0_init/migration.sql](file:///home/bhola-dev58/Ozeonix/Ozeonix%20AI%20Employee/prisma/migrations/0_init/migration.sql) for full raw DDL statements.

## Key Architectural Highlights
- **Base Columns**: `id` UUID PRIMARY KEY, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `version`, `tenant_id`.
- **Triggers**: `update_updated_at_column()` procedure attached to all tables for automatic timestamp update and `version = version + 1` optimistic locking.
- **Indexes**: Partial composite indexes on `tenant_id` and `company_id` where `deleted_at IS NULL`.
