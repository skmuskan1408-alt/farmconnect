import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/:userId', getMessages);
router.post('/', sendMessage);

export default router;
