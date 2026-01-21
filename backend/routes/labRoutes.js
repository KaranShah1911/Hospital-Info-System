import express from 'express';
import { getLabWorklist, submitLabResult } from '../controllers/labController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/worklist', authenticateToken, authorizeRoles('LabTech', 'Admin'), getLabWorklist);
router.post('/submit-result', authenticateToken, authorizeRoles('LabTech', 'Admin'), submitLabResult);

export default router;
