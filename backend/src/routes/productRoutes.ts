import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireRole(['FARMER', 'ADMIN']), createProduct);
router.put('/:id', authenticateToken, requireRole(['FARMER', 'ADMIN']), updateProduct);
router.delete('/:id', authenticateToken, requireRole(['FARMER', 'ADMIN']), deleteProduct);

export default router;
