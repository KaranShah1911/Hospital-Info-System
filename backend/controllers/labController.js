import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// karan ke routes
// export const getLabWorklist = async (req, res) => {
//     try {
//         const worklist = await prisma.serviceOrder.findMany({
//             where: {
//                 orderType: 'Lab',
//                 status: 'Ordered'
//             },
//             include: {
//                 service: true,
//                 patient: { select: { firstName: true, lastName: true, uhid: true } },
//                 doctor: { select: { fullName: true } }
//             }
//         });
//         res.json(worklist);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get Pending Lab Orders (With Filter Support)
export const getLabWorklist = async (req, res) => {
    try {
        // 1. Extract serviceId from Query Params (URL?serviceId=xyz)
        const { serviceId } = req.query;

        // 2. Build the filter object dynamically
        const filterCriteria = {
            status: {
                in: ['Ordered', 'SampleCollected']
            }
        };

        // 3. If a specific Service ID is requested, add it to the filter
        if (serviceId) {
            filterCriteria.serviceId = serviceId;
        }

        const orders = await prisma.serviceOrder.findMany({
            where: filterCriteria, // <--- Use the dynamic filter here
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        uhid: true,
                        gender: true,
                        dob: true
                    }
                },
                doctor: {
                    select: { fullName: true }
                },
                service: {
                    select: { name: true, code: true }
                }
            },
        });

        res.status(200).json(new ApiResponse(200, orders, "Pending lab orders fetched"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

export const submitLabResult = async (req, res) => {
    try {
        const { testName, serviceOrderId, resultValue, serviceId } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Result
            const labResult = await tx.labResult.create({
                data: {
                    serviceOrderId,
                    resultValue,
                    technicianId: req.user.userId,
                    testName: testName
                }
            });

            // 2. Update Order Status
            const order = await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: { status: 'ResultAvailable' },
                include: { service: true, visit: true } // Need price and visitId
            });
            
            // as per darshit , ye last mai hoga
            // // 3. Billing Trigger
            // if (order.visitId) {
            //     // Find or Create Draft Invoice
            //     let invoice = await tx.invoice.findFirst({
            //         where: {
            //             visitId: order.visitId,
            //             status: 'Draft'
            //         }
            //     });

            //     if (!invoice) {
            //         invoice = await tx.invoice.create({
            //             data: {
            //                 patientId: order.patientId,
            //                 visitId: order.visitId,
            //                 status: 'Draft',
            //                 totalAmount: 0,
            //                 taxAmount: 0,
            //                 discountAmount: 0,
            //                 netAmount: 0
            //             }
            //         });
            //     }

            //     // Add Line Item
            //     await tx.invoiceItem.create({
            //         data: {
            //             invoiceId: invoice.id,
            //             serviceId: order.serviceId,
            //             serviceOrderId: order.id,
            //             itemName: order.service.name,
            //             quantity: 1,
            //             unitPrice: order.service.basePrice,
            //             total: order.service.basePrice
            //         }
            //     });

            //     // Update Invoice Totals
            //     // note: simpler to just increment, but for correctness we should sum? 
            //     // For now, simple increment logic:
            //     const newTotal = Number(invoice.totalAmount) + Number(order.service.basePrice);
            //     await tx.invoice.update({
            //         where: { id: invoice.id },
            //         data: {
            //             totalAmount: newTotal,
            //             netAmount: newTotal // neglecting tax for now
            //         }
            //     });
            // }

            return labResult;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Lab Submit Error:", error);
        res.status(500).json({ error: error.message });
    }
};
