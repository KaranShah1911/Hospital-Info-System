import express from 'express';
import cors from 'cors';
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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`MediFlow Core Server running on port ${PORT}`);
});