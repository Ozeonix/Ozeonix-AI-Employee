# Database & Prisma ORM Standards

## 1. Primary Engine
- PostgreSQL 16+ is the mandatory relational database.
- Prisma ORM is the single standard data access layer.

## 2. Table & Schema Rules
- Table names must be pluralized `snake_case` (e.g. `companies`, `audit_logs`).
- Model names in Prisma must be singular `PascalCase` mapped to plural table (`model Company { ... @@map("companies") }`).
- Foreign keys must explicitly specify `onDelete` actions (`Cascade` or `SetNull`).

## 3. Mandatory Audit Schema Blueprint
Every table MUST implement the following columns:
```prisma
id          String    @id @default(uuid()) @db.Uuid
version     Int       @default(1)
createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
updatedAt   DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
deletedAt   DateTime? @map("deleted_at") @db.Timestamptz(6)
createdBy   String?   @map("created_by") @db.Uuid
updatedBy   String?   @map("updated_by") @db.Uuid
tenantId    String?   @map("tenant_id") @db.Uuid
```

## 4. Indexing & Soft Delete Filtering
- All queries MUST filter out soft-deleted records (`deletedAt IS NULL`).
- Indexes MUST be created on `tenant_id`, foreign keys, and unique slug/email fields.
