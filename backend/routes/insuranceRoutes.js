import { Router } from 'express';
import { verifyPolicy, initiateClaim, handleWebhook, getClaims } from '../controllers/insuranceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/verify', authenticateToken, verifyPolicy);
router.post('/claims', authenticateToken, initiateClaim);
router.get('/claims', authenticateToken, getClaims);
router.post('/webhook', handleWebhook); // Public for TPA to call

export default router;
