import { Router } from 'express';
import { getBulkRequests, createBulkRequest, createOffer, updateOfferStatus } from '../controllers/bulkController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getBulkRequests);
router.post('/', authenticateToken, createBulkRequest);
router.post('/:id/offers', authenticateToken, createOffer);
router.put('/offers/:id/status', authenticateToken, updateOfferStatus);

export default router;
