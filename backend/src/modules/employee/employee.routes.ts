import { Router } from 'express';
import { EmployeeController } from './EmployeeController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();
const employeeController = new EmployeeController();

router.use(authenticateJwt);

router.post('/', requireRoles('ADMIN', 'MANAGER'), employeeController.create);
router.get('/', employeeController.list);
router.get('/:id', employeeController.getById);
router.put('/:id', requireRoles('ADMIN', 'MANAGER'), employeeController.update);
router.post('/activity', employeeController.logActivity);

export default router;
