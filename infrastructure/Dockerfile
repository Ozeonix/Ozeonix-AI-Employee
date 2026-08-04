# Multi-stage Dockerfile for Ozeonix Core Engine

FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json backend/tsconfig.json ./backend/
COPY database/prisma ./database/prisma
RUN cd backend && npm ci
COPY backend/src ./backend/src
RUN cd database/prisma && npx prisma generate
RUN cd backend && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/backend/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
