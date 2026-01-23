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



// Handles Recording Surgery - Track 2 Step 4
// Logic: Creates a surgery record.
export const recordSurgery = async (req, res) => {
    try {
        const { admissionId, procedureName, surgeonId, surgeryDate } = req.body;

        const surgery = await prisma.surgery.create({
            data: {
                admissionId,
                procedureName,
                surgeonId,
                status: "Completed", // Assuming recording after completion or scheduling
                surgeryDate: new Date(surgeryDate || Date.now())
            }
        });

        res.status(201).json(new ApiResponse(201, surgery, "Surgery recorded"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Handles Process Discharge - Track 2 Step 5
// Logic: Marks admission as discharged, closes bed transfer, frees the bed.
export const dischargePatient = async (req, res) => {
    try {
        const { admissionId, dischargeType, summary } = req.body;

        const result = await prisma.$transaction(async (tx) => {
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
                    data: { status: "Cleaning" } // Or Available, depending on workflow
                });
            }

            // 3. Update Admission
            const admission = await tx.admission.update({
                where: { id: admissionId },
                data: {
                    status: "Discharged",
                    dischargeDate: new Date(),
                    dischargeType: dischargeType || "Normal"
                }
            });

            // Optional: Create Discharge Summary Note if summary provided
            if (summary) {
                 // Logic to add note could go here
            }

            return admission;
        });

        res.status(200).json(new ApiResponse(200, result, "Patient discharged successfully"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
