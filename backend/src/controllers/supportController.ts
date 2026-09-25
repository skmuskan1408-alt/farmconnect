import { Request, Response } from 'express';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  category: string;
  description: string;
  orderId?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  messages: Array<{ sender: string; content: string; time: string }>;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-1001',
    userId: 'user-consumer-1',
    userName: 'Anita Sharma',
    userRole: 'CONSUMER',
    category: 'DELIVERY',
    description: 'Driver status is not updating for tomato shipment.',
    orderId: 'FC-9842',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      { sender: 'Anita Sharma', content: 'Driver status is not updating for tomato shipment.', time: '1 hour ago' },
      { sender: 'Human Agent (Support)', content: 'We contacted the logistics partner. Vehicle is near Madanapalle toll plaza.', time: '30 mins ago' }
    ]
  }
];

export const getTickets = async (req: Request, res: Response) => {
  return res.json({ success: true, tickets: mockTickets });
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { category, description, orderId, userName = 'Guest User', userRole = 'CONSUMER' } = req.body;
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: req.body.userId || 'user-guest',
      userName,
      userRole,
      category: category || 'GENERAL',
      description: description || 'Need help with KissanConnect service.',
      orderId,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        { sender: userName, content: description, time: 'Just now' }
      ]
    };
    mockTickets.unshift(newTicket);
    return res.json({ success: true, ticket: newTicket, message: 'Support ticket created successfully!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to create support ticket' });
  }
};

export const addTicketMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sender, content } = req.body;
  const ticket = mockTickets.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }
  ticket.messages.push({ sender: sender || 'User', content, time: 'Just now' });
  return res.json({ success: true, ticket });
};
