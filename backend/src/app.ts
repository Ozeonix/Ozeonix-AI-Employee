import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { pinoLoggerMiddleware } from './middlewares/logger.middleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import platformRoutes from './modules/platform/platform.routes.js';
import rbacRoutes from './modules/rbac/rbac.routes.js';

const app = express();

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
app.use(pinoLoggerMiddleware);

// System Health Routes (Liveness & Readiness)
app.use('/', healthRoutes);

// Modular API V1 Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/platform`, platformRoutes);
app.use(`${env.API_PREFIX}/rbac`, rbacRoutes);

// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);

export default app;
