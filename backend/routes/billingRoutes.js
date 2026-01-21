import express from 'express';
import { getActiveBill, finalizeBill } from '../controllers/billingController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/active/:visitId', authenticateToken, getActiveBill);
router.post('/finalize', authenticateToken, authorizeRoles('Admin', 'Receptionist'), finalizeBill);

export default router;
