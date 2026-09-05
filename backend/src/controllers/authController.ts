import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      location,
      role,
      // Role specific fields
      farmName,
      farmLocation,
      farmingType,
      organizationName,
      businessType,
      requiredProducts,
      expectedQuantity
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || '+91 9999999999',
        password: hashedPassword,
        role: role.toUpperCase(),
        location: location || 'India',
        cart: role.toUpperCase() === 'CONSUMER' ? { create: {} } : undefined,
        farmerProfile: role.toUpperCase() === 'FARMER' ? {
          create: {
            farmName: farmName || `${name}'s Farm`,
            farmLocation: farmLocation || location || 'India',
            farmingType: farmingType || 'Organic & Natural'
          }
        } : undefined,
        buyerProfile: role.toUpperCase() === 'BULK_BUYER' ? {
          create: {
            organizationName: organizationName || `${name} Agri Corp`,
            businessType: businessType || 'Wholesale Buyer',
            requiredProducts: requiredProducts || 'Vegetables & Grains',
            expectedQuantity: expectedQuantity || '1000kg'
          }
        } : undefined,
        consumerProfile: role.toUpperCase() === 'CONSUMER' ? {
          create: {
            preferredCategory: 'Vegetables',
            addressLine: location || 'India'
          }
        } : undefined
      },
      include: {
        farmerProfile: true,
        consumerProfile: true,
        buyerProfile: true
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        farmerProfile: true,
        consumerProfile: true,
        buyerProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        farmerProfile: true,
        consumerProfile: true,
        buyerProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch user' });
  }
};
