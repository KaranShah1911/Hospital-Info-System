import express from 'express';
import { createBatchOrders } from '../controllers/orderController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/batch-create', authenticateToken, authorizeRoles('Doctor'), createBatchOrders);

export default router;
