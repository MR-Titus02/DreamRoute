import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedbacks', feedbackRoutes);

app.use(notFound);
app.use(errorHandler);
app.use(express.urlencoded({ extended: true }));

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// logger.info('Server started');
// logger.error('Something went wrong');

