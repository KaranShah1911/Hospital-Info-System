import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Handles Patient Admission - Track 2 Step 2
// Logic: Admits a patient, creating an Admission record.
export const admitPatient = async (req, res) => {
  try {
    const { patientId, admittingDoctorId, departmentId, admissionType, reasonForAdmission, visitId, bedId } = req.body;
    // bedId = Optional initial bed selection

    const result = await prisma.$transaction(async (tx) => {
        let currentBedId = null;

        // Bed Validation Logic
        if (bedId) {
            const bed = await tx.bed.findUnique({ where: { id: bedId } });
            
            if (!bed) {
                throw new ApiError(404, "Selected bed not found");
            }
            if (bed.status !== 'Available') {
                throw new ApiError(400, `Selected bed is currently ${bed.status}`);
            }

            currentBedId = bedId;

            // Mark Bed as Occupied
            await tx.bed.update({
                where: { id: bedId },
                data: { status: "Occupied" }
            });
        }

        const admission = await tx.admission.create({
            data: {
                patientId,
                admittingDoctorId,
                departmentId,
                visitId: visitId || null,
                currentBedId, // Link active bed
                admissionType: admissionType || "Emergency",
                status: "Admitted",
                admissionDate: new Date(),
                reasonForAdmission
            }
        });

        // 4. Create BedTransfer if bed allocated (Start Timer)
        if (currentBedId) {
            await tx.bedTransfer.create({
                data: {
                    admissionId: admission.id,
                    bedId: currentBedId,
                    startDate: new Date()
                }
            });
        }

        return admission;
    });

    res.status(201).json(new ApiResponse(201, result, "Patient admitted successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};
// Handles Bed Allocation/Transfer - Track 2 Step 3
// Logic: Allocates a bed to an admission and updates the bed status to Occupied.
// Uses a transaction to ensure data integrity.

export const transferBed = async (req, res) => {
    try {
        const { admissionId, bedId } = req.body;

        if (!admissionId || !bedId) {
            throw new ApiError(400, "admissionId and bedId are required");
        }

        const result = await prisma.$transaction(async (tx) => {

            // 1️⃣ Validate Admission
            const admission = await tx.admission.findUnique({
                where: { id: admissionId }
            });

            if (!admission) {
                throw new ApiError(404, "Admission record not found");
            }

            if (admission.status === "Discharged") {
                throw new ApiError(400, "Cannot transfer bed for discharged patient");
            }

            // 2️⃣ Validate Target Bed
            const targetBed = await tx.bed.findUnique({
                where: { id: bedId }
            });

            if (!targetBed) {
                throw new ApiError(404, "Target bed not found");
            }

            if (targetBed.status !== "Available") {
                throw new ApiError(400, `Target bed is ${targetBed.status}`);
            }

            // 3️⃣ Close Existing Active Bed Transfer (if any)
            const previousTransfer = await tx.bedTransfer.findFirst({
                where: {
                    admissionId,
                    endDate: null
                }
            });

            if (previousTransfer) {
                // Prevent transfer to same bed
                if (previousTransfer.bedId === bedId) {
                    throw new ApiError(400, "Patient is already in this bed");
                }

                // Close previous transfer
                await tx.bedTransfer.update({
                    where: { id: previousTransfer.id },
                    data: { endDate: new Date() }
                });

                // Free previous bed
                await tx.bed.update({
                    where: { id: previousTransfer.bedId },
                    data: { status: "Available" }
                });
            }

            // 4️⃣ Create New Bed Transfer
            const transfer = await tx.bedTransfer.create({
                data: {
                    admissionId,
                    bedId,
                    startDate: new Date()
                }
            });

            // 5️⃣ Mark New Bed as Occupied
            await tx.bed.update({
                where: { id: bedId },
                data: { status: "Occupied" }
            });

            // 6️⃣ Update Admission Current Bed
            await tx.admission.update({
                where: { id: admissionId },
                data: { currentBedId: bedId }
            });

            return transfer;
        });

        return res
            .status(200)
            .json(new ApiResponse(200, result, "Bed transferred successfully"));

    } catch (error) {
        console.error("TRANSFER BED ERROR 👉", error);

        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json({
                    success: false,
                    message: error.message
                });
        }

        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error"
            });
    }
};


export const recordSurgery = async (req, res) => {
    try {
        const { admissionId, procedureName, surgeonId, surgeryDate, status, otBedId } = req.body;

        if (!admissionId || !procedureName || !surgeonId) {
            throw new ApiError(400, "Missing required fields");
        }

        const DURATION_MS = 2 * 60 * 60 * 1000;
        const requestedStart = new Date(surgeryDate || Date.now());
        const requestedEnd = new Date(requestedStart.getTime() + DURATION_MS);

        const result = await prisma.$transaction(async (tx) => {
            const admission = await tx.admission.findUnique({ where: { id: admissionId } });
            if (!admission) throw new ApiError(404, "Admission not found");
            if (admission.status === "Discharged") {
                throw new ApiError(400, "Cannot schedule surgery for discharged patient");
            }

            const conflictingSurgeon = await tx.surgery.findFirst({
                where: {
                    surgeonId,
                    status: { in: ['Scheduled', 'InProgress'] },
                    surgeryDate: {
                        gte: new Date(requestedStart.getTime() - DURATION_MS),
                        lt: requestedEnd
                    }
                }
            });

            if (conflictingSurgeon) {
                throw new ApiError(409, "Surgeon is already booked for this time");
            }

            if (otBedId) {
                const bed = await tx.bed.findUnique({ where: { id: otBedId } });
                if (!bed) throw new ApiError(404, "Selected OT Bed not found");
                if (bed.status !== "Available") {
                    throw new ApiError(400, `OT Bed is ${bed.status}`);
                }

                await tx.bed.update({
                    where: { id: otBedId },
                    data: { status: "Occupied" }
                });
            }

            return tx.surgery.create({
                data: {
                    admissionId,
                    procedureName,
                    surgeonId,
                    otRoomNumber : otBedId,
                    status: status || "Scheduled",
                    surgeryDate: requestedStart
                }
            });
        });

        res.status(201).json(new ApiResponse(201, result, "Surgery recorded and OT Bed booked"));
    } catch (error) {
        console.error("Record Surgery Error:", error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};



// Update Surgery Status
// Logic: Updates status (e.g., Scheduled -> InProgress -> Completed)
export const updateSurgeryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Scheduled, InProgress, Completed

        const surgery = await prisma.surgery.update({
            where: { id },
            data: { status }
        });

        res.status(200).json(new ApiResponse(200, surgery, `Surgery status updated to ${status}`));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Handles Process Discharge - Track 2 Step 5
// Logic: Marks admission as discharged, closes bed transfer, frees the bed.
export const dischargePatient = async (req, res) => {
    try {
        const { admissionId, dischargeType, summary } = req.body;

        console.log("I am here at line 281");
        console.log(req.user.staffId);

         const result = await prisma.$transaction(async (tx) => {
            // 0. Fetch Admission to get Patient ID (needed for note)
            const admissionRecord = await tx.admission.findUnique({ where: { id: admissionId } });
            if (!admissionRecord) throw new ApiError(404, "Admission not found");

            // 1. Close bed transfer
            // We need to find the bed ID to free it first
            const activeTransfer = await tx.bedTransfer.findFirst({
                where: { admissionId, endDate: null }
            });

            if (activeTransfer) {
                await tx.bedTransfer.update({
                    where: { id: activeTransfer.id },
                    data: { endDate: new Date() }
                });

                // 2. Free the Bed
                await tx.bed.update({
                    where: { id: activeTransfer.bedId },
                    data: { status: "Available" } // Or Cleaning
                });
            }

            // 3. Update Admission
            const admission = await tx.admission.update({
                where: { id: admissionId },
                data: {
                    status: "Discharged",
                    dischargeDate: new Date(),
                    dischargeType: dischargeType || "Normal",
                    currentBedId: null // Clear bed reference
                }
            });
            

            // 4. Create Discharge Summary Note if summary provided
            if (summary) {
                 await tx.clinicalNote.create({
                    data: {
                        patientId: admissionRecord.patientId,
                        admissionId: admissionId,
                        doctorId: req.user.staffId, // Assumes logged-in doctor
                        noteType: "DischargeSummary",
                        content: { text: summary }, // Structured JSON
                        isFinalized: true
                    }
                 });
            }

            return admission;
        });

        res.status(200).json(new ApiResponse(200, result, "Patient discharged successfully"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// ==========================================
// SURGERY CHECKLIST CONTROLLERS
// ==========================================

// Get Checklist for a Surgery
// Logic: Fetches all checklist items for a specific surgery.
export const getSurgeryChecklist = async (req, res) => {
    try {
        const { surgeryId } = req.params;

        const checklist = await prisma.surgicalChecklist.findMany({
            where: { surgeryId },
            orderBy: { timestamp: 'asc' }
        });

        res.status(200).json(new ApiResponse(200, checklist, "Surgery checklist fetched"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Update/Add Checklist Item
// Logic: Toggles outcome or adds new checklist item entry for the surgery.
export const updateChecklistItem = async (req, res) => {
    try {
        const { surgeryId, stage, itemName, isChecked } = req.body;

        // Check if item already exists for this surgery & stage
        // Note: Schema doesn't enforce unique (surgeryId, stage, itemName), but logically we might want to update or create.
        // I will assume we create a NEW entry if it doesn't exist, or update if we find a matching one (unique constraint missing though).
        // A better approach for a checklist is usually upsert if unique, but without unique constraint I'll do findFirst.

        let item = await prisma.surgicalChecklist.findFirst({
            where: {
                surgeryId,
                stage,
                itemName
            }
        });

        if (item) {
            item = await prisma.surgicalChecklist.update({
                where: { id: item.id },
                data: {
                    isChecked,
                    checkedBy : req.user.id,
                    timestamp: new Date()
                }
            });
        } else {
            item = await prisma.surgicalChecklist.create({
                data: {
                    surgeryId,
                    stage,
                    itemName,
                    isChecked,
                    checkedBy : req.user.id,
                    timestamp: new Date()
                }
            });
        }

        res.status(200).json(new ApiResponse(200, item, "Checklist item updated"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

