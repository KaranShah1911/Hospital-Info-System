import prisma from '../config/db.js';

export const saveNote = async (req, res) => {
    try {
        const { patientId, visitId, noteType, content } = req.body;
        // content is JSON

        const note = await prisma.clinicalNote.create({
            data: {
                patientId,
                visitId,
                doctorId: req.user.staffId,
                noteType, // SOAP
                content
            }
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPatientHistory = async (req, res) => {
    try {
        const { id } = req.params; // Patient ID

        const history = await prisma.patient.findUnique({
            where: { id },
            include: {
                opdVisits: {
                    orderBy: { visitDate: 'desc' },
                    include: { clinicalNotes: true }
                },
                medicalHistory: true, // Allergies, Conditions
                prescriptions: { include: { items: { include: { medicine: true } } } },
                serviceOrders: {
                    where: { status: 'Completed' },
                    include: { service: true, labResults: true }
                }
            }
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
