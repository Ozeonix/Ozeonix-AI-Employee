# Infrastructure & Deployment - Ozeonix AI Employee

## Services
- PostgreSQL 16 (`pgvector/pgvector:pg16`)
- Redis 7 (`redis:7-alpine`)
- Backend Application Node.js container

## Running Infrastructure
```bash
cd infrastructure
docker-compose up -d --build
```
