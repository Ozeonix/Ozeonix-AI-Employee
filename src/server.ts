import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/database.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Ozeonix AI Employee Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🔗 API Base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`📄 API Specs: http://localhost:${env.PORT}/api-docs`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP Server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
