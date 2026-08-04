# DevOps & Infrastructure Standards

## 1. Containerization
- All services must be fully containerized using multi-stage Dockerfiles.
- Production images must use lightweight base images (`node:20-alpine`).

## 2. Infrastructure as Code (IaC)
- Environment orchestrations must be defined in `infrastructure/docker-compose.yml`.
- Production deployments must prepare Kubernetes manifests (`k8s/`).

## 3. Environment Variable Security
- Plaintext secrets must NEVER be checked into Git repositories.
- Use `.env.example` as the canonical template for environment variable keys.
