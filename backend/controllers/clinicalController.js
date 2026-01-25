import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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

export const saveVitals = async (req, res) => {
    try {
        const { patientId, visitId, admissionId, temperature, pulse, systolicBP, diastolicBP, respRate, spO2, painScore, notes } = req.body;

        if (!patientId) {
            return res.status(400).json(new ApiError(400, "Patient ID is required"));
        }

        // Store Vitals as a formatted Clinical Note (Type: ProgressNote)
        // Since Schema changes are not allowed, we use the JSON content field.
        const vitalsContent = {
            category: "Vitals",
            data: {
                temperature: temperature || null,
                pulse: pulse ? parseInt(pulse) : null,
                bp: (systolicBP && diastolicBP) ? `${systolicBP}/${diastolicBP}` : null,
                respRate: respRate ? parseInt(respRate) : null,
                spO2: spO2 ? parseInt(spO2) : null,
                painScore: painScore ? parseInt(painScore) : null,
                notes: notes || ""
            }
        };

        const note = await prisma.clinicalNote.create({
            data: {
                patientId,
                visitId: visitId || null,
                admissionId: admissionId || null,
                doctorId: req.user.staffId, // Use logged-in doctor/user ID
                noteType: 'ProgressNote', 
                content: vitalsContent
            }
        });

        res.status(201).json(new ApiResponse(201, note, "Vitals recorded via Clinical Note"));
    } catch (error) {
        console.error("Save Vitals Error:", error);
        res.status(500).json(new ApiError(500, error.message));
    }
};
