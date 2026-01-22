import express from 'express';
import { createDepartment, getDepartments, createService, getServices, createMedicine, getMedicines } from '../controllers/masterController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/departments', authenticateToken, authorizeRoles('Admin'), createDepartment);
router.get('/departments', getDepartments);

router.post('/services', authenticateToken, authorizeRoles('Admin'), createService);
router.get('/services', getServices);

router.post('/medicines', authenticateToken, authorizeRoles('Admin', 'Pharmacist'), createMedicine);
router.get('/medicines', getMedicines);

export default router;
