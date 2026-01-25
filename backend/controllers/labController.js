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
        const { category } = req.query;

        // Statuses relevant for Lab Worklist
        const filterCriteria = {
            status: { in: ['Ordered', 'SampleCollected'] }
        };

        
        if (category) {
            filterCriteria.service = { category: category };
        }

        console.log("category", category)

        const orders = await prisma.serviceOrder.findMany({
            where: filterCriteria,
            include: {
                patient: {
                    select: { firstName: true, lastName: true, uhid: true, gender: true, dob: true }
                },
                doctor: { select: { fullName: true } },
                service: { select: { name: true, category: true } },
                labResults: { orderBy: { resultDate: 'desc' }, take: 1 } // Get latest result if any (re-test case)
            },
            orderBy: { orderDate: 'asc' }
        });

        res.status(200).json(new ApiResponse(200, orders, "Pending orders fetched"));
    } catch (error) {
        console.error("Lab Worklist Error:", error);
        res.status(500).json(new ApiError(500, error.message));
    }
};

export const submitLabResult = async (req, res) => {
    try {
        const { testName, serviceOrderId, resultValue, serviceId, referenceRange, unit, remarks } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Result
            // Note: Schema has `resultValue`, `testName`, `serviceOrderId`. 
            // It also has `referenceRange` and `unit` (I saw nullable in schema).
            // `technicianId` is user.id.
            
            const labResult = await tx.labResult.create({
                data: {
                    serviceOrderId,
                    testName,
                    resultValue: remarks ? `${resultValue} (Note: ${remarks})` : resultValue,
                    referenceRange: referenceRange || null,
                    unit: unit || null,
                    technicianId: req.user?.userId || null 
                }
            });

            // 2. Update Order Status
            await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: { status: 'ResultAvailable' }
            });

            return labResult;
        });

        res.status(201).json(new ApiResponse(201, result, "Result submitted successfully"));
    } catch (error) {
        console.error("Lab Submit Error:", error);
        res.status(500).json(new ApiError(500, error.message));
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Ordered', 'SampleCollected', 'ResultAvailable', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json(new ApiError(400, "Invalid status"));
        }

        const updatedOrder = await prisma.serviceOrder.update({
            where: { id: orderId },
            data: { status },
            include: { service: { select: { name: true } } }
        });

        res.status(200).json(new ApiResponse(200, updatedOrder, `Order updated to ${status}`));
    } catch (error) {
        res.status(500).json(new ApiError(500, error.message));
    }
};
