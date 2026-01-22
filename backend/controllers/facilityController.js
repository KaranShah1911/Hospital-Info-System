import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a New Ward
// Context: define physical areas in the hospital (e.g. ICU, General Ward).
// Why needed? Beds must belong to a ward, and admissions are tracked by ward/bed.
export const createWard = async (req, res) => {
    try {
        const { name, departmentId, floorNumber, type, basePricePerDay } = req.body;

        // Validation
        if (!name || !departmentId || !basePricePerDay) {
            throw new ApiError(400, "Name, Department ID, and Base Price are required");
        }

        const ward = await prisma.ward.create({
            data: {
                name,
                departmentId,
                floorNumber: parseInt(floorNumber) || 0,
                type: type || "General",
                basePricePerDay
            }
        });

        res.status(201).json(new ApiResponse(201, ward, "Ward created successfully"));
    } catch (error) {
        if (error.code === 'P2002') { // Unique constraint
             return res.status(409).json(new ApiError(409, "Ward name already exists (if unique constraint matches)"));
        }
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Add Beds to a Ward (Bulk or Single)
// Context: Filling the ward with physical beds.
// Why needed? To have inventory of beds for patient admission.
export const addBeds = async (req, res) => {
    try {
        const { wardId } = req.params;
        const { count, bedNumber } = req.body;

        if (!wardId) throw new ApiError(400, "Ward ID is required");

        const ward = await prisma.ward.findUnique({ where: { id: wardId } });
        if (!ward) throw new ApiError(404, "Ward not found");

        let result;

        // Logic 1: Bulk Creation (e.g. "Add 5 beds")
        if (count && count > 0) {
            // Find current bed count to auto-increment names
            const currentBedCount = await prisma.bed.count({ where: { wardId } });
            
            const bedsData = [];
            for (let i = 1; i <= count; i++) {
                const nextNum = currentBedCount + i;
                bedsData.push({
                    wardId,
                    bedNumber: `${ward.name}-${nextNum}`, // Auto-generate name: "ICU-1"
                    status: "Available"
                });
            }

            result = await prisma.bed.createMany({
                data: bedsData
            });
            
        } else if (bedNumber) {
            // Logic 2: Single Creation with specific name
            result = await prisma.bed.create({
                data: {
                    wardId,
                    bedNumber,
                    status: "Available"
                }
            });
        } else {
            throw new ApiError(400, "Provide 'count' for bulk or 'bedNumber' for single creation");
        }

        res.status(201).json(new ApiResponse(201, result, "Beds added successfully"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};

// Get Hospital Layout (Dashboard View)
// Context: Nested view of Dept -> Ward -> Beds
// Why needed? For Nurses/Reception to see availability visually.
export const getHospitalLayout = async (req, res) => {
    try {
        // Fetch Departments with Wards and Beds nested
        const layout = await prisma.department.findMany({
            include: {
                wards: {
                    include: {
                        beds: {
                            orderBy: { bedNumber: 'asc' }
                        }
                    }
                }
            }
        });

        res.status(200).json(new ApiResponse(200, layout, "Hospital layout fetched"));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};