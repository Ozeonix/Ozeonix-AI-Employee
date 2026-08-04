import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError } from '../shared/errors/AppError.js';
import { TenantRequest } from './tenant.middleware.js';

export const authMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'] as string;

    // 1. API Key Authentication Strategy
    if (apiKeyHeader) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { keyHash: apiKeyHeader },
        include: { user: true, company: true },
      });

      if (!apiKey || !apiKey.isActive || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
        throw new UnauthorizedError('Invalid or expired API Key');
      }

      req.user = apiKey.user;
      req.tenantId = apiKey.companyId;
      return next();
    }

    // 2. JWT Authentication Strategy
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token or API Key required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; tenantId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { company: true },
    });

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      throw new UnauthorizedError('User account is inactive or deleted');
    }

    req.user = user;
    req.tenantId = user.companyId;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('JWT Token has expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid JWT Token'));
    }
    next(err);
  }
};
