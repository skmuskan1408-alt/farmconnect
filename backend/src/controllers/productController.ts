import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { getPriceComparison } from '../services/priceComparisonService.js';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, location, minPrice, maxPrice, organic, sortBy, farmerId } = req.query;

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
        { location: { contains: String(search) } }
      ];
    }

    if (category && category !== 'all') {
      whereClause.category = { slug: String(category) };
    }

    if (location) {
      whereClause.location = { contains: String(location) };
    }

    if (farmerId) {
      whereClause.farmerId = String(farmerId);
    }

    if (organic === 'true') {
      whereClause.organic = true;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(String(minPrice));
      if (maxPrice) whereClause.price.lte = parseFloat(String(maxPrice));
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (sortBy === 'price_low') orderByClause = { price: 'asc' };
    if (sortBy === 'price_high') orderByClause = { price: 'desc' };
    if (sortBy === 'rating') orderByClause = { rating: 'desc' };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: {
        category: true,
        farmer: {
          select: {
            id: true,
            name: true,
            location: true,
            farmerProfile: true
          }
        },
        reviews: {
          select: { rating: true }
        }
      }
    });

    const categories = await prisma.category.findMany();

    res.json({ products, categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            farmerProfile: true
          }
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const priceComparison = await getPriceComparison(product.id);

    res.json({ product, priceComparison });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'FARMER') {
      return res.status(403).json({ message: 'Only farmers can create products' });
    }

    const {
      name,
      categoryId,
      description,
      price,
      quantity,
      unit,
      location,
      harvestDate,
      organic,
      deliveryAvailable,
      pickupAvailable,
      image
    } = req.body;

    if (!name || !price || !quantity || !description) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    // Default category if not specified
    let targetCatId = categoryId;
    if (!targetCatId) {
      const defaultCat = await prisma.category.findFirst();
      targetCatId = defaultCat?.id;
    }

    const product = await prisma.product.create({
      data: {
        farmerId: req.user.userId,
        categoryId: targetCatId,
        name,
        description,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        unit: unit || 'kg',
        location: location || 'India',
        harvestDate: harvestDate || new Date().toISOString().split('T')[0],
        organic: organic ?? true,
        deliveryAvailable: deliveryAvailable ?? true,
        pickupAvailable: pickupAvailable ?? true,
        image: image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
      }
    });

    // Create initial price history
    await prisma.priceHistory.create({
      data: {
        productId: product.id,
        farmConnectPrice: product.price,
        localMarketPrice: Math.round(product.price * 1.25),
        retailPrice: Math.round(product.price * 1.50)
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existing.farmerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You do not have permission to update this product' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        quantity: req.body.quantity ? parseFloat(req.body.quantity) : undefined
      }
    });

    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existing.farmerId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You do not have permission to delete this product' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};
