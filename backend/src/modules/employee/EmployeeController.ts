import { Response, NextFunction } from 'express';
import { EmployeeService } from './EmployeeService.js';
import { createEmployeeSchema, updateEmployeeSchema, logActivitySchema } from './dto/employee.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor(employeeService = new EmployeeService()) {
    this.employeeService = employeeService;
  }

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createEmployeeSchema.parse(req.body);
      const employee = await this.employeeService.create(req.tenantId!, validated);
      res.status(201).json({
        success: true,
        message: 'Employee record created successfully',
        data: employee,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.list(req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Employee list retrieved',
        data: employees,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.getById(req.params.id, req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Employee profile retrieved',
        data: employee,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = updateEmployeeSchema.parse(req.body);
      const employee = await this.employeeService.update(req.params.id, req.tenantId!, validated);
      res.status(200).json({
        success: true,
        message: 'Employee profile updated',
        data: employee,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public logActivity = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = logActivitySchema.parse(req.body);
      const log = await this.employeeService.logActivity(req.tenantId!, req.user.id, validated.action, validated.details);
      res.status(201).json({
        success: true,
        message: 'Employee activity logged',
        data: log,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };
}
