import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import pool from '../config/db.js'; // Your MySQL pool connection

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent (Stripe)
router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment Success - Update user plan
router.post("/payment/success", async (req, res) => {
  const { userId, selectedPlan } = req.body;

  try {
    // Using raw SQL with pool.query:
    await pool.query('UPDATE users SET plan = ? WHERE id = ?', [selectedPlan, userId]);

    // If using Sequelize:
    // await User.update({ plan: selectedPlan }, { where: { id: userId } });

    res.status(200).json({ message: "Plan updated successfully" });
  } catch (err) {
    console.error("Failed to update plan:", err);
    res.status(500).json({ error: "Failed to update plan" });
  }
});

// Manual Plan Update (dev/testing only)
router.post("/payment/manual-update", async (req, res) => {
  const { userId, newPlan } = req.body;

  try {
    await pool.query('UPDATE users SET plan = ? WHERE id = ?', [newPlan, userId]);

    res.status(200).json({ message: `User plan manually set to ${newPlan}` });
  } catch (err) {
    console.error("Manual update failed:", err);
    res.status(500).json({ error: "Failed to manually update plan" });
  }
});

export default router;
