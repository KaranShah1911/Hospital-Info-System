import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const triagePatient = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { triageColor, vitals } = req.body;
        // vitals could be saved in a ClinicalNote or just here if we had a field. 
        // Schema has ClinicalNote, but not 'vitals' column on OpdVisit.
        // I will save vitals as a ClinicalNote of type 'SOAP' (Object part) or just assume the frontend handles it elsewhere.
        // Actually, the prompt says "Nurse updates OpdVisit with triageColor".

        const updatedVisit = await prisma.opdVisit.update({
            where: { id: visitId },
            data: {
                triageColor,
                status: 'Triaged'
            }
        });

        // Optionally save vitals as a note
        if (vitals) {
            await prisma.clinicalNote.create({
                data: {
                    patientId: updatedVisit.patientId,
                    visitId: updatedVisit.id,
                    doctorId: req.user.staffId || updatedVisit.doctorId, // Nurse logged in?
                    noteType: 'ProgressNote',
                    content: { vitals }
                }
            });
        }

        res.json(updatedVisit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLiveDashboard = async (req, res) => {
    try {
        // Fetch active ER visits
        const visits = await prisma.opdVisit.findMany({
            where: {
                visitType: 'Emergency',
                status: {
                    in: ['Waiting', 'Triaged', 'InConsultation']
                }
            },
            include: {
                patient: { select: { firstName: true, lastName: true, uhid: true, gender: true, dob: true } },
                doctor: { select: { fullName: true } }
            }
        });

        const now = new Date();

        const dashboardData = visits.map(v => {
            const waitTimeMs = now - new Date(v.visitDate);
            const waitTimeMinutes = Math.floor(waitTimeMs / 60000);
            return {
                ...v,
                waitTimeMinutes,
                age: new Date().getFullYear() - new Date(v.patient.dob).getFullYear(),
            };
        });

        // Priority Sort: Red > Yellow > Green > Null
        const severityMap = { 'Red': 4, 'Yellow': 3, 'Green': 2, 'Black': 1, null: 0 };

        dashboardData.sort((a, b) => {
            const severityA = severityMap[a.triageColor] || 0;
            const severityB = severityMap[b.triageColor] || 0;
            if (severityA !== severityB) return severityB - severityA; // Higher severity first
            return b.waitTimeMinutes - a.waitTimeMinutes; // Longest wait first if same severity
        });

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ritu ke routes : 
// Handles Initial Emergency Visit (Triage) - Track 2 Step 1
// Logic: Creates a visit directly without a prior appointment for emergencies.
export const createEmergencyVisit = async (req, res) => {
    try {
        const { patientId, doctorId, triageColor } = req.body;

        const visit = await prisma.opdVisit.create({
            data: {
                patientId,
                doctorId,
                appointmentId: null, // No booking
                visitType: "Emergency",
                triageColor: triageColor || "Red",
                status: "Triaged",
                visitDate: new Date()
            }
        });

        res.status(201).json(new ApiResponse(201, visit, "Emergency visit created"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Handles Saving Clinical Notes (Diagnosis/Plan) - Track 1 Step 3
// Logic: Records the doctor's findings in a structured format (SOAP).
// export const createClinicalNote = async (req, res) => {
//   try {
//     const { patientId, visitId, doctorId, noteType, content } = req.body;

//     const note = await prisma.clinicalNote.create({
//         data: {
//             patientId,
//             visitId,
//             doctorId,
//             noteType: noteType || "SOAP",
//             content, // JSON content
//             isFinalized: true
//         }
//     });

//     res.status(201).json(new ApiResponse(201, note, "Clinical note saved"));
//   } catch (error) {
//     res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
//   }
// };

export const createClinicalNote = async (req, res) => {
    try {
        const { uhid, visitId, doctorId, noteType, content } = req.body;

        // Find Patient by UHID
        const patient = await prisma.patient.findUnique({
            where: { uhid }
        });

        if (!patient) {
            throw new ApiError(404, "Patient with this UHID not found");
        }

        const note = await prisma.clinicalNote.create({
            data: {
                patientId: patient.id,
                visitId,
                doctorId, // Keeping plain doctorId from body for now as auth middleware is pending
                noteType: noteType || "SOAP",
                content, // JSON content
                isFinalized: true
            }
        });

        res.status(201).json(new ApiResponse(201, note, "Clinical note saved"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Handles Ordering Services (Lab/Radiology) - Track 1 Step 3
// Logic: Creates a service order for a patient.
export const createServiceOrder = async (req, res) => {
    try {
        const { patientId, visitId, admissionId, serviceId, doctorId, orderType, priority } = req.body;

        const order = await prisma.serviceOrder.create({
            data: {
                patientId,
                visitId, // Optional
                admissionId, // Optional
                doctorId,
                serviceId,
                orderType,
                priority: priority || "Routine",
                status: "Ordered"
            }
        });

        res.status(201).json(new ApiResponse(201, order, "Service ordered successfully"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};


// Avoided temporary
// Get Waiting List for Doctor
export const getWaitingPatients = async (req, res) => {
    try {
        const { doctorId } = req.query;
        if (!doctorId) throw new ApiError(400, "Doctor ID required");

        const visits = await prisma.opdVisit.findMany({
            where: {
                doctorId,
                status: "Waiting",
                visitDate: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today
                }
            },
            include: {
                patient: { select: { firstName: true, lastName: true, uhid: true, gender: true, dob: true } }
            }
        });

        res.status(200).json(new ApiResponse(200, visits, "Waiting list fetched"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
