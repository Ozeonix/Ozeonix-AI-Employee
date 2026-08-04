import { Response, NextFunction } from 'express';
import { PlatformService } from './PlatformService.js';
import { sendResponse } from '../../shared/utils/response.js';
import { TenantRequest } from '../../middleware/tenant.middleware.js';
import { z } from 'zod';

const updateCompanySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  logoUrl: z.string().optional(),
});

const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  category: z.string().optional(),
});

export class PlatformController {
  private platformService: PlatformService;

  constructor(platformService = new PlatformService()) {
    this.platformService = platformService;
  }

  getCompany = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const company = await this.platformService.getCompanyProfile(req.tenantId!);
      return sendResponse(res, 200, 'Company profile retrieved', company);
    } catch (err) {
      next(err);
    }
  };

  updateCompany = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const validated = updateCompanySchema.parse(req.body);
      const updated = await this.platformService.updateCompanyProfile(req.tenantId!, validated.name, validated.phone, validated.logoUrl);
      return sendResponse(res, 200, 'Company profile updated', updated);
    } catch (err) {
      next(err);
    }
  };

  setSetting = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      const validated = settingSchema.parse(req.body);
      const setting = await this.platformService.setSetting(req.tenantId!, validated.key, validated.value, validated.category);
      return sendResponse(res, 200, 'Company setting saved', setting);
    } catch (err) {
      next(err);
    }
  };
}
