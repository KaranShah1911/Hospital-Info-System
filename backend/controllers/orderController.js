import prisma from '../config/db.js';

export const createBatchOrders = async (req, res) => {
    try {
        const {
            patientId,
            visitId,
            admissionId,
            serviceIds,
            clinicalIndication
        } = req.body;

        console.log("Ran , ram")

        // ------------------------
        // VALIDATIONS
        // ------------------------
        if (!patientId) {
            return res.status(400).json({ error: "patientId is required" });
        }

        if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
            return res.status(400).json({ error: "No services selected" });
        }

        // IMPORTANT: strict check
        if (visitId === undefined && admissionId === undefined) {
            return res.status(400).json({
                error: "Either visitId or admissionId is required"
            });
        }

        if (!req.user?.staffId) {
            return res.status(401).json({ error: "Unauthorized doctor" });
        }

        // ------------------------
        // TRANSACTION
        // ------------------------
        const orders = await prisma.$transaction(async (tx) => {
            const createdOrders = [];

            for (const serviceId of serviceIds) {
                const service = await tx.service.findUnique({
                    where: { id: serviceId }
                });

                if (!service) {
                    throw new Error(`Service not found: ${serviceId}`);
                }

                let orderType = "Procedure";
                if (service.category === "Lab") orderType = "Lab";
                if (service.category === "Radiology") orderType = "Radiology";

                const order = await tx.serviceOrder.create({
                    data: {
                        patientId,
                        visitId: visitId ?? null,
                        admissionId: admissionId ?? null,
                        doctorId: req.user.staffId,
                        serviceId,
                        orderType,
                        priority: "Routine",
                        clinicalIndication: clinicalIndication || null,
                        status: "Ordered"
                    },
                    include: {
                        service: true
                    }
                });

                createdOrders.push(order);
            }

            return createdOrders;
        });

        return res.status(201).json({
            message: "Orders created successfully",
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Batch Order Error:", error);
        return res.status(500).json({
            error: error.message || "Failed to create orders"
        });
    }
};

