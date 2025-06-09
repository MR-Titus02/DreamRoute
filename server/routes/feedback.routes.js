import express from 'express';
import {
  postFeedback,
  getFeedbacks,
  getFeedback,
  putFeedback,
  deleteFeedbackById,
} from '../controllers/feedback.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public - Read feedbacks
router.get('/', getFeedbacks);
router.get('/:id', getFeedback);

// Protected - Create, Update, Delete
router.post('/', verifyToken, postFeedback);
router.put('/:id', verifyToken, putFeedback);
router.delete('/:id', verifyToken, deleteFeedbackById);

export default router;
