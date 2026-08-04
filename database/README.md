# Database Module - Ozeonix AI Employee

## Stack
- PostgreSQL 16
- Prisma ORM
- `pgvector` extension for AI Embeddings
- `uuid-ossp` for UUID primary keys

## Structure
```
database/
├── prisma/
│   ├── schema.prisma      # Unified database schema
│   ├── seed.ts            # Seeding script for plans, roles & demo tenant
│   └── migrations/        # Version-controlled migrations
│       └── 0_init/
│           └── migration.sql
└── README.md
```

## Setup & Execution
```bash
# Generate Prisma Client
npx prisma generate

# Apply Migrations
npx prisma migrate dev

# Seed Data
npm run prisma:seed
```
