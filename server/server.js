import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import mysql from 'mysql2/promise';
import userRoutes from './routes/user.routes.js';
// import logger from './utils/logger.js';
import courseRoutes from './routes/course.routes.js';
import institutionRoutes from './routes/institution.routes.js';
import adminRoutes from './routes/admin.route.js';
import feedbackRoutes from './routes/feedback.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import roadmapRoutes from "./routes/roadmap.route.js";
import profileRoutes from './routes/profile.routes.js';
import groqRoutes from './routes/groq.routes.js';
import cookieParser from 'cookie-parser';
import googleRoutes from './routes/google.js';
import passport from 'passport';
import './config/passport.js';
import session from 'express-session';
import checkoutRoutes from './routes/checkout.routes.js';
import loginLogsRoutes from './routes/loginLogs.routes.js';
import analyticsRoutes from './routes/analytics.route.js';
import careerRoutes from './routes/career.route.js';



dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json());
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://apis.google.com'], // allow external if needed
          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // if using third-party embeds like iframes
    })
  );
//OAuth
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());


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

app.use(notFound);
app.use(errorHandler);
app.use(express.urlencoded({ extended: true }));

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// logger.info('Server started');
// logger.error('Something went wrong');

