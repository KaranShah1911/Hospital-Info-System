import express from 'express';
import {
    createPharmacySale, getInventory, createPrescription,
    getMedicines, getPrescriptionById, addStock
} from '../controllers/pharmacyController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

const router = express.Router();

router.post('/sale', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), createPharmacySale);
router.get('/inventory', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), getInventory);
router.post('/inventory', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), addStock);

// Ritesh Ka Code : 

// pharmacy or /prescriptions

// Doctor writes prescription
// Doctor writes prescription
router.post('/prescriptions', authenticateToken, authorizeRoles('Doctor'), createPrescription);

// Get single prescription (by ID or UHID) - Accessible by Pharmacist/Admin
router.get('/prescriptions/:id', authenticateToken, authorizeRoles('Pharmacist', 'Admin', 'Doctor'), getPrescriptionById);

// Pharmacist sells info
// router.post('/sales', authenticateToken, authorizeRoles('Pharmacist'), processPharmacySale);

// Get list of medicines
router.get('/medicines', authenticateToken, getMedicines);


export default router;

