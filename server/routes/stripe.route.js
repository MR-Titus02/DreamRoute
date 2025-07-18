import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createPaymentIntent,
  createSubscription,
  paymentSuccess,
  manualPlanUpdate,
  handleStripeWebhook
} from "../controllers/stripe.controller.js";

const router = express.Router();

// Webhook (must use raw body middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// One-Time Payment Intent
router.post("/create-payment-intent", createPaymentIntent);

// Create Stripe Subscription (Pro/Premium)
router.post("/create-subscription", verifyToken, createSubscription);

// One-Time Payment Success (Set Plan + Expiry)
router.post("/payment/success", verifyToken, paymentSuccess);

// Manual Dev-Only Plan Update
router.post("/payment/manual-update", manualPlanUpdate);

export default router;
