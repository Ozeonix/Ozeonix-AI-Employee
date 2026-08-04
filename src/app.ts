import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { setupSwagger } from './config/swagger.js';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import platformRoutes from './modules/platform/platform.routes.js';
import rbacRoutes from './modules/rbac/rbac.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalRateLimiter);

// Setup Swagger UI Documentation
setupSwagger(app);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API V1 Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/platform`, platformRoutes);
app.use(`${env.API_PREFIX}/rbac`, rbacRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
