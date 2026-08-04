import { Router } from 'express';
import { WhatsAppController } from './WhatsAppController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const whatsappController = new WhatsAppController();

router.get('/status', whatsappController.getSessionStatus);
router.post('/send', authenticateJwt, whatsappController.sendMessage);
router.post('/webhook', whatsappController.handleIncomingWebhook);

export default router;
