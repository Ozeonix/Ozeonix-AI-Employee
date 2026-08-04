import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticateJwt, authController.logout);
router.get('/me', authenticateJwt, authController.me);

export default router;
