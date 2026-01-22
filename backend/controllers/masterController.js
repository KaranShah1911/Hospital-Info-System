import prisma from '../config/db.js';

export const createDepartment = async (req, res) => {
    try {
        const { name, code, type, headDoctorId } = req.body;
        const department = await prisma.department.create({
            data: { name, code, type, headDoctorId },
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: { headDoctor: true }
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, category, departmentId, basePrice, code } = req.body;
        const service = await prisma.service.create({
            data: { name, category, departmentId, basePrice, code },
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getServices = async (req, res) => {
    try {
        const { category } = req.query;
        const where = category ? { category } : {};
        const services = await prisma.service.findMany({
            where,
            include: { department: true }
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createMedicine = async (req, res) => {
    try {
        // Basic medicine creation for inventory setup
        const { name, genericName, batchNumber, expiryDate, stockQuantity, reorderLevel, unitPrice } = req.body;
        const medicine = await prisma.medicine.create({
            data: {
                name,
                genericName,
                batchNumber,
                expiryDate: new Date(expiryDate),
                stockQuantity: parseInt(stockQuantity),
                reorderLevel: parseInt(reorderLevel),
                unitPrice: parseFloat(unitPrice)
            }
        });
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMedicines = async (req, res) => {
    try {
        const medicines = await prisma.medicine.findMany();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
