import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { items, paymentMethod, shippingAddress, deliveryType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Verify inventory and compute totals
    let totalAmount = 0;
    const validatedItems: any[] = [];
    let farmerId = '';

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient inventory for ${product.name}. Available: ${product.quantity} ${product.unit}`
        });
      }

      farmerId = product.farmerId;
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        unit: product.unit
      });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Database transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId: req.user!.userId,
          farmerId,
          totalAmount,
          status: 'PENDING',
          paymentMethod: paymentMethod || 'UPI',
          shippingAddress: shippingAddress || 'Default Address',
          deliveryType: deliveryType || 'DELIVERY',
          items: {
            create: validatedItems
          }
        },
        include: { items: { include: { product: true } } }
      });

      // 2. Reduce inventory and update sales count
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            salesCount: { increment: 1 }
          }
        });
      }

      // 3. Create payment record (Safe Demo Payment)
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          transactionId: `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'COMPLETED',
          amount: totalAmount,
          method: paymentMethod || 'UPI'
        }
      });

      // 4. Create delivery tracking record
      await tx.delivery.create({
        data: {
          orderId: newOrder.id,
          farmerId,
          consumerId: req.user!.userId,
          pickupLocation: 'Farmer Gate / Mandi Hub',
          deliveryLocation: shippingAddress || 'Consumer Address',
          status: 'ASSIGNED',
          distanceKm: Math.round((5 + Math.random() * 15) * 10) / 10,
          estimatedMins: Math.floor(20 + Math.random() * 30)
        }
      });

      // 5. Notify farmer
      await tx.notification.create({
        data: {
          userId: farmerId,
          title: 'New Order Received! 🛍️',
          message: `Order #${orderNumber} for ₹${totalAmount} has been placed.`,
          type: 'ORDER'
        }
      });

      // 6. Clear buyer cart if exists
      const cart = await tx.cart.findUnique({ where: { userId: req.user!.userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return newOrder;
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to place order' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let whereClause: any = {};
    if (req.user.role === 'FARMER') {
      whereClause.farmerId = req.user.userId;
    } else if (req.user.role === 'CONSUMER' || req.user.role === 'BULK_BUYER') {
      whereClause.buyerId = req.user.userId;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { id: true, name: true, email: true, phone: true, location: true } },
        farmer: { select: { id: true, name: true, location: true, farmerProfile: true } },
        items: { include: { product: true } },
        payment: true,
        delivery: true,
        reviews: true
      }
    });

    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true, phone: true, location: true } },
        farmer: { select: { id: true, name: true, location: true, farmerProfile: true } },
        items: { include: { product: true } },
        payment: true,
        delivery: true,
        reviews: true
      }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch order details' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { delivery: true }
    });

    if (updated.delivery) {
      const delStatus = status === 'DELIVERED' ? 'DELIVERED' : status === 'OUT_FOR_DELIVERY' ? 'IN_TRANSIT' : 'ASSIGNED';
      await prisma.delivery.update({
        where: { id: updated.delivery.id },
        data: { status: delStatus }
      });
    }

    // Send notification to buyer
    await prisma.notification.create({
      data: {
        userId: updated.buyerId,
        title: `Order Status Update: ${status}`,
        message: `Your order #${updated.orderNumber} is now ${status.replace(/_/g, ' ')}.`,
        type: 'ORDER'
      }
    });

    res.json({ message: 'Order status updated', order: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update order status' });
  }
};
