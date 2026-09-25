import { Request, Response } from 'express';
import { processAIChat } from '../services/aiService.js';

export const handleAIChat = async (req: Request, res: Response) => {
  try {
    const { message, language = 'auto', role = 'CONSUMER', userId, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    const aiResult = await processAIChat({
      message,
      language,
      role,
      userId,
      history
    });

    return res.json(aiResult);
  } catch (error: any) {
    console.error('AI Chat Controller Error:', error);
    return res.json({
      success: true,
      detectedLanguage: 'en',
      intent: 'UNKNOWN',
      confidence: 0.5,
      replyText: 'Sorry, I couldn\'t process that right now. Please try again or open a ticket on our Help Desk.',
      cardType: 'SUPPORT',
      cardData: null,
      quickActions: [
        { label: '❓ Help Desk', action: 'NAVIGATE', path: '/help' },
        { label: '🛒 Browse Produce', action: 'NAVIGATE', path: '/marketplace' }
      ],
      timestamp: new Date().toISOString()
    });
  }
};

export const getAISuggestions = async (req: Request, res: Response) => {
  const { role = 'CONSUMER' } = req.query;

  const suggestionsByRole: Record<string, Array<{ text: string; icon: string }>> = {
    CONSUMER: [
      { text: '📦 Where is my order?', icon: '📦' },
      { text: "💰 What is today's tomato price?", icon: '💰' },
      { text: '🥦 Show fresh vegetables near me', icon: '🥦' },
      { text: '❓ I need help with an order', icon: '❓' }
    ],
    FARMER: [
      { text: '🌾 How do I list my crops?', icon: '🌾' },
      { text: '📈 What is the demand forecast?', icon: '📈' },
      { text: '💵 How do I check my earnings?', icon: '💵' }
    ],
    BULK_BUYER: [
      { text: '📦 How to create a bulk request?', icon: '📦' },
      { text: '💰 Compare wholesale market prices', icon: '💰' }
    ]
  };

  const suggestions = suggestionsByRole[String(role)] || suggestionsByRole.CONSUMER;
  return res.json({ success: true, suggestions });
};
