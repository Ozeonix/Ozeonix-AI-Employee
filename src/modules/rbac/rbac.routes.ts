import { Router } from 'express';
import { RbacController } from './RbacController.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';
import { requirePermissions } from '../../middleware/rbac.middleware.js';

const router = Router();
const rbacController = new RbacController();

router.use(authMiddleware, tenantMiddleware);

router.get('/users', requirePermissions('PERM_USER_READ'), rbacController.getUsers);
router.get('/roles', requirePermissions('PERM_ROLE_MANAGE'), rbacController.getRoles);
router.get('/permissions', requirePermissions('PERM_ROLE_MANAGE'), rbacController.getPermissions);
router.get('/api-keys', requirePermissions('PERM_COMPANY_READ'), rbacController.getApiKeys);
router.post('/api-keys', requirePermissions('PERM_COMPANY_WRITE'), rbacController.createApiKey);

export default router;
