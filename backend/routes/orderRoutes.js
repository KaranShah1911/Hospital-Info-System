import express from 'express';
import { createBatchOrders, getOrdersByAdmission } from '../controllers/orderController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/batch-create', authenticateToken, authorizeRoles('Doctor'), createBatchOrders);
router.get('/admission/:admissionId', authenticateToken, authorizeRoles('Doctor', 'Nurse', 'Receptionist'), getOrdersByAdmission);

export default router;
