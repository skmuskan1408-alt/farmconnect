import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({ message: 'Product ID, Order ID, rating, and comment are required' });
    }

    // 1. Verify user purchased product in this order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: req.user.userId,
        status: 'DELIVERED',
        items: {
          some: { productId }
        }
      }
    });

    if (!order) {
      return res.status(403).json({
        message: 'Only consumers with a delivered order for this product can submit a verified review'
      });
    }

    // 2. Check if already reviewed for this order
    const existingReview = await prisma.review.findFirst({
      where: {
        orderId,
        productId,
        userId: req.user.userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this order' });
    }

    // 3. Create review
    const review = await prisma.review.create({
      data: {
        productId,
        orderId,
        userId: req.user.userId,
        rating: parseInt(rating),
        comment
      }
    });

    // 4. Update average product rating
    const allProductReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avgRating * 10) / 10 }
    });

    res.status(201).json({ message: 'Verified review submitted successfully', review });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to submit review' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, location: true } }
      }
    });

    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch product reviews' });
  }
};
