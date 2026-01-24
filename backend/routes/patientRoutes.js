import express from 'express';
import { registerPatient, searchPatient, searchPatientSuggestions } from '../controllers/patientController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerPatient);
router.get('/search', authenticateToken, searchPatient);
router.get('/suggestions', authenticateToken, searchPatientSuggestions);

export default router;
