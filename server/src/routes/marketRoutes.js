import express from 'express';
import { getPrices } from '../controllers/marketController.js';

const router = express.Router();

router.get('/prices', getPrices);

export default router;
