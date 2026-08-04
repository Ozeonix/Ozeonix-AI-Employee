# Multi-Tenant & Auth Architecture Model

## Multi-Tenancy Strategy
Ozeonix uses a **Pooled Schema with Discriminator (tenant_id)** approach for Phase 1.
Every table includes a `tenant_id` UUID column indexed for high-performance tenant filtering.
Query filtering is enforced in both the Repository layer and Middleware layer to prevent cross-tenant data leaks.
