import { Router } from 'express';
import { getDeliveries, updateDeliveryStatus, optimizeRouteEndpoint } from '../controllers/deliveryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getDeliveries);
router.put('/:id/status', updateDeliveryStatus);
router.post('/optimize-route', optimizeRouteEndpoint);

export default router;
