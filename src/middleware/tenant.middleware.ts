import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../shared/errors/AppError.js';

export interface TenantRequest extends Request {
  tenantId?: string;
  user?: any;
}

export const tenantMiddleware = (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract tenant ID from header or authenticated user's company context
  const headerTenantId = req.headers['x-tenant-id'] as string;
  const userTenantId = req.user?.companyId || req.user?.tenantId;

  const tenantId = userTenantId || headerTenantId;

  if (req.url.startsWith('/api/v1/auth/register') || req.url.startsWith('/api/v1/auth/login') || req.url.startsWith('/api-docs')) {
    return next();
  }

  if (!tenantId) {
    return next(new UnauthorizedError('Missing Tenant Isolation Context (X-Tenant-ID header or User Tenant required)'));
  }

  req.tenantId = tenantId;
  next();
};
