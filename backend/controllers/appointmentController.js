import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


// Handles Booking an Appointment
// Logic: Creates an appointment record linked to a patient and doctor. 
// Assigns a token number (simplified logic here, typically needs concurrency handling).
export const bookAppointment = async (req, res) => {
  try {
    const { uhid, doctorId, departmentId, appointmentDate, type } = req.body;

    // Basic validation
    if (!uhid || !doctorId || !departmentId || !appointmentDate) {
      throw new ApiError(400, "Missing required fields");
    }

    // Find Patient by UHID (User Requirement: Receptionist uses ID Card)
    const patient = await prisma.patient.findUnique({
      where: { uhid }
    });

    if (!patient) {
      throw new ApiError(404, "Patient with this UHID not found");
    }

    // Token Logic: Count existing appointments for this doctor on this day
    const dateObj = new Date(appointmentDate);
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    const existingCount = await prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
      }
    });

    const tokenNumber = existingCount + 1;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id, // Using the resolved patient ID
        doctorId,
        departmentId,
        appointmentDate: new Date(appointmentDate),
        tokenNumber: tokenNumber, 
        status: "Scheduled",
        type: type || "New"
      }
    });

    res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};

// Handles Getting Appointments
// Logic: Fetches appointments, optionally filtered by date or doctor.
export const getAppointments = async (req, res) => {
  try {
    const { date, doctorId } = req.query;
    
    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (date) {
        // Simple date filtering (assuming exact date match or needing range)
        // For simplicity: filtering by start of day to end of day
        const dayStart = new Date(date);
        dayStart.setHours(0,0,0,0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23,59,59,999);
        
        where.appointmentDate = {
            gte: dayStart,
            lte: dayEnd
        };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
            select: { firstName: true, lastName: true, uhid: true }
        },
        doctor: {
            select: { fullName: true }
        }
      },
      orderBy: { appointmentDate: 'asc' }
    });

    res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};

// Handles Check-In (Converts Appointment to OpdVisit) - Track 1 Step 2
// Logic: Updates appointment status and creates OpdVisit
export const checkInAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
    });

    if (!appointment) throw new ApiError(404, "Appointment not found");

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
        // 1. Create OPD Visit
        const visit = await tx.opdVisit.create({
            data: {
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                appointmentId: appointment.id,
                visitType: "OPD",
                status: "Waiting",
                visitDate: new Date()
            }
        });

        // 2. Update Appointment Status
        await tx.appointment.update({
            where: { id: appointmentId },
            data: { status: "CheckedIn" }
        });
        
        return visit;
    });

    res.status(200).json(new ApiResponse(200, result, "Patient checked in successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};
