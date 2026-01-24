import express from 'express';
import { createPharmacySale, getInventory , createPrescription, 
    getMedicines, getPrescriptionById } from '../controllers/pharmacyController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

const router = express.Router();

router.post('/sale', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), createPharmacySale);
router.get('/inventory', authenticateToken, authorizeRoles('Pharmacist', 'Admin'), getInventory);

// Ritesh Ka Code : 

// pharmacy or /prescriptions

// Doctor writes prescription
router.post('/prescriptions', authenticateToken, authorizeRoles('Doctor'), createPrescription);

// Pharmacist sells info
// router.post('/sales', authenticateToken, authorizeRoles('Pharmacist'), processPharmacySale);

// Get list of medicines
router.get('/medicines', authenticateToken, getMedicines);

// Get Prescription by ID or UHID
router.get('/prescriptions/:id', authenticateToken, getPrescriptionById);


export default router;

