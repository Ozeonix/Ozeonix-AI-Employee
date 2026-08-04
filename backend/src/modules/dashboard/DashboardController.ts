import { Response, NextFunction } from 'express';
import { DashboardService } from './DashboardService.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor(dashboardService = new DashboardService()) {
    this.dashboardService = dashboardService;
  }

  public getSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const summary = await this.dashboardService.getExecutiveSummary(req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Executive Dashboard summary retrieved',
        data: summary,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public exportReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const csvData = await this.dashboardService.exportReportCSV(req.tenantId!);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="customers-report.csv"');
      res.status(200).send(csvData);
    } catch (err) {
      next(err);
    }
  };
}
