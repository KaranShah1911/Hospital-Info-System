import { Router } from "express";
import { createMessage, createWhatsappMessage } from "../controllers/messagingController.js";
const router = Router();

router.post('/send-sms', createMessage);
router.post('/send-whatsapp', createWhatsappMessage);

export default router;
