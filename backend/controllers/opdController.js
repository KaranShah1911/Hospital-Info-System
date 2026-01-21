import prisma from '../config/db.js';

export const checkIn = async (req, res) => {
    try {
        const { patientId, doctorId, visitType } = req.body;
        // visitType: 'OPD', 'Emergency', 'IPD_Checkin'

        const visit = await prisma.opdVisit.create({
            data: {
                patientId,
                doctorId,
                visitType,
                status: 'Waiting', // Default
                visitDate: new Date(), // Arrival Time
            }
        });

        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
