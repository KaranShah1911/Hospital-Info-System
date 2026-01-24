// ENUMS from Prisma Schema

export enum UserRole {
    Admin = 'Admin',
    Doctor = 'Doctor',
    Nurse = 'Nurse',
    Receptionist = 'Receptionist',
    Pharmacist = 'Pharmacist',
    LabTech = 'LabTech',
    RadiologyTech = 'RadiologyTech',
    OTManager = 'OT Manager'
}

export enum DepartmentType {
    Clinical = 'Clinical',
    Non_Clinical = 'Non_Clinical',
    Diagnostic = 'Diagnostic'
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export enum AppointmentStatus {
    Scheduled = 'Scheduled',
    CheckedIn = 'CheckedIn',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum AppointmentType {
    New = 'New',
    FollowUp = 'FollowUp'
}

// Interfaces based on Prisma Model

export interface Staff {
    id: string;
    role: UserRole;
    isActive: boolean;
    fullName?: string; // Optional in schema (via staffProfile usually), keeping for frontend convenience
}

export interface Department {
    id: string;
    name: string;
    code: string;
    type: DepartmentType;
}

export interface StaffProfile {
    id: string;
    userId: string;
    fullName: string;
    departmentId?: string;
    qualification?: string;
    department?: Department;
}

export interface Patient {
    id: string;
    uhid: string;
    firstName: string;
    lastName: string;
    dob: string; // DateTime in Prisma, string in frontend often easier
    gender: Gender;
    phone: string;
    email?: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    departmentId: string;
    appointmentDate: string; // DateTime
    tokenNumber: number;
    status: AppointmentStatus;
    type: AppointmentType;

    // Relations (Frontend often needs these populated)
    patient?: Patient;
    doctor?: StaffProfile;
    department?: Department;
}
