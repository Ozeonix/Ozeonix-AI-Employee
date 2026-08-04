import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/AppError.js';
import { AuthenticatedRequest } from './auth.middleware.js';

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User context required for role verification'));
    }

    const userRole = req.user.role?.toUpperCase();
    const hasRole = allowedRoles.some((role) => role.toUpperCase() === userRole);

    if (!hasRole) {
      return next(
        new ForbiddenError(
          `Access forbidden. Required role(s): ${allowedRoles.join(', ')}. Found: ${userRole}`
        )
      );
    }

    next();
  };
};
