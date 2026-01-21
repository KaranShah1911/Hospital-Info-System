import express from 'express';
import { saveNote, getPatientHistory } from '../controllers/clinicalController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/notes', authenticateToken, authorizeRoles('Doctor'), saveNote);
router.get('/history/:id', authenticateToken, authorizeRoles('Doctor', 'Nurse'), getPatientHistory);

export default router;
