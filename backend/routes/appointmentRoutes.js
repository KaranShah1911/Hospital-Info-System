import { Router } from 'express';
import {
    bookAppointment,
    getAppointments,
    checkInAppointment,
    getConsultationDetails,
    completeConsultation
} from '../controllers/appointmentController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';


const router = Router();

// /api/v1/appointments
router.post('/', authenticateToken, authorizeRoles('Receptionist'), bookAppointment);
router.get('/', authenticateToken, authorizeRoles('Receptionist', 'Admin', 'Doctor'), getAppointments);
router.get('/:id/details', authenticateToken, authorizeRoles('Doctor'), getConsultationDetails);

// Mark as Completed
router.post('/:id/complete', authenticateToken, authorizeRoles('Doctor'), completeConsultation);

// Check-In is strictly a receptionist action to start the visit
router.post('/check-in', authenticateToken, authorizeRoles('Receptionist'), checkInAppointment);

export default router;
