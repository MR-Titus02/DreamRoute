// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution,  getCoursesOfInstitution, createInstitutionRequest } 
from '../controllers/institution.controller.js';

import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
// import { logUserAction } from '../utils/logger.js';

const router = express.Router();

router.get('/', getAllInstitutions);         // GET /api/institutions
router.get('/:id', getInstitutionById);       // GET /api/institutions/:id

  // Logic to create a new institution only done by admin
router.post('/new-ins',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('address').notEmpty().withMessage('Address is required')
    ],
    verifyToken, checkRole('admin'), createInstitution);

// Logic to update institution only done by admin
router.put('/:id',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('address').notEmpty().withMessage('Address is required'),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    verifyToken,  updateInstitution);

//logic to delete institution only done by admin
router.delete('/:id', verifyToken,  deleteInstitution);

router.put('/update', verifyToken, updateInstitution);

router.get("/:id/courses", verifyToken ,getCoursesOfInstitution);

router.post(
  "/requests",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("description").optional().trim(),
    body("address").optional().trim(),
  ],
  createInstitutionRequest
);

export default router;
