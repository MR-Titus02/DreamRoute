import express from 'express';
import { chatWithGroq } from '../controllers/groq.controller.js';

const router = express.Router();

router.post('/chat', chatWithGroq);

export default router;
