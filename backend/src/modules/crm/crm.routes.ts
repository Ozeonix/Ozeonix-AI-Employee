import { Router } from 'express';
import { CrmController } from './CrmController.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const crmController = new CrmController();

router.use(authenticateJwt);

router.post('/customers', crmController.create);
router.get('/customers', crmController.search);
router.get('/customers/:id', crmController.getById);
router.put('/customers/:id', crmController.update);
router.delete('/customers/:id', crmController.delete);

export default router;
