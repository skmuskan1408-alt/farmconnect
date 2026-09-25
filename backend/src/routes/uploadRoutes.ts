import { Router } from 'express';
import { upload, handleFileUpload } from '../controllers/uploadController.js';

const router = Router();

router.post('/', upload.single('file'), handleFileUpload);

export default router;
