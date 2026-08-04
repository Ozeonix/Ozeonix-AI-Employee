import { Router } from 'express';
import { AiController } from './AiController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const aiController = new AiController();

router.post('/generate', authenticateJwt, aiController.generateResponse);
router.get('/templates', authenticateJwt, aiController.listTemplates);

export default router;
