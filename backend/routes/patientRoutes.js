import express from 'express';
import { registerPatient, searchPatient } from '../controllers/patientController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerPatient);
router.get('/search', authenticateToken, searchPatient);

export default router;
