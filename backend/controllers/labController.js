import prisma from '../config/db.js';

export const getLabWorklist = async (req, res) => {
    try {
        const worklist = await prisma.serviceOrder.findMany({
            where: {
                orderType: 'Lab',
                status: 'Ordered'
            },
            include: {
                service: true,
                patient: { select: { firstName: true, lastName: true, uhid: true } },
                doctor: { select: { fullName: true } }
            }
        });
        res.json(worklist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const submitLabResult = async (req, res) => {
    try {
        const { serviceOrderId, testName, resultValue, referenceRange, unit } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Result
            const labResult = await tx.labResult.create({
                data: {
                    serviceOrderId,
                    testName,
                    resultValue,
                    referenceRange,
                    unit,
                    technicianId: req.user.userId,
                }
            });

            // 2. Update Order Status
            const order = await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: { status: 'ResultAvailable' },
                include: { service: true, visit: true } // Need price and visitId
            });

            // 3. Billing Trigger
            if (order.visitId) {
                // Find or Create Draft Invoice
                let invoice = await tx.invoice.findFirst({
                    where: {
                        visitId: order.visitId,
                        status: 'Draft'
                    }
                });

                if (!invoice) {
                    invoice = await tx.invoice.create({
                        data: {
                            patientId: order.patientId,
                            visitId: order.visitId,
                            status: 'Draft',
                            totalAmount: 0,
                            taxAmount: 0,
                            discountAmount: 0,
                            netAmount: 0
                        }
                    });
                }

                // Add Line Item
                await tx.invoiceItem.create({
                    data: {
                        invoiceId: invoice.id,
                        serviceId: order.serviceId,
                        serviceOrderId: order.id,
                        itemName: order.service.name,
                        quantity: 1,
                        unitPrice: order.service.basePrice,
                        total: order.service.basePrice
                    }
                });

                // Update Invoice Totals
                // note: simpler to just increment, but for correctness we should sum? 
                // For now, simple increment logic:
                const newTotal = Number(invoice.totalAmount) + Number(order.service.basePrice);
                await tx.invoice.update({
                    where: { id: invoice.id },
                    data: {
                        totalAmount: newTotal,
                        netAmount: newTotal // neglecting tax for now
                    }
                });
            }

            return labResult;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Lab Submit Error:", error);
        res.status(500).json({ error: error.message });
    }
};
