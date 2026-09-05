import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const getBulkRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.bulkRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { id: true, name: true, location: true, buyerProfile: true } },
        offers: {
          include: {
            farmer: { select: { id: true, name: true, location: true, farmerProfile: true } }
          }
        }
      }
    });

    res.json({ requests });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch bulk requests' });
  }
};

export const createBulkRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'BULK_BUYER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Only bulk buyers can create bulk requests' });
    }

    const { productName, quantity, unit, requiredDate, targetPrice, location } = req.body;

    if (!productName || !quantity || !targetPrice) {
      return res.status(400).json({ message: 'Product name, quantity, and target price are required' });
    }

    const request = await prisma.bulkRequest.create({
      data: {
        buyerId: req.user.userId,
        productName,
        quantity: parseFloat(quantity),
        unit: unit || 'kg',
        requiredDate: requiredDate || new Date(Date.now() + 864000000).toISOString().split('T')[0],
        targetPrice: parseFloat(targetPrice),
        location: location || req.user.email
      }
    });

    res.status(201).json({ message: 'Bulk request created successfully', request });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create bulk request' });
  }
};

export const createOffer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'FARMER') {
      return res.status(403).json({ message: 'Only farmers can submit offers for bulk requests' });
    }

    const { id } = req.params; // bulkRequestId
    const { offeredQuantity, pricePerUnit, deliveryDate, note } = req.body;

    const offer = await prisma.farmerOffer.create({
      data: {
        bulkRequestId: id,
        farmerId: req.user.userId,
        offeredQuantity: parseFloat(offeredQuantity),
        pricePerUnit: parseFloat(pricePerUnit),
        deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
        note
      }
    });

    // Notify bulk buyer
    const bulkReq = await prisma.bulkRequest.findUnique({ where: { id } });
    if (bulkReq) {
      await prisma.notification.create({
        data: {
          userId: bulkReq.buyerId,
          title: 'New Offer on Bulk Request! 🏷️',
          message: `A farmer offered ₹${pricePerUnit}/${bulkReq.unit} for your request "${bulkReq.productName}".`,
          type: 'ORDER'
        }
      });
    }

    res.status(201).json({ message: 'Offer submitted successfully', offer });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to submit offer' });
  }
};

export const updateOfferStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const offer = await prisma.farmerOffer.update({
      where: { id },
      data: { status }
    });

    res.json({ message: `Offer ${status.toLowerCase()}`, offer });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update offer status' });
  }
};
