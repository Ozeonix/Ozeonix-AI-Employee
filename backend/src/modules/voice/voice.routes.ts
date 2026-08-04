import { Router } from 'express';
import { VoiceController } from './VoiceController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const voiceController = new VoiceController();

router.post('/call', authenticateJwt, voiceController.initiateCall);
router.all('/inbound-webhook', voiceController.handleInboundCall);

export default router;
