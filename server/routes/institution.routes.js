// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution } from '../controllers/institution.controller.js';
import adminOnly from '../middlewares/adminOnlyMiddleware.js';
import { verifyToken, checkRole, isInstitution } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';


const router = express.Router();

router.get('/',verifyToken, adminOnly, getAllInstitutions);         // GET /api/institutions
router.get('/:id', getInstitutionById);       // GET /api/institutions/:id

// Only accessible by users with the role "institution"
// router.post('/only', verifyToken, checkRole('institution')); 

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

router.put('/update', verifyToken, isInstitution, updateInstitution);


export default router;