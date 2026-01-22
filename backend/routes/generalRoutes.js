import express from 'express';
import { getDepartments, getServices, getMedicines } from '../controllers/masterController.js';

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/services', getServices);
router.get('/medicines', getMedicines);

export default router;