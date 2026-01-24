import prisma from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Get Staff By Role
// Query: /api/staff?role=Doctor,Nurse
export const getStaffByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            throw new ApiError(400, "Role query parameter is required (e.g. ?role=Doctor)");
        }

        const rolesArray = role.split(',');

        const validUserRoles = ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'LabTech', 'OTManager'];

        const mappedRoles = rolesArray.map(r => {
            if (r === 'Surgeon' || r === 'Anaesthetist') return 'Doctor';
            if (r === 'Technician') return 'LabTech'; // Mapping Technician to LabTech for now
            return r;
        }).filter(r => validUserRoles.includes(r)); // Ensure only valid enums are passed

        const users = await prisma.user.findMany({
            where: {
                role: { in: mappedRoles },
                isActive: true
            },
            include: {
                staffProfile: {
                    include: { department: true }
                }
            }
        });

        // Format for frontend
        const staffList = users.map(u => ({
            id: u.staffProfile?.id,
            name: u.staffProfile?.fullName,
            role: u.role, // 'Doctor', 'Nurse'
            jobTitle: u.staffProfile?.qualification, // Use qualification or department as proxy for specific sub-role
            department: u.staffProfile?.department?.name,
            deptType: u.staffProfile?.department?.type
        })).filter(s => s.id); // Filter out users without profiles

        res.status(200).json(new ApiResponse(200, staffList, "Staff fetched successfully"));

    } catch (error) {
        console.error("Staff Fetch Error:", error);
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
