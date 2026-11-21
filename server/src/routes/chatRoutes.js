import express from 'express';
import { sendMessage, getHistory, clearHistory } from '../controllers/chatController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', authenticateUser, sendMessage);
router.get('/history', authenticateUser, getHistory);
router.delete('/history', authenticateUser, clearHistory);

export default router;
