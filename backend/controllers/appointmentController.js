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
    const { date, } = req.query;

    let doctorId = null;

    if (req.user.role === 'Doctor') {
      doctorId = req.user.staffId;
    }

    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (date) {
      // Simple date filtering (assuming exact date match or needing range)
      // For simplicity: filtering by start of day to end of day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

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

// Get Full Consultation Context
// Logic: Fetches everything needed for the consultation screen
// Get Full Consultation Context
// Logic: Fetches everything needed for the consultation screen
export const getConsultationDetails = async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID directly from route
    console.log("Fetch Details for:", id);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            medicalHistory: true,
            opdVisits: {
              take: 5,
              orderBy: { visitDate: 'desc' },
              include: { clinicalNotes: true, prescriptions: true }
            },
            // Fetch Active Admission if any?
            admissions: {
              where: { status: 'Admitted' },
              take: 1,
              include: { currentBed: { include: { ward: true } } } // Removed patientVitals to avoid schema errors if DB not migrated
            }
          }
        },
        doctor: { select: { fullName: true, department: true } }
      }
    });

    if (!appointment) {
      // console.error("Appointment not found in DB");
      throw new ApiError(404, "Appointment not found");
    }

    // Find Current Visit linked to this Appointment
    const currentVisit = await prisma.opdVisit.findFirst({
        where: { appointmentId: id },
        include: {
            prescriptions: {
                include: { items: { include: { medicine: true } } }
            },
            serviceOrders: {
                include: { service: true }
            },
            clinicalNotes: true
        }
    });

    // Format for frontend
    const patient = appointment.patient;
    // const lastVital = patient.admissions[0]?.patientVitals[0]; // Commented out

    const data = {
      id: appointment.id,
      tokenNumber: appointment.tokenNumber,
      status: appointment.status,
      // Pass the visit ID for forms to use directly!
      visitId: currentVisit?.id || null, 
      patient: {
        id: patient.id,
        uhid: patient.uhid,
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A',
        gender: patient.gender,
        bloodGroup: 'O+', 
        allergies: patient.medicalHistory.filter(h => h.category === 'Allergy').map(h => h.name),
        conditions: patient.medicalHistory.filter(h => h.category !== 'Allergy').map(h => h.name),
        vitals: { bp: '120/80', pulse: 72, temp: 98.6, spo2: 98 }
      },
      currentVisit: currentVisit ? {
          prescriptions: currentVisit.prescriptions,
          serviceOrders: currentVisit.serviceOrders,
          notes: currentVisit.clinicalNotes
      } : null,
      history: patient.opdVisits.filter(v => v.id !== currentVisit?.id).map(v => ({ // Exclude current from history list if desired, or keep
        date: v.visitDate,
        diagnosis: v.clinicalNotes[0]?.content?.diagnosis || "Routine Checkup",
        doctor: "Dr. Previous" 
      }))
    };

    res.status(200).json(new ApiResponse(200, data, "Consultation details fetched"));

  } catch (error) {
    console.error("Consultation Details Error:", error);
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
};


// Handles Marking Consultation/Appointment as Completed
// Logic: Updates both Appointment and linked OpdVisit status to 'Completed'
export const completeConsultation = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({
            where: { id }
        });

        if (!appointment) throw new ApiError(404, "Appointment not found");

        await prisma.$transaction(async (tx) => {
            // 1. Update Appointment Status
            await tx.appointment.update({
                where: { id },
                data: { status: 'Completed' }
            });

            // 2. Update Linked OpdVisit (if it exists)
            // Note: In emergency or direct OPD cases, might need to find by other means, but here we expect appointmentId link
            await tx.opdVisit.updateMany({
                where: { appointmentId: id },
                data: { status: 'Completed' }
            });
        });

        res.status(200).json(new ApiResponse(200, null, "Consultation marked as completed"));

    } catch (error) {
        console.error("Complete Consultation Error:", error);
        res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
    }
};
