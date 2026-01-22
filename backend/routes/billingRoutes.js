import express from 'express';
import { getActiveBill, finalizeBill , generateInvoiceForServiceOrder, generateInvoiceForPrescription } from '../controllers/billingController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/active/:visitId', authenticateToken, getActiveBill);
router.post('/finalize', authenticateToken, authorizeRoles('Admin', 'Receptionist'), finalizeBill);


// Ritesh Routes : 
router.post('/invoices/service-order', authenticateToken, authorizeRoles('Receptionist'),generateInvoiceForServiceOrder);
router.post('/invoices/prescription', authenticateToken, authorizeRoles('Receptionist'), generateInvoiceForPrescription);

export default router;
