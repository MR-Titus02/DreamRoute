import express from 'express';
import { Groq } from '../controllers/groq.controller.js';

const router = express.Router();

router.post('/chat', Groq);

export default router;