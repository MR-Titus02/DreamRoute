import express from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';  

const router = express.Router();

// POST route for contact form submissions
router.post('/send', handleContactForm);

export default router;
