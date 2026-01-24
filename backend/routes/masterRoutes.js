import express from 'express';
import { createDepartment, getDepartments, createService, getServices, createMedicine, getMedicines, getDoctors } from '../controllers/masterController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/departments', authenticateToken, authorizeRoles('Admin'), createDepartment);

router.post('/services', authenticateToken, authorizeRoles('Admin'), createService);

router.post('/medicines', authenticateToken, authorizeRoles('Admin', 'Pharmacist'), createMedicine);

router.get('/departments', authenticateToken, getDepartments);
router.get('/services', authenticateToken, getServices);
router.get('/users/doctors', authenticateToken, getDoctors);
router.get('/medicines', authenticateToken, getMedicines);

export default router;
