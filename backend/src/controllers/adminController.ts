import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalFarmers = await prisma.user.count({ where: { role: 'FARMER' } });
    const totalConsumers = await prisma.user.count({ where: { role: 'CONSUMER' } });
    const totalBuyers = await prisma.user.count({ where: { role: 'BULK_BUYER' } });

    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const activeDeliveries = await prisma.delivery.count({ where: { status: 'IN_TRANSIT' } });

    const payments = await prisma.payment.aggregate({
      _sum: { amount: true }
    });
    const totalRevenue = payments._sum.amount || 0;

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { name: true } }, farmer: { select: { name: true } } }
    });

    res.json({
      stats: {
        totalUsers,
        totalFarmers,
        totalConsumers,
        totalBuyers,
        totalProducts,
        totalOrders,
        activeDeliveries,
        totalRevenue
      },
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch admin stats' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        createdAt: true,
        farmerProfile: true,
        buyerProfile: true
      }
    });

    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        farmer: { select: { id: true, name: true, location: true } },
        items: { include: { product: true } },
        payment: true,
        delivery: true
      }
    });

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch all orders' });
  }
};
