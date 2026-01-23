import { Router } from 'express';
import { 
    admitPatient, 
    transferBed, 
    recordSurgery, 
    dischargePatient 
} from '../controllers/ipdController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = Router();

// /api/v1/admissions

router.post('/', authenticateToken, authorizeRoles('Doctor', 'Receptionist'), admitPatient);
router.post('/transfer-bed', authenticateToken, authorizeRoles('Nurse', 'Receptionist'), transferBed);
router.post('/surgeries', authenticateToken, authorizeRoles('Doctor', 'Nurse'), recordSurgery); // Often under admissions or separate
router.post('/discharge', authenticateToken, authorizeRoles('Doctor'), dischargePatient);

export default router;
