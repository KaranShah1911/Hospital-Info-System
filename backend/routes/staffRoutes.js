import { Router } from "express";
import { getStaffByRole } from "../controllers/staffController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/', authenticateToken, authorizeRoles('Admin', 'OTManager', 'Doctor', 'Receptionist'), getStaffByRole);

export default router;
