import { Router } from 'express';
import { 
    getActiveBill, 
    finalizeBill, 
    generateInvoiceForServiceOrder, 
    generateInvoiceForPrescription 
} from '../controllers/billingController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/visits/active', authenticateToken, authorizeRoles('Receptionist', 'Admin'), getActiveBill);
router.post('/finalize', authenticateToken, authorizeRoles('Receptionist', 'Admin'), finalizeBill);
router.post('/invoices/service-order', authenticateToken, authorizeRoles('Receptionist', 'Admin'), generateInvoiceForServiceOrder);
router.post('/invoices/prescription', authenticateToken, authorizeRoles('Receptionist', 'Admin'), generateInvoiceForPrescription);

export default router;
