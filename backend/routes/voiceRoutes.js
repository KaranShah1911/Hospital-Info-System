import express from 'express';
import { handleIncomingCall, processSpeech } from '../controllers/voiceController.js';

const router = express.Router();

// TwiML Webhooks
router.post('/incoming', handleIncomingCall);
router.post('/process', processSpeech);

export default router;
