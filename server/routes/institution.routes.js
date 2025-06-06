// routes/institutionRoutes.js
import express from 'express';
import { getAllInstitutions, getInstitutionById } from '../controllers/institution.controller.js';
import adminOnly from '../middlewares/adminOnlyMiddleware.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', adminOnly, getAllInstitutions);         // GET /api/institutions
router.get('/:id', getInstitutionById);       // GET /api/institutions/:id

// Only accessible by users with the role "institution"
router.post('/only', verifyToken, checkRole('institution'), (req, res) => {
    res.send('Access granted to institution');
  }); 

  // Logic to create a new institution only done by admin
router.post('/new-ins', verifyToken, checkRole('admin'), (req, res) => {
    res.send('New institution created');
});

//logic to delete institution only done by admin
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
    res.send(`Institution with ID ${req.params.id} deleted`);
});

export default router;

