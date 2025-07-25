import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
} from '../controllers/payment.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
