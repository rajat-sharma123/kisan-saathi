import express from 'express';
import { recommendCrop, getHistory } from '../controllers/cropController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/recommend', authenticateUser, recommendCrop);
router.get('/history', authenticateUser, getHistory);

export default router;
