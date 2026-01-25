import express from 'express';
import { getLabWorklist, submitLabResult, updateOrderStatus } from '../controllers/labController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/worklist', authenticateToken, authorizeRoles('LabTech', 'Admin'), getLabWorklist);
router.post('/submit-result', authenticateToken, authorizeRoles('LabTech', 'RadiologyTech', 'Admin'), submitLabResult);
router.patch('/update-status/:orderId', authenticateToken, authorizeRoles('LabTech', 'RadiologyTech', 'Admin'), updateOrderStatus);

export default router;
