import express from 'express';
import cors from 'cors';
import path from 'path';
import { PORT } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import bulkRoutes from './routes/bulkRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import fpoRoutes from './routes/fpoRoutes.js';

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Serve Uploaded Files
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'KISSANCONNECT Full-Stack Application',
    version: '1.0.0',
    tagline: 'From Farm to Your Table — Directly.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/bulk-requests', bulkRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/fpo', fpoRoutes);

// Serve Frontend Static Assets in Production (if present)
const frontendDist = path.resolve(process.cwd(), '../frontend/dist');
app.use(express.static(frontendDist));

// SPA Fallback for React Router
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ success: false, message: 'Route not found' });
      }
    });
  }
});

// Global Error Middleware
app.use(errorHandler);

const portNumber = Number(PORT) || 5000;
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`🚀 KISSANCONNECT Backend running on port ${portNumber}`);
});
