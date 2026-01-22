import { Router } from 'express';
import { createWard, addBeds, getHospitalLayout } from '../controllers/facilityController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

// // Placeholder middlewares
// const authenticateUser = (req, res, next) => next(); 
// const authorizeRole = (roles) => (req, res, next) => next();

const router = Router();

// /api/v1/admin (Mounted in index.js)

// Manage Wards
router.post('/wards', authenticateToken, authorizeRoles('Admin'), createWard);

// Manage Beds (Nested under wards)
router.post('/wards/:wardId/beds', authenticateToken, authorizeRoles('Admin'), addBeds);

// Dashboard View
router.get('/layout', getHospitalLayout);

export default router;