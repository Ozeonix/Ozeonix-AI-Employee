import { Router } from 'express';
import { MarketingController } from './MarketingController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const marketingController = new MarketingController();

router.use(authenticateJwt);

router.post('/broadcast', marketingController.createCampaign);
router.get('/analytics', marketingController.getAnalytics);

export default router;
