import { Router } from 'express';
import { getOTRooms, getSurgeries, getSurgeryById, updateSurgeryStatus } from '../controllers/otController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Retrieve all OT rooms
router.get('/rooms', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor', 'Receptionist'), getOTRooms);

// Retrieve surgeries
router.get('/surgeries', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor'), getSurgeries);
router.get('/surgeries/:id', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor'), getSurgeryById);
router.patch('/surgeries/:id/status', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor'), updateSurgeryStatus);

export default router;
