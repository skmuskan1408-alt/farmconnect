import { Router } from 'express';
import { getStats, getUsers, getAllOrders } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, requireRole(['ADMIN']));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/orders', getAllOrders);

export default router;
