import prisma from '../config/db.js';

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
