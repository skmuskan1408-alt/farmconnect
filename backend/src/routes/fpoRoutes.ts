import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getFPODashboard } from '../controllers/fpoController.js';

const router = Router();

router.get('/dashboard', authenticateToken, getFPODashboard);

export default router;
