// feedback.routes.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedback.controller.js';
import { logUserAction } from '../utils/logger.js';

const router = express.Router();

router.get('/', getAllFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', verifyToken, createFeedback);
router.put('/:id', verifyToken, updateFeedback);
router.delete('/:id', verifyToken, deleteFeedback);

export default router;