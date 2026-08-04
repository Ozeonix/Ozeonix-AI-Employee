import { Response, NextFunction } from 'express';
import { MarketingService } from './MarketingService.js';
import { createCampaignSchema } from './dto/marketing.dto.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class MarketingController {
  private marketingService: MarketingService;

  constructor(marketingService = new MarketingService()) {
    this.marketingService = marketingService;
  }

  public createCampaign = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = createCampaignSchema.parse(req.body);
      const result = await this.marketingService.createBroadcastCampaign(req.tenantId!, validated);
      res.status(201).json({
        success: true,
        message: 'WhatsApp Broadcast Campaign created and executed successfully',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };

  public getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.marketingService.getAnalytics(req.tenantId!);
      res.status(200).json({
        success: true,
        message: 'Marketing Campaign Analytics retrieved',
        data: analytics,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  };
}
