import express from 'express';
import { getDepartments, getServices, getMedicines } from '../controllers/masterController.js';
import {getPrescriptionById} from '../controllers/pharmacyController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/services', getServices);
router.get('/medicines', getMedicines);
router.get('/prescriptions/:id', authenticateToken, getPrescriptionById);
export default router;