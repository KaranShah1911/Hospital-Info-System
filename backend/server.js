import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import opdRoutes from './routes/opdRoutes.js';
import clinicalRoutes from './routes/clinicalRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import labRoutes from './routes/labRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import generalRoutes from './routes/generalRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import ipdRoutes from './routes/ipdRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import otRoutes from './routes/otRoutes.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initializeSocket } from './socket/socketHandler.js';

import cors from 'cors';


dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());

app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/master', masterRoutes);
app.use('/patients', patientRoutes);
app.use('/opd', opdRoutes);
app.use('/er', opdRoutes); // Alias for ER specific routes
app.use('/clinical', clinicalRoutes);
app.use('/orders', orderRoutes);
app.use('/lab', labRoutes);
app.use('/pharmacy', pharmacyRoutes);
app.use('/billing', billingRoutes);
app.use('/general', generalRoutes);
app.use('/facility', facilityRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/ipd', ipdRoutes);
app.use('/ai', aiRoutes);
app.use('/staff', staffRoutes);
app.use('/ot', otRoutes);

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
    console.log(`MediFlow Core Server running on port ${PORT}`);
});