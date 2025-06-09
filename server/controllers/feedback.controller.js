import {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
  } from '../models/feedbackModel.js';
  
  export const postFeedback = async (req, res) => {
    try {
      const userId = req.user.id; // From auth middleware
      const { message, rating } = req.body;
  
      if (!message) return res.status(400).json({ message: 'Message is required' });
  
      const feedback = await createFeedback(userId, message, rating || null);
      res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const getFeedbacks = async (req, res) => {
    try {
      const feedbacks = await getAllFeedbacks();
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const getFeedback = async (req, res) => {
    try {
      const feedback = await getFeedbackById(req.params.id);
      if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const putFeedback = async (req, res) => {
    try {
      const feedback = await getFeedbackById(req.params.id);
      if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
  
      if (req.user.id !== feedback.user_id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this feedback' });
      }
  
      const { message, rating } = req.body;
      await updateFeedback(req.params.id, message, rating);
      res.json({ message: 'Feedback updated' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const deleteFeedbackById = async (req, res) => {
    try {
      const feedback = await getFeedbackById(req.params.id);
      if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
  
      if (req.user.id !== feedback.user_id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this feedback' });
      }
  
      await deleteFeedback(req.params.id);
      res.json({ message: 'Feedback deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  