import prisma from '../config/db.js';

export const getActiveBill = async (req, res) => {
    try {
        const { visitId } = req.params;

        // 1. Fetch Draft Invoice (Services, Labs)
        const invoice = await prisma.invoice.findFirst({
            where: {
                visitId,
                status: 'Draft'
            },
            include: { items: true }
        });

        // 2. Fetch Unbilled Pharmacy Sales (Assuming we link by Patient, but strictly link by Visit if possible? 
        // PharmacySale doesn't have visitId, only patientId. 
        // We'll simplisticly fetch sales "today" or recent? 
        // Or fetch ALL sales for this patient that are not "Paid"? 
        // Schema doesn't track "Paid" status on PharmacySale, only on Invoice/Claim.
        // This is a Schema gap. We will fetch "PharmacySale" for this patient created AFTER the visitDate.

        const visit = await prisma.opdVisit.findUnique({ where: { id: visitId } });
        if (!visit) return res.status(404).json({ error: "Visit not found" });

        const pharmacySales = await prisma.pharmacySale.findMany({
            where: {
                patientId: visit.patientId,
                saleDate: { gte: visit.visitDate } // Sales since visit start
            },
            include: { items: { include: { medicine: true } } }
        });

        // Calculate Totals
        const invoiceTotal = invoice ? Number(invoice.totalAmount) : 0;
        const pharmacyTotal = pharmacySales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

        const grandTotal = invoiceTotal + pharmacyTotal;

        res.json({
            visitId,
            patientId: visit.patientId,
            invoice,
            pharmacySales,
            summary: {
                servicesTotal: invoiceTotal,
                pharmacyTotal,
                grandTotal
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const finalizeBill = async (req, res) => {
    try {
        const { visitId } = req.body; // or invoiceId

        // This would perform the final lock.
        // For simplicity, we just mark the existing Invoice as Finalized.
        // Ideally we would also mark PharmacySales as "Billed" if we had a field.

        // Find Draft Invoice
        const invoice = await prisma.invoice.findFirst({
            where: { visitId, status: 'Draft' }
        });

        if (invoice) {
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: 'Finalized' }
            });
        }

        await prisma.opdVisit.update({
            where: { id: visitId },
            data: { status: 'Completed' }
        });

        res.json({ message: "Bill Finalized and Visit Completed" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
