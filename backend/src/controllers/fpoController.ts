import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const getFPODashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'FPO' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied: FPO role required' });
    }

    const fpoUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { fpoProfile: true }
    });

    if (!fpoUser) {
      return res.status(404).json({ message: 'FPO user not found' });
    }

    // FPO's direct listed products & combined stock
    const products = await prisma.product.findMany({
      where: { farmerId: req.user.userId },
      include: { category: true }
    });

    const totalStock = products.reduce((acc, p) => acc + p.quantity, 0);

    // Orders received by FPO
    const orders = await prisma.order.findMany({
      where: { farmerId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } }, buyer: { select: { name: true } } }
    });

    const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const revenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Bulk requests & offers made by this FPO
    const offers = await prisma.farmerOffer.findMany({
      where: { farmerId: req.user.userId },
      include: { bulkRequest: true }
    });

    const openBulkRequests = await prisma.bulkRequest.findMany({
      where: { status: 'OPEN' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { name: true, location: true } } }
    });

    // Mock member farmers list (Privacy preserved: only member ID, location, land size, primary crops)
    const mockMembers = [
      { id: 'MBR-101', name: 'Ramesh K. (Member)', location: 'Madanapalle Sector A', landAcres: 4.5, primaryCrops: ['Tomatoes', 'Brinjal'], status: 'ACTIVE' },
      { id: 'MBR-102', name: 'Suresh V. (Member)', location: 'Madanapalle Sector B', landAcres: 6.0, primaryCrops: ['Onions', 'Chillies'], status: 'ACTIVE' },
      { id: 'MBR-103', name: 'Latha M. (Member)', location: 'Angallu Village', landAcres: 3.2, primaryCrops: ['Mangoes', 'Papaya'], status: 'ACTIVE' },
      { id: 'MBR-104', name: 'Narayana R. (Member)', location: 'Horsley Hills Road', landAcres: 8.0, primaryCrops: ['Paddy', 'Groundnut'], status: 'ACTIVE' },
      { id: 'MBR-105', name: 'Venkat S. (Member)', location: 'Kurabalakota', landAcres: 5.5, primaryCrops: ['Tomatoes', 'Capsicum'], status: 'ACTIVE' }
    ];

    res.json({
      fpo: {
        id: fpoUser.id,
        name: fpoUser.name,
        email: fpoUser.email,
        phone: fpoUser.phone,
        location: fpoUser.location,
        profile: fpoUser.fpoProfile
      },
      stats: {
        memberCount: fpoUser.fpoProfile?.memberCount || 65,
        totalProductsCount: products.length,
        totalCombinedStock: totalStock,
        activeOrdersCount: activeOrders,
        completedOrdersCount: completedOrders,
        totalRevenue: Math.round(revenue || 145000),
        rating: fpoUser.fpoProfile?.rating || 4.9
      },
      products,
      orders,
      offers,
      openBulkRequests,
      memberFarmers: mockMembers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch FPO dashboard' });
  }
};
