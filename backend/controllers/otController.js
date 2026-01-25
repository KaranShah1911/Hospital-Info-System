import prisma from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getOTRooms = async (req, res) => {
    try {
        const rooms = await prisma.bed.findMany({
            where: {
                ward: {
                    type: {
                        equals: 'OT',
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                ward: true
            },
            orderBy: {
                bedNumber: 'asc'
            }
        });

        res.status(200).json(new ApiResponse(200, rooms, "OT Rooms fetched successfully"));
    } catch (error) {
        console.error("Get OT Rooms Error:", error);
        res.status(500).json(new ApiError(500, "Failed to fetch OT rooms"));
    }
};

export const getSurgeries = async (req, res) => {
    try {
        const { date, doctorId } = req.query;

        const where = {};
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            where.surgeryDate = {
                gte: start,
                lte: end
            };
        }

        // If doctor is requesting, maybe filter?
        // But requirements say "all surgery scheduled". 
        // We can add optional filter if needed later.
        if (doctorId) {
            where.surgeonId = doctorId;
        }

        const surgeries = await prisma.surgery.findMany({
            where,
            include: {
                admission: {
                    include: {
                        patient: true
                    }
                },
                surgeon: true,
                teamMembers: {
                    include: {
                        staff: true
                    }
                }
            },
            orderBy: {
                surgeryDate: 'asc'
            }
        });

        res.status(200).json(new ApiResponse(200, surgeries, "Surgeries fetched successfully"));
    } catch (error) {
        console.error("Get Surgeries Error:", error);
        res.status(500).json(new ApiError(500, "Failed to fetch surgeries"));
    }
};

export const getSurgeryById = async (req, res) => {
    try {
        const { id } = req.params;
        const surgery = await prisma.surgery.findUnique({
            where: { id },
            include: {
                admission: {
                    include: {
                        patient: true,
                        // Include Vitals for Pre-Op check
                        patientVitals: {
                            orderBy: { recordedAt: 'desc' },
                            take: 1
                        }
                    }
                },
                surgeon: true,
                teamMembers: {
                    include: {
                        staff: true
                    }
                },
                checklists: true // Include checklists status
            }
        });

        if (!surgery) {
            throw new ApiError(404, "Surgery not found");
        }

        res.status(200).json(new ApiResponse(200, surgery, "Surgery details fetched"));
    } catch (error) {
        console.error("Get Surgery Data Error:", error);
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

export const updateSurgeryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateData = { status };
        // endTime not in schema yet
        // if (status === 'Completed') {
        //     updateData.endTime = new Date();
        // }

        const surgery = await prisma.surgery.update({
            where: { id },
            data: updateData
        });

        res.status(200).json(new ApiResponse(200, surgery, "Surgery status updated"));
    } catch (error) {
        console.error("Update Surgery Status Error:", error);
        res.status(500).json(new ApiError(500, "Failed to update surgery status"));
    }
};
