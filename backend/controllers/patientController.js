import prisma from '../config/db.js';

const generateUHID = async () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `P-${year}-${random}`;
};

export const registerPatient = async (req, res) => {
    try {
        const { firstName, lastName, dob, gender, bloodGroup, phone, address, emergencyContactName, emergencyContactPhone } = req.body;

        // Generate Unique UHID
        let uhid = await generateUHID();
        // Simple collision check (could be robustified)
        while (await prisma.patient.findUnique({ where: { uhid } })) {
            uhid = await generateUHID();
        }

        const patient = await prisma.patient.create({
            data: {
                uhid,
                firstName,
                lastName,
                dob: new Date(dob),
                gender,
                bloodGroup,
                phone,
                address,
                emergencyContactName,
                emergencyContactPhone
            }
        });

        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchPatient = async (req, res) => {
    try {
        const { uhid, phone } = req.query;
        let where = {};
        if (uhid) where.uhid = uhid;
        else if (phone) where.phone = phone;
        else return res.status(400).json({ error: "Provide uhid or phone" });

        const patient = await prisma.patient.findFirst({
            where,
            include: {
                opdVisits: { take: 5, orderBy: { visitDate: 'desc' } }
            }
        });

        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
