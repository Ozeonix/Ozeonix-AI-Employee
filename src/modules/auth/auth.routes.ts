import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { auditLogMiddleware } from '../../middleware/audit.middleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register', auditLogMiddleware('REGISTER', 'Company'), authController.register);
router.post('/login', auditLogMiddleware('LOGIN', 'User'), authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);

export default router;
