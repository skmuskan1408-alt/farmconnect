import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { optimizeDeliveryRoute } from '../services/routeOptimizationService.js';

const prisma = new PrismaClient();

export const getDeliveries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let whereClause: any = {};
    if (req.user.role === 'FARMER') {
      whereClause.farmerId = req.user.userId;
    } else if (req.user.role === 'CONSUMER' || req.user.role === 'BULK_BUYER') {
      whereClause.consumerId = req.user.userId;
    }

    const deliveries = await prisma.delivery.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        order: { include: { items: { include: { product: true } } } },
        farmer: { select: { id: true, name: true, location: true } },
        consumer: { select: { id: true, name: true, location: true } }
      }
    });

    res.json({ deliveries });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch deliveries' });
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Delivery status updated', delivery });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update delivery' });
  }
};

export const optimizeRouteEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destinations } = req.body;

    const defaultOrigin = origin || { id: 'farm', name: 'Madanapalle Farm Hub', lat: 13.55, lng: 78.50 };
    const defaultDestinations = destinations && destinations.length > 0 ? destinations : [
      { id: 'dest-1', name: 'Kolar Mandi Center', lat: 13.13, lng: 78.13 },
      { id: 'dest-2', name: 'Bengaluru Hebbal Warehouse', lat: 13.03, lng: 77.59 },
      { id: 'dest-3', name: 'Bengaluru Electronic City Hub', lat: 12.83, lng: 77.67 },
      { id: 'dest-4', name: 'Whitefield Distribution Point', lat: 12.96, lng: 77.74 }
    ];

    const result = optimizeDeliveryRoute(defaultOrigin, defaultDestinations);

    res.json({
      message: 'Route optimized using Nearest Neighbor TSP algorithm',
      ...result
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Route optimization failed' });
  }
};
