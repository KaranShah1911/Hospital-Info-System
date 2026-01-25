import express from 'express';
import { registerPatient, searchPatient, searchPatientSuggestions , searchPatientForEMR } from '../controllers/patientController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerPatient);
router.get('/search', authenticateToken, searchPatient);
router.get('/suggestions', authenticateToken, searchPatientSuggestions);

router.get('/search-for-emr', searchPatientForEMR);
export default router;
