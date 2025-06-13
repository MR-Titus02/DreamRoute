// feedbackController.js
import * as feedbackModel from '../models/feedbackModel.js';
import { logUserAction } from '../utils/logger.js';

export async function getAllFeedbacks(req, res) {
  try {
    const feedbacks = await feedbackModel.getAllFeedbacksFromDb();
    res.json(feedbacks);
    await logUserAction(req.user.userId, 'Fetched all feedbacks', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
    await logUserAction(req.user.userId, 'Get all feedbacks failed', JSON.stringify(req.body));
  }
}

export async function getFeedbackById(req, res) {
  try {
    const feedback = await feedbackModel.getFeedbackByIdFromDb(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
    await logUserAction(req.user.userId, 'Fetched feedback by ID', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
    await logUserAction(req.user.userId, 'Get feedback by ID failed', JSON.stringify(req.body));
  }
}

export async function createFeedback(req, res) {
  try {
    const user_id = req.user.userId;
    const {  course_id, institution_id, message, rating } = req.body;
    

    if (!message || !rating || (!course_id && !institution_id)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const feedbackId = await feedbackModel.createFeedbackInDb({ user_id, course_id, institution_id, message, rating });
    res.status(201).json({ id: feedbackId, message: 'Feedback created' });
    await logUserAction(user_id, 'Created feedback', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
    await logUserAction(req.user.userId, 'Create feedback failed', JSON.stringify(req.body));
  }
}

export async function updateFeedback(req, res) {
  try {
    await feedbackModel.updateFeedbackInDb(req.params.id, req.body);
    res.json({ message: 'Feedback updated' });
    await logUserAction(req.user.userId, 'Updated feedback', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
    await logUserAction(req.user.userId, 'Update feedback failed', JSON.stringify(req.body));
  }
}

export async function deleteFeedback(req, res) {
  try {
    await feedbackModel.deleteFeedbackFromDb(req.params.id);
    res.json({ message: 'Feedback deleted' });
    await logUserAction(req.user.userId, 'Deleted feedback', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
    await logUserAction(req.user.userId, 'Delete feedback failed', JSON.stringify(req.body));
  }
}