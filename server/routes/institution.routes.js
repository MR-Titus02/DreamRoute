// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById } from '../controllers/institution.controller.js';

const router = express.Router();

router.get('/', getAllInstitutions);         // GET /api/institutions
router.get('/:id', getInstitutionById);      // GET /api/institutions/:id

export default router;
