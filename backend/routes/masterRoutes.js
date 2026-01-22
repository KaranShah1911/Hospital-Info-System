import express from 'express';
import { createDepartment, getDepartments, createService, getServices, createMedicine, getMedicines } from '../controllers/masterController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/departments', authenticateToken, authorizeRoles('Admin'), createDepartment);

router.post('/services', authenticateToken, authorizeRoles('Admin'), createService);

router.post('/medicines', authenticateToken, authorizeRoles('Admin', 'Pharmacist'), createMedicine);

export default router;
