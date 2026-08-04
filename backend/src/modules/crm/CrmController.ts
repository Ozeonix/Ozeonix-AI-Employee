import { Response, NextFunction } from 'express';
import { CrmService } from './CrmService.js';
import { createCustomerSchema, updateCustomerSchema, searchCustomerSchema } from './dto/crm.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class CrmController {
  private crmService: CrmService;

  constructor(crmService = new CrmService()) {
    this.crmService = crmService;
  }

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createCustomerSchema.parse(req.body);
      const customer = await this.crmService.create(req.tenantId!, validated);
      res.status(201).json({
        success: true,
        message: 'Customer record created successfully',
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = updateCustomerSchema.parse(req.body);
      const customer = await this.crmService.update(req.params.id, req.tenantId!, validated);
      res.status(200).json({
        success: true,
        message: 'Customer record updated successfully',
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await this.crmService.getById(req.params.id, req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Customer profile retrieved',
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public search = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = searchCustomerSchema.parse(req.query);
      const result = await this.crmService.search(req.tenantId!, validated);
      res.status(200).json({
        success: true,
        message: 'Customer search results',
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.crmService.delete(req.params.id, req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Customer soft-deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };
}
