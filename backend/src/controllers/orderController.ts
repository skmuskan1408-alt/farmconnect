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
      'NEAR_YOU',
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
      const delStatus = status === 'DELIVERED'
        ? 'DELIVERED'
        : (status === 'OUT_FOR_DELIVERY' || status === 'NEAR_YOU')
        ? 'IN_TRANSIT'
        : 'ASSIGNED';

      await prisma.delivery.update({
        where: { id: updated.delivery.id },
        data: { status: delStatus }
      });
    }

    const statusMessages: Record<string, string> = {
      CONFIRMED: 'Your order has been confirmed.',
      PREPARING: 'Your order is being prepared.',
      READY_FOR_PICKUP: 'Your order is packed & ready for pickup.',
      PICKED_UP: 'Your order has been picked up.',
      OUT_FOR_DELIVERY: 'Your order is currently in transit.',
      NEAR_YOU: 'Your order is near you.',
      DELIVERED: 'Your order has been delivered.'
    };

    const notifyMsg = statusMessages[status] || `Your order #${updated.orderNumber} status changed to ${status.replace(/_/g, ' ')}.`;

    // Send notification to buyer
    await prisma.notification.create({
      data: {
        userId: updated.buyerId,
        title: `Order #${updated.orderNumber} Status: ${status.replace(/_/g, ' ')}`,
        message: notifyMsg,
        type: 'ORDER'
      }
    });

    res.json({ message: 'Order status updated', order: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update order status' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure authorized user (buyer or admin)
    if (order.buyerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only cancel your own orders' });
    }

    // Cancellation rule check
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'PREPARING'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled at status '${order.status}'. Cancellation is only allowed before pickup or dispatch.`
      });
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // 1. Update order status
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancellationStatus: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason || 'Cancelled by buyer'
        },
        include: { items: { include: { product: true } }, payment: true, delivery: true }
      });

      // 2. Restore stock inventory
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
            salesCount: { decrement: 1 }
          }
        });
      }

      // 3. Mark payment as REFUNDED if payment exists
      if (order.payment) {
        await tx.payment.update({
          where: { orderId: order.id },
          data: { status: 'REFUNDED' }
        });
      }

      // 4. Notify farmer & buyer
      await tx.notification.createMany({
        data: [
          {
            userId: order.buyerId,
            title: `Order #${order.orderNumber} Cancelled 🚫`,
            message: `Your order has been successfully cancelled. Demo Refund Initiated.`,
            type: 'ORDER'
          },
          {
            userId: order.farmerId,
            title: `Order #${order.orderNumber} Cancelled`,
            message: `Buyer cancelled order #${order.orderNumber}. Inventory has been restocked.`,
            type: 'ORDER'
          }
        ]
      });

      return updated;
    });

    res.json({
      message: 'Order cancelled successfully',
      refundStatus: 'Demo Refund Initiated',
      order: cancelledOrder
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to cancel order' });
  }
};
