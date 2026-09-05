import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/product/:id', getProductReviews);
router.post('/', authenticateToken, createReview);

export default router;
