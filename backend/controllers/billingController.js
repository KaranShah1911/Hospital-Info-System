import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get Active Bill Details
// Logic: Fetches all UNPAID ServiceOrders and Prescriptions for a specific Visit.
// Calculates the total estimated bill.
export const getActiveBill = async (req, res) => {
    try {
        const { visitId } = req.params;

        // 1. Fetch Visit to ensure it exists
        const visit = await prisma.opdVisit.findUnique({ where: { id: visitId } });
        if (!visit) throw new ApiError(404, "Visit not found");

        // 2. Fetch Unpaid Service Orders
        const unpaidServiceOrders = await prisma.serviceOrder.findMany({
            where: {
                visitId,
                isPaid: false,
                status: { not: 'Cancelled' } // Assuming we have Cancelled? Schema says Completed/Ordered etc.
                // Status enum: Ordered, SampleCollected, ResultAvailable, Completed.
                // We bill regardless of status unless explicitly rejected? usually bill on order.
            },
            include: { service: true }
        });

        // 3. Fetch Unpaid Prescriptions
        const unpaidPrescriptions = await prisma.prescription.findMany({
            where: {
                visitId,
                isPaid: false
            },
            include: {
                items: {
                    include: { medicine: true }
                }
            }
        });

        // 4. Calculate Totals
        // Service Orders
        let serviceTotal = 0;
        const serviceItems = unpaidServiceOrders.map(order => {
            const amount = Number(order.service.basePrice);
            serviceTotal += amount;
            return {
                type: 'Service',
                id: order.id,
                name: order.service.name,
                amount
            };
        });

        // Prescriptions
        let pharmacyTotal = 0;
        const prescriptionItems = unpaidPrescriptions.map(pres => {
            let presSum = 0;
            const details = pres.items.map(item => {
                // Assuming quantity 1 if not defined, usually prescription item has strict dosage. 
                // But for billing we need unit count. Logic: if pharmacy sale handles it, precision is there.
                // Here we estimate.
                const price = Number(item.medicine.unitPrice);
                presSum += price;
                return {
                    medicine: item.medicine.name,
                    price
                };
            });
            pharmacyTotal += presSum;
            return {
                type: 'Prescription',
                id: pres.id,
                name: `Prescription on ${new Date(pres.date).toLocaleDateString()}`,
                amount: presSum,
                details
            };
        });

        // 5. Check for any existing Draft Invoice (Legacy support if mixed)
        const draftInvoice = await prisma.invoice.findFirst({
            where: { visitId, status: 'Draft' },
            include: { items: true }
        });
        const draftTotal = draftInvoice ? Number(draftInvoice.totalAmount) : 0;

        const grandTotal = serviceTotal + pharmacyTotal + draftTotal;

        res.status(200).json(new ApiResponse(200, {
            visitId,
            serviceItems,
            prescriptionItems,
            draftInvoice,
            summary: {
                serviceTotal,
                pharmacyTotal,
                draftTotal,
                grandTotal
            }
        }, "Active bill details fetched"));

    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Finalize Bill
// Logic: Completes the visit and finalizes any draft invoice.
export const finalizeBill = async (req, res) => {
    try {
        const { visitId } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // Check for pending unpaid items? 
            // Optional: Block finalization if unpaid items exist?
            // For now, we follow user instruction: "mark existing Invoice as Finalized" and "Visit as Completed".

            // 1. Finalize Draft Invoice if exists
            const invoice = await tx.invoice.findFirst({
                where: { visitId, status: 'Draft' }
            });

            if (invoice) {
                await tx.invoice.update({
                    where: { id: invoice.id },
                    data: { status: 'Finalized' }
                });
            }

            // 2. Mark Visit as Completed
            const visit = await tx.opdVisit.update({
                where: { id: visitId },
                data: { status: 'Completed' }
            });

            return visit;
        });

        res.status(200).json(new ApiResponse(200, result, "Bill finalized and Visit completed"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Generate Invoice for Service Order
// Logic: Creates a PAID invoice for a single service order and updates isPaid=true.
export const generateInvoiceForServiceOrder = async (req, res) => {
    try {
        const { serviceOrderId } = req.body;

        const serviceOrder = await prisma.serviceOrder.findUnique({
            where: { id: serviceOrderId },
            include: { service: true }
        });

        if (!serviceOrder) throw new ApiError(404, "Service Order not found");
        if (serviceOrder.isPaid) throw new ApiError(400, "Service Order is already paid");

        const amount = Number(serviceOrder.service.basePrice);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    patientId: serviceOrder.patientId,
                    visitId: serviceOrder.visitId,
                    admissionId: serviceOrder.admissionId,
                    totalAmount: amount,
                    taxAmount: 0,
                    discountAmount: 0,
                    netAmount: amount,
                    status: "Paid",
                    items: {
                        create: [{
                            itemName: serviceOrder.service.name,
                            quantity: 1,
                            unitPrice: amount,
                            total: amount,
                            serviceId: serviceOrder.serviceId,
                            serviceOrderId: serviceOrder.id
                        }]
                    }
                }
            });

            // 2. Mark Service Order as Paid
            await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: { isPaid: true }
            });

            return invoice;
        });

        res.status(201).json(new ApiResponse(201, result, "Invoice created for Service Order"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Generate Invoice for Prescription
// Logic: Creates a PAID invoice for a prescription and updates isPaid=true.
export const generateInvoiceForPrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.body;

        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                items: {
                    include: { medicine: true }
                }
            }
        });

        if (!prescription) throw new ApiError(404, "Prescription not found");
        if (prescription.isPaid) throw new ApiError(400, "Prescription is already paid");

        // Calculate Totals and Prepare Items
        let totalAmount = 0;
        const invoiceItemsData = [];
        
        // Find a placeholder Service ID for the InvoiceItem relation (Schema constraint)
        const dummyService = await prisma.service.findFirst();
        if(!dummyService) throw new ApiError(500, "System Error: No Service found to link Invoice Items.");

        for (const item of prescription.items) {
            const quantity = 1; // Defaulting to 1 as qty is not explicit in PrescriptionItem
            const price = Number(item.medicine.unitPrice);
            const lineTotal = quantity * price;
            totalAmount += lineTotal;

            invoiceItemsData.push({
                itemName: item.medicine.name,
                quantity: quantity,
                unitPrice: price,
                total: lineTotal,
                serviceId: dummyService.id // Satisfy relation
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    patientId: prescription.patientId,
                    visitId: prescription.visitId,
                    admissionId: prescription.admissionId,
                    totalAmount,
                    taxAmount: 0,
                    discountAmount: 0,
                    netAmount: totalAmount,
                    status: "Paid",
                    items: {
                        create: invoiceItemsData
                    }
                }
            });

            // 2. Mark Prescription as Paid
            await tx.prescription.update({
                where: { id: prescriptionId },
                data: { isPaid: true }
            });

            return invoice;
        });

        res.status(201).json(new ApiResponse(201, result, "Invoice created for Prescription"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
