// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution } from '../controllers/institution.controller.js';

import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
// import { logUserAction } from '../utils/logger.js';

const router = express.Router();

router.get('/',verifyToken, getAllInstitutions);         // GET /api/institutions
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
    verifyToken, checkRole('admin'), updateInstitution);

//logic to delete institution only done by admin
router.delete('/:id', verifyToken, checkRole('admin'), deleteInstitution);

router.put('/update', verifyToken, updateInstitution);



export default router;