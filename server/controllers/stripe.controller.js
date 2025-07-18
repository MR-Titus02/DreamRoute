import Stripe from "stripe";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro: "price_1RlNC7B7LCNwTzAibT4mDcY9",
  premium: "price_1RlNCNB7LCNwTzAiIjn7LENH",
};

// 🎯 One-Time Payment Intent
export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Stripe Payment Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// 🆕 Create Subscription
export const createSubscription = async (req, res) => {
  const { selectedPlan, paymentMethodId, userId: userIdFromBody } = req.body;
  const userId = req.user?.userId || userIdFromBody;

  console.log("🟢 [Subscription Request] Plan:", selectedPlan, "| User ID:", userId, "| PaymentMethodID:", paymentMethodId);

  try {
    // 🛑 1. Validate inputs
    if (!PRICE_IDS[selectedPlan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }
    if (!paymentMethodId || !userId) {
      return res.status(400).json({ message: "Missing payment method or user ID" });
    }

    // 🧑‍💼 2. Fetch user
    const [userRows] = await pool.query("SELECT email, stripe_customer_id FROM users WHERE id = ?", [userId]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("✅ Found user:", user.email);

    // 3. Reuse customer if available
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Save it for future
      await pool.query("UPDATE users SET stripe_customer_id = ? WHERE id = ?", [customerId, userId]);
      console.log("✅ Created and saved new Stripe customer");
    } else {
      console.log("🔁 Reusing existing Stripe customer");
    }

    // 🧾 4. Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // 📌 5. Set default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 💳 6. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PRICE_IDS[selectedPlan] }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    const clientSecret = subscription?.latest_invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      console.error("❌ PaymentIntent client_secret not available");
      console.dir(subscription, { depth: null });
      return res.status(500).json({ message: "PaymentIntent client_secret missing" });
    }

    // 🧠 7. Save subscription ID
    await pool.query(
      "UPDATE users SET stripe_subscription_id = ? WHERE id = ?",
      [subscription.id, userId]
    );

    console.log("✅ Subscription created. Returning clientSecret...");
    res.status(200).json({
      clientSecret,
      subscriptionId: subscription.id,
    });

  } catch (error) {
    console.error("❌ Stripe Subscription Error:", error.message);
    console.dir(error, { depth: null });
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
};

// ✅ Mark Payment Success
export const paymentSuccess = async (req, res) => {
  const { userId, selectedPlan } = req.body;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  try {
    await pool.query(
      "UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?",
      [selectedPlan.toLowerCase(), expiresAt, userId]
    );
    res.status(200).json({ message: "✅ Plan updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update plan:", err);
    res.status(500).json({ error: "Failed to update plan" });
  }
};

// ⚙️ Manual Dev-Only Plan Update
export const manualPlanUpdate = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "🚫 Manual update not allowed in production" });
  }

  const { userId, selectedPlan } = req.body;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  try {
    await pool.query(
      "UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?",
      [selectedPlan.toLowerCase(), expiresAt, userId]
    );
    res.status(200).json({ message: "✅ Manual plan update success" });
  } catch (err) {
    console.error("❌ Manual update error:", err);
    res.status(500).json({ message: "Manual update failed" });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📥 Stripe Webhook received:', event.type);

  try {
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const plan = subscription.items?.data?.[0]?.price?.nickname || 'pro';
      const currentPeriodEnd = subscription.current_period_end;

      const [userResult] = await pool.query(
        'SELECT id FROM users WHERE stripe_customer_id = ?',
        [customerId]
      );

      if (userResult.length > 0) {
        const userId = userResult[0].id;

        await pool.query(
          'UPDATE users SET plan = ?, plan_expires_at = FROM_UNIXTIME(?) WHERE id = ?',
          [plan, currentPeriodEnd, userId]
        );

        console.log(`✅ Updated user ${userId} with plan "${plan}"`);
      } else {
        console.warn(`⚠️ No user found with Stripe customer ID ${customerId}`);
      }
    } else if (event.type === 'invoice.paid') {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      // We can try to get subscription id from invoice
      const subscriptionId = invoice.subscription;

      // Optionally fetch subscription details from Stripe API if needed
      const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;

      const plan = subscription?.items?.data?.[0]?.price?.nickname || 'pro';
      const currentPeriodEnd = subscription?.current_period_end || Math.floor(Date.now() / 1000);

      const [userResult] = await pool.query(
        'SELECT id FROM users WHERE stripe_customer_id = ?',
        [customerId]
      );

      if (userResult.length > 0) {
        const userId = userResult[0].id;

        await pool.query(
          'UPDATE users SET plan = ?, plan_expires_at = FROM_UNIXTIME(?) WHERE id = ?',
          [plan, currentPeriodEnd, userId]
        );

        console.log(`✅ Updated user ${userId} with plan "${plan}"`);
      } else {
        console.warn(`⚠️ No user found with Stripe customer ID ${customerId}`);
      }
    }
  } catch (dbErr) {
    console.error('❌ DB update failed:', dbErr);
  }

  res.status(200).send('✅ Webhook received');
};
