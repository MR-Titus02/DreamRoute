import Stripe from 'stripe';
import pool from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { priceId, plan, userId } = req.body;

  try {
    // Fetch user from the database
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId,
        plan,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      const userId = parseInt(session.metadata?.userId);
      const plan = session.metadata?.plan;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;

      try {
        await pool.query(
          `INSERT INTO subscriptions
            (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              stripe_customer_id = VALUES(stripe_customer_id),
              stripe_subscription_id = VALUES(stripe_subscription_id),
              plan = VALUES(plan),
              status = VALUES(status),
              current_period_end = VALUES(current_period_end)`,
          [
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            plan,
            'active',
            new Date(session.expires_at * 1000),
          ]
        );
        console.log(`✅ User ${userId} subscription inserted/updated.`);
      } catch (err) {
        console.error('Error inserting subscription:', err.message);
      }

      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;

      try {
        await pool.query(
          'UPDATE subscriptions SET status = ?, current_period_end = ? WHERE stripe_subscription_id = ?',
          ['active', new Date(invoice.period_end * 1000), invoice.subscription]
        );
      } catch (err) {
        console.error('Error updating invoice success:', err.message);
      }

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;

      try {
        await pool.query(
          'UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?',
          ['inactive', invoice.subscription]
        );
      } catch (err) {
        console.error('Error updating invoice failure:', err.message);
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
