import { Router } from "express";
import {calculateHolisticScore} from "../controllers/aiController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/summary', authenticateToken, authorizeRoles('Doctor'), calculateHolisticScore);

export default router;
