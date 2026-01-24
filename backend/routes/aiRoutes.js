import { Router } from 'express';
import { generateHealthSummary } from '../controllers/aiController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/summary', authenticateToken, authorizeRoles('Doctor'), generateHealthSummary);

export default router;
