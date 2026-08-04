# Docker Deployment & Local Infrastructure Guide

## Prerequisites
- Docker Engine 24+ & Docker Compose v2+

## Commands
```bash
# Start local containers (PostgreSQL + Redis + Node app)
docker-compose up -d --build

# Run database migrations in container
docker-compose exec app npx prisma migrate dev

# Seed database
docker-compose exec app npm run prisma:seed

# Check container logs
docker-compose logs -f app
```
