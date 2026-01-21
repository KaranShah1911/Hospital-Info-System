import express from 'express';
import { checkIn, triagePatient, getLiveDashboard } from '../controllers/opdController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/check-in', authenticateToken, checkIn);
router.patch('/triage/:visitId', authenticateToken, authorizeRoles('Nurse', 'Doctor', 'Admin'), triagePatient);
router.get('/live-dashboard', authenticateToken, getLiveDashboard);

export default router;
