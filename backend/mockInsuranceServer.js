import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 1. Verify Policy
// ==========================================
app.post('/api/verify-policy', async (req, res) => {
    try {
        const { policyNumber, insuranceProvider } = req.body;
        console.log(`[Verify] Checking policy: ${policyNumber} (${insuranceProvider})`);

        await delay(1000); // Simulate network lag

        if (policyNumber?.toUpperCase().startsWith('VALID')) {
            return res.status(200).json({
                status: 'ACTIVE',
                valid: true,
                policyHolder: 'John Doe (Mock)', // In real app, would fetch from DB
                validUpto: '2028-12-31',
                sumInsured: 500000,
                balance: 450000,
                copay: 10 // 10% copay
            });
        }

        return res.status(404).json({
            status: 'INVALID',
            valid: false,
            message: 'Policy not found or expired'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 2. Pre-Authorization (Cashless Request)
// ==========================================
app.post('/api/pre-auth', async (req, res) => {
    try {
        const { policyNumber, estimatedCost, hospitalId } = req.body;
        console.log(`[Pre-Auth] Request for ${policyNumber}, Cost: ${estimatedCost}`);

        await delay(2000); // Simulate processing

        // Random Approval Logic (70% Chance)
        const isApproved = Math.random() < 0.7;
        const claimId = 'CLM-' + Math.floor(Math.random() * 100000);

        if (isApproved) {
            // Sanction 80-100% of requested amount
            const sanctionPct = 0.8 + (Math.random() * 0.2);
            const sanctionedAmount = Math.floor(estimatedCost * sanctionPct);

            // Optional: Trigger Webhook after 5 seconds to simulate async update
            setTimeout(() => sendWebhookUpdate(claimId, 'PRE_AUTH_APPROVED'), 5000);

            return res.status(200).json({
                claimId,
                status: 'PRE_AUTH_APPROVED',
                sanctionedAmount,
                currency: 'INR',
                approvalDate: new Date().toISOString(),
                authorizationCode: 'AUTH-' + Math.floor(Math.random() * 10000),
                remarks: 'Pre-auth approved. Final bill subject to discharge summary.'
            });
        } else {
            // Optional: Trigger Webhook failure
            setTimeout(() => sendWebhookUpdate(claimId, 'PRE_AUTH_REJECTED'), 5000);

            return res.status(200).json({
                claimId,
                status: 'PRE_AUTH_REJECTED',
                sanctionedAmount: 0,
                remarks: 'Policy limit exceeded or condition not covered.'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 3. Enhancement (Additional amount during stay)
// ==========================================
app.post('/api/enhancement', async (req, res) => {
    try {
        const { claimId, additionalAmount, reason } = req.body;
        console.log(`[Enhancement] Claim: ${claimId}, Add: ${additionalAmount}, Reason: ${reason}`);

        await delay(2000);

        // Always approve enhancement for mock
        return res.status(200).json({
            claimId,
            status: 'ENHANCEMENT_APPROVED',
            sanctionedAmount: additionalAmount,
            totalSanctioned: 'Calculated on Client/Main Server',
            remarks: 'Enhancement approved based on justification.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// Webhook Simulator
// ==========================================
const sendWebhookUpdate = async (claimId, status) => {
    try {
        console.log(`[Webhook] Sending update for ${claimId} -> ${status}...`);

        // Assuming main server runs on 3000 (adjust if 8000 or other)
        const MAIN_SERVER_URL = 'http://localhost:8000/insurance/webhook';

        // Using native fetch (Node 18+)
        await fetch(MAIN_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                claimId,
                status,
                updatedAt: new Date().toISOString(),
                notes: 'Automated status update from TPA'
            })
        });
        console.log(`[Webhook] Sent successfully.`);
    } catch (error) {
        console.error(`[Webhook] Failed to send: ${error.message}`);
    }
};

app.listen(PORT, () => {
    console.log(`🏥 Mock Insurance TPA Server running at http://localhost:${PORT}`);
    console.log(`Endpoints: /api/verify-policy, /api/pre-auth, /api/enhancement`);
});
