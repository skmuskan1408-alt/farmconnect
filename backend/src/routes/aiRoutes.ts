import { Router } from 'express';
import { handleAIChat, getAISuggestions } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', handleAIChat);
router.post('/voice', handleAIChat);
router.get('/suggestions', getAISuggestions);

export default router;
