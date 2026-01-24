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
        let patients = [];

        if (uhid) {
            // Partial match for Autocomplete
            patients = await prisma.patient.findMany({
                where: { 
                    uhid: { contains: uhid, mode: 'insensitive' } // or startsWith
                },
                take: 10,
                orderBy: { uhid: 'asc' },
                include: {
                     opdVisits: { take: 1, orderBy: { visitDate: 'desc' } }
                }
            });
        }
        else if (phone) {
            // Phone exact match (usually unique)
            const patient = await prisma.patient.findFirst({
                where: { phone },
                include: {
                    opdVisits: { take: 1, orderBy: { visitDate: 'desc' } }
                }
            });
            if (patient) patients.push(patient);
        }
        else {
            return res.status(400).json({ error: "Provide uhid or phone" });
        }

        if (patients.length === 0) return res.status(404).json({ message: "No patients found" });
        
        // Return list for autocomplete, or single object if strict check needed?
        // Frontend expects list now? Let's return list always for search?
        // Wait, existing code might expect object if exact match.
        // Let's standardise: always return array, frontend adapts, 
        // OR: detect if it's a "search list" request.
        // For backwards compatibility with single result pages (if any), 
        // I will return JSON structure: { results: [...] } or just [...]
        
        res.json(patients); 
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
