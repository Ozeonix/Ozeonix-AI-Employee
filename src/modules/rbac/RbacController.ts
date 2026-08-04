import { Response, NextFunction } from 'express';
import { RbacService } from './RbacService.js';
import { sendResponse } from '../../shared/utils/response.js';
import { TenantRequest } from '../../middleware/tenant.middleware.js';
import { z } from 'zod';

const createApiKeySchema = z.object({
  name: z.string().min(1, 'API Key name is required'),
});

export class RbacController {
  private rbacService: RbacService;

  constructor(rbacService = new RbacService()) {
    this.rbacService = rbacService;
  }

  getUsers = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.rbacService.getUsers(req.tenantId!);
      return sendResponse(res, 200, 'Tenant users retrieved', users);
    } catch (err) {
      next(err);
    }
  };

  getRoles = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const roles = await this.rbacService.getRoles();
      return sendResponse(res, 200, 'System roles retrieved', roles);
    } catch (err) {
      next(err);
    }
  };

  getPermissions = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const permissions = await this.rbacService.getPermissions();
      return sendResponse(res, 200, 'Permissions retrieved', permissions);
    } catch (err) {
      next(err);
    }
  };

  createApiKey = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createApiKeySchema.parse(req.body);
      const apiKey = await this.rbacService.generateApiKey(req.tenantId!, req.user.id, validated.name);
      return sendResponse(res, 201, 'API Key generated successfully. Save this secret key as it will not be shown again.', apiKey);
    } catch (err) {
      next(err);
    }
  };

  getApiKeys = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const keys = await this.rbacService.getApiKeys(req.tenantId!);
      return sendResponse(res, 200, 'API Keys retrieved', keys);
    } catch (err) {
      next(err);
    }
  };
}
