import { Response, NextFunction } from 'express';
import { TenantRequest } from './tenant.middleware.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';

export const auditLogMiddleware = (action: string, entity: string) => {
  return async (req: TenantRequest, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              companyId: req.tenantId || null,
              userId: req.user?.id || null,
              action,
              entity,
              entityId: (req.params as any)?.id || null,
              ipAddress: req.ip,
              userAgent: req.get('user-agent') || null,
              tenantId: req.tenantId || null,
            },
          });
        } catch (err: any) {
          logger.error(`Failed to record audit log: ${err.message}`);
        }
      }
    });
    next();
  };
};
