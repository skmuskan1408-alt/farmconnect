import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
      include: {
        items: {
          include: {
            product: {
              include: { farmer: { select: { id: true, name: true, location: true } } }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.userId },
        include: { items: { include: { product: { include: { farmer: true } } } } }
      });
    }

    res.json({ cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, quantity } = req.body;
    const reqQty = parseFloat(quantity) || 1.0;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < reqQty) {
      return res.status(400).json({ message: `Insufficient inventory. Available: ${product.quantity} ${product.unit}` });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      const newQty = existingItem.quantity + reqQty;
      if (product.quantity < newQty) {
        return res.status(400).json({ message: `Cannot add more. Total request (${newQty}) exceeds available stock (${product.quantity})` });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: reqQty
        }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json({ message: 'Item added to cart', cart: updatedCart });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    const newQty = parseFloat(quantity);
    if (newQty <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return res.json({ message: 'Cart item removed' });
    }

    if (cartItem.product.quantity < newQty) {
      return res.status(400).json({ message: `Cannot exceed available inventory (${cartItem.product.quantity})` });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: newQty }
    });

    res.json({ message: 'Cart item updated', cartItem: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    res.json({ message: 'Cart item removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to remove cart item' });
  }
};
