import { Router } from 'express';
import { getTickets, createTicket, addTicketMessage } from '../controllers/supportController.js';

const router = Router();

router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
router.post('/tickets/:id/messages', addTicketMessage);

export default router;
