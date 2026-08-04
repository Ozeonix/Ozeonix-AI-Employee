import { Router } from 'express';
import { PlatformController } from './PlatformController.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';
import { requirePermissions } from '../../middleware/rbac.middleware.js';

const router = Router();
const platformController = new PlatformController();

router.use(authMiddleware, tenantMiddleware);

router.get('/company', requirePermissions('PERM_COMPANY_READ'), platformController.getCompany);
router.put('/company', requirePermissions('PERM_COMPANY_WRITE'), platformController.updateCompany);
router.post('/settings', requirePermissions('PERM_COMPANY_WRITE'), platformController.setSetting);

export default router;
