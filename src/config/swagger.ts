import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './env.js';

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Ozeonix AI Employee - Enterprise Core API Documentation',
    version: '1.0.0',
    description: 'Production-ready REST API for Phase 1 Core Platform, Authentication, RBAC, and Multi-Tenant Management.',
    contact: {
      name: 'Ozeonix Architecture Team',
      email: 'architecture@ozeonix.ai',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
      TenantHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Tenant-ID',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new tenant company and administrator',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['companyName', 'companySlug', 'email', 'password', 'firstName', 'lastName'],
                properties: {
                  companyName: { type: 'string', example: 'Acme Corp' },
                  companySlug: { type: 'string', example: 'acme-corp' },
                  email: { type: 'string', example: 'admin@acme.com' },
                  password: { type: 'string', example: 'SecurePass123!' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Company and Admin created successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Company slug or email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User Login with credentials',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@acme.com' },
                  password: { type: 'string', example: 'SecurePass123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully with JWT & Refresh token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get currently authenticated user details',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/platform/company': {
      get: {
        summary: 'Get tenant company details',
        tags: ['Platform'],
        security: [{ BearerAuth: [] }, { TenantHeader: [] }],
        responses: {
          200: { description: 'Company details' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info(`📄 Swagger UI Documentation initialized at http://localhost:${env.PORT}/api-docs`);
};
import { logger } from './logger.js';
