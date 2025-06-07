// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById } from '../controllers/institution.controller.js';
import adminOnly from '../middlewares/adminOnlyMiddleware.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/',verifyToken, adminOnly, getAllInstitutions);         // GET /api/institutions
router.get('/:id', getInstitutionById);       // GET /api/institutions/:id

// Only accessible by users with the role "institution"
router.post('/only', verifyToken, checkRole('institution'), (req, res) => {
    res.send('Access granted to institution');
  }); 

  // Logic to create a new institution only done by admin
router.post('/new-ins',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('address').notEmpty().withMessage('Address is required'),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    verifyToken, checkRole('admin'), (req, res) => {
    res.send('New institution created');
});

// Logic to update institution only done by admin
router.put('/:id',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('address').notEmpty().withMessage('Address is required'),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    verifyToken, checkRole('admin'), (req, res) => {
    res.send(`Institution with ID ${req.params.id} updated`);
});

//logic to delete institution only done by admin
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    res.send(`Institution with ID ${req.params.id} deleted`);
});

export default router;

