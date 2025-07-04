import express from 'express';
import { changeUserRole } from '../controllers/admin.controller.js';
import { checkRole, verifyToken } from '../middlewares/authMiddleware.js';
import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin route to change user role
router.put('/change/:id', verifyToken, checkRole('admin'), changeUserRole);
  
  router.get("/", getAllRequests);
  router.post("/:id/approve", approveRequest);
  router.post("/:id/reject", rejectRequest);

export default router;
