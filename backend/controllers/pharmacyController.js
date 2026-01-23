import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createPharmacySale = async (req, res) => {
    try {
        const { patientId, prescriptionId, items } = req.body;
        // items: [{ medicineId, quantity }]

        if (!items || items.length === 0) return res.status(400).json({ error: "No items" });

        const sale = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const saleItemsData = [];

            // 1. Process Items (Check Stock & Calculate Total)
            for (const item of items) {
                const medicine = await tx.medicine.findUnique({ where: { id: item.medicineId } });

                if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
                if (medicine.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`);
                }

                // Decrement Stock
                await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: { stockQuantity: medicine.stockQuantity - item.quantity }
                });

                const totalPrice = Number(medicine.unitPrice) * item.quantity;
                totalAmount += totalPrice;

                saleItemsData.push({
                    medicineId: item.medicineId,
                    quantity: item.quantity,
                    unitPrice: medicine.unitPrice,
                    totalPrice: totalPrice
                });
            }

            // 2. Create Sale Record
            const pharmacySale = await tx.pharmacySale.create({
                data: {
                    patientId,
                    prescriptionId,
                    totalAmount,
                    items: {
                        create: saleItemsData
                    }
                }
            });

            return pharmacySale;
        });

        res.status(201).json(sale);
    } catch (error) {
        console.error("Pharmacy Sale Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getInventory = async (req, res) => {
    try {
        const medicines = await prisma.medicine.findMany();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Niche hai Ritesh ke routes : 

// Handles Creating Prescription - Track 1 Step 3 (Doctor Side)
// Logic: Creates a prescription with nested prescription items.
export const createPrescription = async (req, res) => {
  try {
    const { patientId, visitId, items } = req.body;
    // items = [{ medicineId, dosage, frequency, duration, instruction }, ...]

    const prescription = await prisma.prescription.create({
        data: {
            patientId,
            doctorId: req.user.userId,
            visitId,
            items: {
                create: items.map(item => ({
                    medicineId: item.medicineId,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    instruction: item.instruction
                }))
            }
        }
    });

    res.status(201).json(new ApiResponse(201, prescription, "Prescription created"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};

// Handles Pharmacy Sale & Inventory Deduction - Track 1 Step 2 (Pharm Side)
// Logic: Processes a sale, creates sale items, and atomically decrements stock.
// CRITICAL: Uses transaction to prevent overselling.
// export const processPharmacySale = async (req, res) => {
//     try {
//         const { patientId, prescriptionId, items } = req.body;
//         // items = [{ medicineId, quantity, unitPrice }]
        
//         // Calculate total amount
//         const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

//         const saleResult = await prisma.$transaction(async (tx) => {
//             // 1. Create Sale Record
//             const sale = await tx.pharmacySale.create({
//                 data: {
//                     patientId,
//                     prescriptionId,
//                     totalAmount,
//                     items: {
//                         create: items.map(item => ({
//                             medicineId: item.medicineId,
//                             quantity: item.quantity,
//                             unitPrice: item.unitPrice,
//                             totalPrice: item.quantity * item.unitPrice
//                         }))
//                     }
//                 }
//             });

//             // 2. Deduct Inventory for each item
//             for (const item of items) {
//                 const medicine = await tx.medicine.findUnique({
//                     where: { id: item.medicineId }
//                 });

//                 if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
//                 if (medicine.stockQuantity < item.quantity) {
//                     throw new Error(`Insufficient stock for medicine: ${medicine.name}`);
//                 }

//                 await tx.medicine.update({
//                     where: { id: item.medicineId },
//                     data: {
//                         stockQuantity: {
//                             decrement: item.quantity
//                         }
//                     }
//                 });
//             }

//             return sale;
//         });

//         res.status(200).json(new ApiResponse(200, saleResult, "Pharmacy sale processed and inventory updated"));
//     } catch (error) {
//         res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
//     }
// };

// List Medicines (Master Data helper)
export const getMedicines = async (req, res) => {
    try {
        const { search } = req.query;
        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        
        const medicines = await prisma.medicine.findMany({ where, take: 50 });
        res.status(200).json(new ApiResponse(200, medicines, "Medicines list"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
}

export const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;

        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: {
                patient: {
                    select: { firstName: true, lastName: true, uhid: true }
                },
                doctor: {
                    select: { fullName: true }
                },
                items: {
                    include: {
                        medicine: {
                            select: { name: true, unitPrice: true, stockQuantity: true }
                        }
                    }
                }
            }
        });

        if (!prescription) {
            throw new ApiError(404, "Prescription not found");
        }

        res.status(200).json(new ApiResponse(200, prescription, "Prescription details fetched"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
