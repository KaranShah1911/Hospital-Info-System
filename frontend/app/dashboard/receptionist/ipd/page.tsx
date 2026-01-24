"use client";

import React, { useState, useEffect } from 'react';
import {
    UserPlus, Search, ShieldCheck, X, CheckCircle2, AlertCircle, Save,
    Calendar, Phone, Mail, Home, Heart, Droplets, IdCard, BedDouble,
    MapPin, Landmark, Shield, User as UserIcon
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Patient Interface
interface Patient {
    id: string; // Add internal ID
    uhid: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    gender: string;
    maritalStatus?: string;
    nationality?: string;
    phone: string;
    email?: string;
    preferredLanguage?: string;
    permanentAddress?: string;
    currentAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    idProofType?: string;
    idProofNumber?: string;
    abhaId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    defaultPayerType?: string;
    insuranceProvider?: string;
    policyNumber?: string;
}

interface Bed {
    id: string;
    bedNumber: string;
    width: string;
    status: string;
    ward?: { name: string; type: string };
}

interface Doctor {
    id: string; // User ID
    role: string;
    staffProfile?: {
        id: string;
        fullName: string;
        departmentId: string;
        qualification?: string;
    }
}

// Form Data Interface
interface AdmissionFormData extends Partial<Patient> {
    bedId: string;
    attendingDoctor: string; // This will store the doctor's USER ID
    reasonForAdmission: string;
    admissionType: string;
    departmentId: string; // derived from doctor
}

const ReceptionistIPDAdmit: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExistingPatient, setIsExistingPatient] = useState(false);
    const [ageInput, setAgeInput] = useState<string>('');
    const [patientId, setPatientId] = useState<string | null>(null);

    // Dropdown Data
    const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    // Loading State
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<AdmissionFormData>({
        uhid: '',
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        maritalStatus: 'Single',
        nationality: 'Indian',
        phone: '',
        email: '',
        preferredLanguage: 'English',
        permanentAddress: '',
        currentAddress: '',
        city: '',
        state: '',
        pincode: '',
        idProofType: 'Aadhar',
        idProofNumber: '',
        abhaId: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        defaultPayerType: 'Self Pay',
        insuranceProvider: '',
        policyNumber: '',
        bedId: '',
        attendingDoctor: '',
        reasonForAdmission: '',
        admissionType: 'Emergency',
        departmentId: ''
    });

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [bedsRes, docsRes] = await Promise.all([
                    api.get('/facility/beds/available'),

                    
                    api.get('/master/users/doctors')
                ]);
                setAvailableBeds(bedsRes.data.data || []);
                setDoctors(docsRes.data || []);
            } catch (err) {
                console.error("Failed to load resources", err);
                toast.error("Failed to load available beds or doctors");
            }
        };
        fetchResources();
    }, []);

    // Age to DOB logic
    useEffect(() => {
        if (ageInput && !isNaN(parseInt(ageInput))) {
            const birthYear = new Date().getFullYear() - parseInt(ageInput);
            setFormData(prev => ({ ...prev, dob: `${birthYear}-01-01` }));
        }
    }, [ageInput]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const res = await api.get(`/patients/search?uhid=${searchQuery}`);
            const patient = res.data;

            if (patient) {
                setPatientId(patient.id);
                setFormData(prev => ({
                    ...prev,
                    ...patient,
                    // Preserve admission specific fields that might be reset if we just spread patient
                    bedId: prev.bedId,
                    attendingDoctor: prev.attendingDoctor,
                    reasonForAdmission: prev.reasonForAdmission,
                    admissionType: prev.admissionType
                }));

                if (patient.dob) {
                    const birthYear = new Date(patient.dob).getFullYear();
                    setAgeInput((new Date().getFullYear() - birthYear).toString());
                }
                setIsExistingPatient(true);
                setMessage({ text: 'Patient details retrieved.', type: 'success' });
            }
        } catch (err: any) {
            setMessage({ text: 'No record found with this UHID.', type: 'error' });
            setIsExistingPatient(false);
            setPatientId(null);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!patientId && !isExistingPatient) {
            setMessage({ text: 'Please search and select an existing patient first.', type: 'error' });
            return;
        }

        // Find department from selected doctor
        const selectedDoc = doctors.find(d => d.id === formData.attendingDoctor);
        const departmentId = selectedDoc?.staffProfile?.departmentId;

        if (!departmentId) {
            setMessage({ text: 'Selected doctor does not belong to a valid department.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                patientId: patientId,
                admittingDoctorId: formData.attendingDoctor, // Using user ID
                departmentId: departmentId,
                bedId: formData.bedId,
                admissionType: formData.admissionType,
                reasonForAdmission: formData.reasonForAdmission || "Observation"
            };

            await api.post('/ipd', payload);

            setMessage({
                text: `IPD Admission successful for ${formData.firstName}.`,
                type: 'success'
            });

            setTimeout(() => {
                // Determine redirect or reset
                // For now reset
                // resetForm(); // Need to implement full reset or reload
                window.location.reload();
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setMessage({ text: err.response?.data?.message || 'Admission failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, color }: { icon: any, title: string, color: string }) => (
        <h3 className={`text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6 mt-10 first:mt-0`}>
            <Icon size={16} className={color} /> {title}
        </h3>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* UHID Search Bar */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Patient Index (MPI) Lookup</label>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter UHID to fetch existing patient data..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all text-slate-800"
                        />
                    </div>
                    <button onClick={handleSearch} disabled={loading} className="px-10 py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50">
                        {loading ? 'Fetching...' : 'Fetch & Populate'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                {isExistingPatient && (
                    <div className="absolute top-8 right-8 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center gap-2 animate-bounce">
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Profile Synced</span>
                    </div>
                )}

                <div className="mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">IPD Admission Registration</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed statutory and clinical intake</p>
                </div>

                {/* 1. Basic Information (Read Only if fetched) */}
                <SectionHeader icon={UserIcon} title="Primary Identity & Socio-Demographics" color="text-indigo-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                        <input readOnly={isExistingPatient} type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Middle Name</label>
                        <input readOnly={isExistingPatient} type="text" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                        <input readOnly={isExistingPatient} type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</label>
                            <input readOnly={isExistingPatient} type="number" value={ageInput} onChange={e => setAgeInput(e.target.value)} className="w-full px-4 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gender</label>
                            <select disabled={isExistingPatient} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date of Birth</label>
                        <input readOnly={isExistingPatient} type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    {/* ... Other fields omitted for brevity but should map similarly if needed. Assuming focus is on Admission details now. */}
                </div>

                {/* 6. Admission Assignment */}
                <SectionHeader icon={BedDouble} title="Admission & Bed Assignment" color="text-purple-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admission Type</label>
                        <select value={formData.admissionType} onChange={e => setFormData({ ...formData, admissionType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Emergency</option>
                            <option>Elective</option>
                            <option>Transfer</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Available Bed</label>
                        <select required value={formData.bedId} onChange={e => setFormData({ ...formData, bedId: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option value="">Choose Bed Location</option>
                            {availableBeds.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.bedNumber} ({b.ward?.name || 'Ward'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attending Doctor</label>
                        <select required value={formData.attendingDoctor} onChange={e => setFormData({ ...formData, attendingDoctor: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option value="">Assign Physician</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.staffProfile?.fullName || 'Unknown Doctor'} ({d.staffProfile?.qualification})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason for Admission</label>
                        <textarea value={formData.reasonForAdmission} onChange={e => setFormData({ ...formData, reasonForAdmission: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 min-h-[100px]" placeholder="Clinical notes, diagnosis, or reason..." />
                    </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 flex gap-4">
                    <button type="submit" disabled={loading} className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-3xl text-lg shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                        <ShieldCheck size={24} /> {loading ? 'Processing Admission...' : 'Complete IPD Admission'}
                    </button>
                    <button type="button" onClick={() => window.location.reload()} className="px-10 py-5 border-2 border-slate-200 text-slate-500 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs cursor-pointer">Reset Intake</button>
                </div>
            </form>

            {/* Success Success Overlay */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`fixed bottom-12 right-12 z-[100] px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 ${message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-bold">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReceptionistIPDAdmit;
