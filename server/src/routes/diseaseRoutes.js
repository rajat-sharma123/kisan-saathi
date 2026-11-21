import express from 'express';
import { analyzeDisease, getHistory } from '../controllers/diseaseController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', authenticateUser, upload.single('image'), analyzeDisease);
router.get('/history', authenticateUser, getHistory);

export default router;
