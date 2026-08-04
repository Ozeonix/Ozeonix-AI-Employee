import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/AppError.js';
import { TenantRequest } from './tenant.middleware.js';
import { prisma } from '../config/database.js';

export const requirePermissions = (...requiredPermissions: string[]) => {
  return async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('User context required for permission check');
      }

      // Fetch user's assigned permissions via roles
      const userWithRoles = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!userWithRoles) {
        throw new ForbiddenError('User not found');
      }

      const userPermissions = new Set<string>();
      for (const ur of userWithRoles.userRoles) {
        for (const rp of ur.role.rolePermissions) {
          userPermissions.add(rp.permission.code);
        }
      }

      // Check if user has all required permissions or is Super Admin
      const isSuperAdmin = userWithRoles.userRoles.some((ur) => ur.role.code === 'ROLE_SUPER_ADMIN');
      if (isSuperAdmin) {
        return next();
      }

      const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.has(perm));
      if (!hasAllPermissions) {
        throw new ForbiddenError(`Insufficient permissions. Required: ${requiredPermissions.join(', ')}`);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
