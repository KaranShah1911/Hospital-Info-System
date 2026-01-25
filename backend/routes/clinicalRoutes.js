import express from 'express';
import { saveNote, getPatientHistory, saveVitals } from '../controllers/clinicalController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/notes', authenticateToken, authorizeRoles('Doctor'), saveNote);
router.post('/vitals', authenticateToken, authorizeRoles('Doctor', 'Nurse'), saveVitals);
router.get('/history/:id', authenticateToken, authorizeRoles('Doctor', 'Nurse'), getPatientHistory);

export default router;
