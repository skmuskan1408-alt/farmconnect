import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.post('/:id/cancel', cancelOrder);

export default router;
