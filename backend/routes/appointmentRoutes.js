import { Router } from 'express';
import { bookAppointment, getAppointments, checkInAppointment } from '../controllers/appointmentController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();

// /api/v1/appointments
router.post('/', authenticateToken, authorizeRoles('Receptionist'), bookAppointment);
router.get('/', authenticateToken, authorizeRoles('Receptionist' , 'Admin'), getAppointments);

// Check-In is strictly a receptionist action to start the visit
router.post('/check-in', authenticateToken, authorizeRoles('Receptionist'), checkInAppointment);

export default router;
