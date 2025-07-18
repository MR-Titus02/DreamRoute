import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mysql from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import institutionRoutes from './routes/institution.routes.js';
import adminRoutes from './routes/admin.route.js';
import feedbackRoutes from './routes/feedback.routes.js';
import roadmapRoutes from "./routes/roadmap.route.js";
import profileRoutes from './routes/profile.routes.js';
import groqRoutes from './routes/groq.routes.js';
import googleRoutes from './routes/google.js';
import checkoutRoutes from './routes/checkout.routes.js';
import loginLogsRoutes from './routes/loginLogs.routes.js';
import analyticsRoutes from './routes/analytics.route.js';
import careerRoutes from './routes/career.route.js';
import chatRoutes from "./routes/chat.routes.js";
import progressRoutes from './routes/progress.routes.js';
import stripeRoutes from "./routes/stripe.route.js";
import contactRoutes from './routes/contact.route.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

import './config/passport.js';

dotenv.config();
const app = express();

// CORS
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Helmet security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://apis.google.com'],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Session and Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // ⚠️ Set to true in production
    sameSite: "lax",
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Stripe webhook raw parser BEFORE express.json
app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// All other routes use JSON parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/groq', groqRoutes);
app.use("/auth", googleRoutes);
app.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).send("Not authenticated");
  res.json(req.user);
});
app.use('/api/checkout', checkoutRoutes);
app.use("/api/login-logs", loginLogsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/career', careerRoutes);
app.use('/api', chatRoutes);
app.use('/api/progress', progressRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/contact", contactRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

// DB + Server start
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
