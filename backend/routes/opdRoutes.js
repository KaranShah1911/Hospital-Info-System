import express from 'express';
import { triagePatient, getLiveDashboard } from '../controllers/opdController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import { 
    createEmergencyVisit, 
    createClinicalNote, 
    createServiceOrder, 
    getWaitingPatients 
} from '../controllers/opdController.js';


const router = express.Router();

// karan ke routes 
router.patch('/triage/:visitId', authenticateToken, authorizeRoles('Nurse', 'Doctor', 'Admin'), triagePatient);
router.get('/live-dashboard', authenticateToken, getLiveDashboard);


// ritesh ke routes : 
// /api/v1/opd-visits

// Emergency Triage
router.post('/emergency', authenticateToken, authorizeRoles('Nurse', 'Doctor'), createEmergencyVisit);

// Doctor's waiting list --- avoid temporary
router.get('/waiting', authenticateToken, authorizeRoles('Doctor'), getWaitingPatients);

// Clinical Actions (can be here or separate)
// Note: In rest design, maybe POST /opd-visits/:id/notes, but flat is okay too
router.post('/clinical-notes', authenticateToken, authorizeRoles('Doctor'), createClinicalNote);
router.post('/service-orders', authenticateToken, authorizeRoles('Doctor'), createServiceOrder);

export default router;
