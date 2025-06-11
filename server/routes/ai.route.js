// routes/openaiRoutes.js
import express from 'express';
import { generateResponse } from '../controllers/openai.controller.js';

const router = express.Router();

router.post('/chat', generateResponse);

export default router;
