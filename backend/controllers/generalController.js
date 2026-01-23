import prisma from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getPatientCaseStudy = async (req, res) => {
    try {
        const { visitId } = req.body; // Using req.body as requested, though params/query is more RESTful for GET

        if (!visitId) {
            throw new ApiError(400, "visitId is required in the body");
        }

        // 1. Fetch the Core Visit Info (OPD/Emergency)
        // We include EVERYTHING related to this visit
        const visit = await prisma.opdVisit.findUnique({
            where: { id: visitId },
            include: {
                patient: true,
                doctor: { select: { fullName: true, department: { select: { name: true } } } },
                appointment: { select: { tokenNumber: true, appointmentDate: true, type: true } },

                // Clinical Data
                clinicalNotes: { orderBy: { createdAt: 'asc' } },

                // Orders (Lab/Radiology) + Results
                serviceOrders: {
                    include: {
                        service: true,
                        labResults: true,
                        invoiceItems: true // Billing link
                    },
                    orderBy: { orderDate: 'asc' }
                },

                // Prescriptions + Pharmacy Sales
                prescriptions: {
                    include: {
                        items: { include: { medicine: true } },
                        sales: { include: { items: true } }
                    }
                },

                // Documents
                documents: true,

                // Billing
                invoices: {
                    include: { items: true }
                },

                // ADMISSION LINK (The "Kundali" Moment)
                // If they were admitted, we follow the link to the Admission Record
                admission: {
                    include: {
                        department: { select: { name: true } },
                        admittingDoctor: { select: { fullName: true } },
                        currentBed: {
                            include: { ward: true }
                        },
                        bedTransfers: {
                            include: { bed: { include: { ward: true } } },
                            orderBy: { startDate: 'asc' }
                        },
                        surgeries: {
                            include: {
                                surgeon: { select: { fullName: true } },
                                checklists: true
                            }
                        },
                        // Recursively fetch admission clinical notes/orders if stored separately
                        clinicalNotes: true,
                        serviceOrders: { include: { service: true, labResults: true } },
                        prescriptions: { include: { items: { include: { medicine: true } } } },
                        // dischargeType: true
                    }
                }
            }
        });

        if (!visit) {
            throw new ApiError(404, "Visit not found");
        }

        // 2. Construct the Narrative Report
        // We structure this to start from Arrival -> Triage -> Consult -> Admission -> Discharge

        const kundali = {
            metadata: {
                reportGeneratedAt: new Date(),
                hospitalName: "MediFlow General Hospital"
            },
            patientProfile: {
                uhid: visit.patient.uhid,
                name: `${visit.patient.firstName} ${visit.patient.lastName}`,
                age: new Date().getFullYear() - new Date(visit.patient.dob).getFullYear(),
                gender: visit.patient.gender,
                bloodGroup: visit.patient.bloodGroup, // Note: Schema might not have this based on recent edits, but including if present
                phone: visit.patient.phone
            },
            visitJourney: {
                stage1_arrival: {
                    type: visit.visitType, // OPD / Emergency
                    date: visit.visitDate,
                    token: visit.appointment?.tokenNumber || "Emergency-WalkIn",
                    initialDoctor: visit.doctor.fullName
                },
                stage2_triage: {
                    status: visit.status,
                    triageColor: visit.triageColor,
                    vitals: visit.clinicalNotes.find(n => n.noteType === 'ProgressNote' || n.content.vitals)?.content || "Not Recorded"
                },
                stage3_consultation: {
                    notes: visit.clinicalNotes.filter(n => n.noteType === 'SOAP').map(n => ({
                        date: n.createdAt,
                        doctor: n.doctorId, // Ideally lookup name, but keeping simple
                        soap: n.content
                    })),
                    diagnosis: "Derived from Assessment in Notes" // Placeholder for complex logic
                },
                stage4_diagnostics_and_medicines: {
                    orders: visit.serviceOrders.map(o => ({
                        service: o.service.name,
                        status: o.status,
                        result: o.labResults[0]?.resultValue || "Pending"
                    })),
                    prescriptions: visit.prescriptions.map(p => ({
                        date: p.date,
                        medicines: p.items.map(i => `${i.medicine.name} (${i.dosage})`)
                    }))
                }
            }
        };

        // 3. Add IPD Data if exists
        if (visit.admission) {
            kundali.visitJourney.stage5_hospitalization = {
                status: "Admitted",
                admissionDate: visit.admission.admissionDate,
                department: visit.admission.department.name,
                bedMovement: [
                    // Trace bed history
                    ...visit.admission.bedTransfers.map(t => ({
                        ward: t.bed.ward.name,
                        bed: t.bed.bedNumber,
                        from: t.startDate,
                        to: t.endDate
                    })),
                    // Current Bed
                    visit.admission.currentBed ? {
                        ward: visit.admission.currentBed.ward.name,
                        bed: visit.admission.currentBed.bedNumber,
                        status: "Current"
                    } : "Discharged"
                ],
                surgeries: visit.admission.surgeries.map(s => ({
                    procedure: s.procedureName,
                    surgeon: s.surgeon.fullName,
                    date: s.surgeryDate,
                    status: s.status
                })),
                outcome: visit.admission.dischargeDate ? {
                    type: visit.admission.dischargeType,
                    date: visit.admission.dischargeDate
                } : "Still Admitted"
            };
        } else {
            kundali.visitJourney.stage5_hospitalization = { status: "Not Admitted (OPD/ER Only)" };
        }

        // 4. Financials
        const invoiceTotal = visit.invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
        kundali.financials = {
            totalBilled: invoiceTotal,
            invoiceCount: visit.invoices.length,
            status: visit.invoices.some(i => i.status === 'Paid') ? "Paid" : "Pending"
        };

        res.status(200).json(new ApiResponse(200, kundali, "Patient Case Study Fetched Successfully"));

    }  catch (error) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
    }
};
