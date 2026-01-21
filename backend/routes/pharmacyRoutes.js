import express from 'express';
import { createPharmacySale, getInventory } from '../controllers/pharmacyController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/sale', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), createPharmacySale);
router.get('/inventory', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), getInventory);

export default router;
