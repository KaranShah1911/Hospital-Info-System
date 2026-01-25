import { UserRole, AppointmentStatus, AppointmentType, Gender } from "@/types";
import { Stethoscope, Syringe, ShieldAlert, Microscope, Calendar, User, Shield, BedDouble, UserPlus, CreditCard, Activity, FileText, ShieldCheck, Scan, LayoutDashboard, Scissors } from "lucide-react";
import React from "react";

export const ROLE_CONFIG = {
    [UserRole.Doctor]: {
        label: "Doctor",
        icon: <Stethoscope size={20} className="text-current" />,
        description: "Access clinical records and patient management."
    },
    [UserRole.Nurse]: {
        label: "Nurse",
        icon: <Syringe size={20} className="text-current" />,
        description: "Manage patient care plans and vitals."
    },
    [UserRole.Admin]: {
        label: "Admin",
        icon: <ShieldAlert size={20} className="text-current" />,
        description: "System administration and user management."
    },
    [UserRole.LabTech]: {
        label: "Lab Staff",
        icon: <Microscope size={20} className="text-current" />,
        description: "Process and upload lab results."
    },
    [UserRole.Receptionist]: {
        label: "Receptionist",
        icon: <FileText size={20} className="text-current" />,
        description: "Front desk ops: Admission, Billing, Appointments."
    },
    [UserRole.Pharmacist]: {
        label: "Pharmacy Staff",
        icon: <Stethoscope size={20} className="text-current" />,
        description: "Dispense medication and inventory."
    },
    [UserRole.RadiologyTech]: {
        label: "Radiology Staff",
        icon: <Microscope size={20} className="text-current" />,
        description: "Process and upload lab results."
    },
    [UserRole.OTManager]: {
        label: "OT Manager",
        icon: <User size={20} className="text-current" />,
        description: "Process and upload lab results."
    },
};

export const MOCK_PATIENTS = [
    {
        id: 'P001',
        uhid: 'MED1001',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1985-05-15',
        gender: Gender.Male,
        phone: '9876543210',
        email: 'john.doe@example.com',
    },
    {
        id: 'P002',
        uhid: 'MED1002',
        firstName: 'Jane',
        lastName: 'Smith',
        dob: '1990-08-22',
        gender: Gender.Female,
        phone: '8765432109',
        email: 'jane.smith@example.com',
    }
];

export const MOCK_BEDS = [
    { id: '101-A', type: 'General Ward', status: 'Available' },
    { id: '101-B', type: 'General Ward', status: 'Occupied' },
    { id: '102-A', type: 'Private Room', status: 'Available' },
    { id: 'ICC-01', type: 'ICU', status: 'Maintenance' },
    { id: 'ICC-02', type: 'ICU', status: 'Available' }
];

export const MOCK_APPOINTMENTS = [
    {
        id: 'APT-1001',
        patientId: 'P001',
        doctorId: 'DOC001',
        departmentId: 'DEPT001',
        appointmentDate: new Date().toISOString(),
        tokenNumber: 1,
        status: AppointmentStatus.Scheduled,
        type: AppointmentType.New,
        patient: MOCK_PATIENTS[0],
        doctor: { id: 'DOC001', fullName: 'Dr. Sarah Smith', userId: 'U001' },
        department: { id: 'DEPT001', name: 'Cardiology', code: 'CARD', type: 'Clinical' }
    },
    {
        id: 'APT-1002',
        patientId: 'P002',
        doctorId: 'DOC002',
        departmentId: 'DEPT002',
        appointmentDate: new Date(Date.now() + 3600000).toISOString(),
        tokenNumber: 2,
        status: AppointmentStatus.CheckedIn,
        type: AppointmentType.FollowUp,
        patient: MOCK_PATIENTS[1],
        doctor: { id: 'DOC002', fullName: 'Dr. James Wilson', userId: 'U002' },
        department: { id: 'DEPT002', name: 'Neurology', code: 'NEURO', type: 'Clinical' }
    }
];

export const SIDEBAR_LINKS = {
    [UserRole.Receptionist]: [
        { label: 'Registration', href: '/dashboard/receptionist/registration', icon: UserPlus },
        { label: 'IPD Admission', href: '/dashboard/receptionist/ipd', icon: BedDouble },
        { label: 'Appointments', href: '/dashboard/receptionist/appointments', icon: Calendar },
        { label: 'Emergency', href: '/dashboard/receptionist/emergency', icon: Shield },
        { label: 'Bed Management', href: '/dashboard/receptionist/beds', icon: Activity },
        { label: 'Billing', href: '/dashboard/receptionist/billing', icon: CreditCard },
        { label: 'Insurance & TPA', href: '/dashboard/receptionist/insurance', icon: ShieldCheck },
    ],
    [UserRole.LabTech]: [
        { label: 'Sample Tracking', href: '/dashboard/labtech/tracking', icon: Activity },
        { label: 'Result Validation', href: '/dashboard/labtech/validation', icon: ShieldCheck },
    ],
    [UserRole.RadiologyTech]: [
        { label: 'Exam Tracking', href: '/dashboard/radiologytech/tracking', icon: Activity },
        { label: 'Report Validation', href: '/dashboard/radiologytech/validation', icon: ShieldCheck },
    ],
    [UserRole.Doctor]: [
        { label: 'Overview', href: '/dashboard/doctor', icon: LayoutDashboard },
        { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
        { label: 'In-Patient (IPD)', href: '/dashboard/doctor/ipd', icon: Activity },
        { label: 'Surgery (OT)', href: '/dashboard/doctor/surgery', icon: Scissors },
        { label: 'Patient EMR', href: '/dashboard/doctor/emr', icon: FileText },
    ],

    [UserRole.OTManager]: [
        { label: 'Emergency Requests', href: '/dashboard/ot/requests', icon: ShieldAlert },
        { label: 'OT Schedule', href: '/dashboard/ot/schedule', icon: Calendar },
    ],
    [UserRole.Pharmacist]: [
        { label: 'Prescription Fulfillment', href: '/dashboard/pharmacist/fulfillment', icon: Activity },
        { label: 'Inventory Management', href: '/dashboard/pharmacist/inventory', icon: LayoutDashboard },
    ],


    [UserRole.Admin]: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: Activity },
        { label: 'Pharma Stats', href: '/dashboard/admin/pharma', icon: Activity },
        { label: 'Patient Outcomes', href: '/dashboard/admin/outcomes', icon: Activity },
        { label: 'Disease Trends', href: '/dashboard/admin/diseases', icon: Activity },

    ],
};

