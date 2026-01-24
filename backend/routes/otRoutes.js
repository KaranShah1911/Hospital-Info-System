import { Router } from 'express';
import { getOTRooms, getSurgeries } from '../controllers/otController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Retrieve all OT rooms
router.get('/rooms', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor', 'Receptionist'), getOTRooms);

// Retrieve surgeries
router.get('/surgeries', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor'), getSurgeries);

export default router;
