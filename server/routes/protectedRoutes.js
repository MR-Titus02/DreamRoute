import express from 'express';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route for all logged-in users
router.get('/dashboard', verifyToken, (req, res) => {
  res.send('Access granted to user dashboard');
});

// Only accessible by users with the role "institution"
router.post('/institution-only', verifyToken, checkRole('institution'), (req, res) => {
  res.send('Access granted to institution');
});

export default router;


