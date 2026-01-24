import prisma from '../config/db.js';

const generateUHID = async () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `P-${year}-${random}`;
};

export const registerPatient = async (req, res) => {
    try {
        const {
            firstName, middleName, lastName,
            dob, gender, maritalStatus, nationality,
            phone, email, preferredLanguage,
            permanentAddress, currentAddress, city, state, pincode,
            idProofType, idProofNumber, abhaId,
            emergencyContactName, emergencyContactPhone
        } = req.body;

        // 1. Check if Phone Already Exists
        // Note: Phone is not @unique in schema, so we use findFirst. 
        // If the user wants it STRICTLY unique, we should ideally enforce it in Prisma, 
        // but for now we enforce it in logic.
        const existingPatient = await prisma.patient.findFirst({
            where: { phone }
        });

        if (existingPatient) {
            return res.status(400).json({ error: "Patient with this phone number already exists." });
        }

        // 2. Generate Unique UHID
        let uhid = await generateUHID();
        while (await prisma.patient.findUnique({ where: { uhid } })) {
            uhid = await generateUHID();
        }

        // 3. Create Patient
        const patient = await prisma.patient.create({
            data: {
                uhid,
                firstName,
                middleName,
                lastName,
                dob: new Date(dob),
                gender,
                maritalStatus,
                nationality,
                phone,
                email,
                preferredLanguage,
                permanentAddress,
                currentAddress,
                city,
                state,
                pincode,
                idProofType,
                idProofNumber,
                abhaId,
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

export const searchPatientSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Provide query string" });
        }

        const patients = await prisma.patient.findMany({
            where: {
                OR: [
                    { uhid: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } },
                    { phone: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10,
            select: {
                id: true,
                uhid: true,
                firstName: true,
                lastName: true,
                phone: true,
                gender: true,
                dob: true
            }
        });

        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
