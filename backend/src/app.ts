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
import whatsappRoutes from './modules/whatsapp/whatsapp.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import crmRoutes from './modules/crm/crm.routes.js';
import employeeRoutes from './modules/employee/employee.routes.js';
import marketingRoutes from './modules/marketing/marketing.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import voiceRoutes from './modules/voice/voice.routes.js';

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
app.use(`${env.API_PREFIX}/whatsapp`, whatsappRoutes);
app.use(`${env.API_PREFIX}/ai`, aiRoutes);
app.use(`${env.API_PREFIX}/crm`, crmRoutes);
app.use(`${env.API_PREFIX}/employees`, employeeRoutes);
app.use(`${env.API_PREFIX}/marketing`, marketingRoutes);
app.use(`${env.API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${env.API_PREFIX}/voice`, voiceRoutes);

// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);

export default app;
