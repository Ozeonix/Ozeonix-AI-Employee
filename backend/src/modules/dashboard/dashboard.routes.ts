import { Router } from 'express';
import { DashboardController } from './DashboardController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticateJwt);

router.get('/summary', dashboardController.getSummary);
router.get('/export/csv', dashboardController.exportReport);

export default router;
