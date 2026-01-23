import prisma from '../config/db.js';

export const createBatchOrders = async (req, res) => {
    try {
        const { patientId, visitId, admissionId, serviceIds, clinicalIndication } = req.body;
        // serviceIds: ["uuid1", "uuid2"...]

        if (!serviceIds || serviceIds.length === 0) return res.status(400).json({ error: "No services selected" });
        if (!visitId && !admissionId) return res.status(400).json({ error: "Either visitId or admissionId is required" });

        const results = await prisma.$transaction(async (tx) => {
            const orders = [];
            for (const serviceId of serviceIds) {
                // Get Service Details to know OrderType
                const service = await tx.service.findUnique({ where: { id: serviceId } });

                if (!service) throw new Error(`Service ID ${serviceId} not found`);

                let orderType = 'Procedure';
                if (service.category === 'Lab') orderType = 'Lab';
                if (service.category === 'Radiology') orderType = 'Radiology';

                const order = await tx.serviceOrder.create({
                    data: {
                        patientId,
                        visitId: visitId || null,
                        admissionId: admissionId || null,
                        doctorId: req.user.staffId,
                        serviceId,
                        orderType, // Enum: Lab, Radiology, Procedure
                        priority: 'Routine', // Default
                        clinicalIndication,
                        status: 'Ordered'
                    }
                });
                orders.push(order);
            }
            return orders;
        });

        res.status(201).json({ message: "Orders created successfully", count: results.length, orders: results });
    } catch (error) {
        console.error("Batch Order Error:", error);
        res.status(500).json({ error: error.message });
    }
};
