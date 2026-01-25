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


import { useSearchParams } from 'next/navigation';

const ReceptionistIPDAdmit: React.FC = () => {
    const searchParams = useSearchParams();

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

    // Handle URL param population
    useEffect(() => {
        const uhid = searchParams.get('uhid');
        const fetchPatientFromUrl = async () => {
            if (uhid) {
                setLoading(true);
                try {
                    // Reuse the search logic 
                    const res = await api.get(`/patients/search?uhid=${uhid}`);
                    // Search returns array for partial matches, check if we have results
                    const results = Array.isArray(res.data) ? res.data : [res.data];
                    const patient = results.find((p: any) => p.uhid === uhid) || results[0];

                    if (patient) {
                        setPatientId(patient.id);
                        setFormData(prev => ({
                            ...prev,
                            ...patient,
                            // Preserve admission specific fields
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
                        setMessage({ text: 'Patient details retrieved from link.', type: 'success' });

                        // Clear message after delay
                        setTimeout(() => setMessage(null), 3000);
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Failed to fetch patient details");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPatientFromUrl();
    }, [searchParams]);


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
                reasonForAdmission: formData.reasonForAdmission || "Observation",

                // Spread all other form data for updates
                ...formData
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

    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleSuggestionClick = (p: any) => {
        setSearchQuery(p.uhid);
        setSuggestions([]);
        setPatientId(p.id);
        setFormData(prev => ({
            ...prev,
            ...p,
            bedId: prev.bedId,
            attendingDoctor: prev.attendingDoctor,
            reasonForAdmission: prev.reasonForAdmission,
            admissionType: prev.admissionType
        }));

        if (p.dob) {
            const birthYear = new Date(p.dob).getFullYear();
            setAgeInput((new Date().getFullYear() - birthYear).toString());
        }
        setIsExistingPatient(true);
        setMessage({ text: 'Patient details retrieved.', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            {/* UHID Search Bar */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 overflow-visible relative z-50">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Patient Index (MPI) Lookup</label>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (val.length > 2) {
                                    api.get(`/patients/suggestions?query=${val}`).then(res => {
                                        setSuggestions(res.data || []);
                                    }).catch(() => setSuggestions([]));
                                } else {
                                    setSuggestions([]);
                                }
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Type Name, UHID or Phone to search..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all text-slate-800"
                        />
                        {suggestions.length > 0 && searchQuery.length > 2 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-80 overflow-auto z-[100]">
                                {suggestions.map((p: any) => (
                                    <div key={p.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer flex justify-between items-center transition-colors"
                                        onClick={() => handleSuggestionClick(p)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black">
                                                {p.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-base">{p.firstName} {p.lastName}</p>
                                                <p className="text-xs text-slate-500 font-bold">{p.uhid} • {p.phone}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg uppercase tracking-wider">SELECT</span>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <input readOnly={isExistingPatient} type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800 ${isExistingPatient ? 'bg-slate-100' : 'bg-white'}`} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Middle Name</label>
                        <input type="text" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                        <input readOnly={isExistingPatient} type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800 ${isExistingPatient ? 'bg-slate-100' : 'bg-white'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</label>
                            <input type="number" value={ageInput} onChange={e => setAgeInput(e.target.value)} className="w-full px-4 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800 bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gender</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date of Birth</label>
                        <input type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marital Status</label>
                        <select value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                        </select>
                    </div>
                </div>

                {/* 2. Contact & Address */}
                <SectionHeader icon={Home} title="Contact Information" color="text-emerald-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Address</label>
                        <input type="text" value={formData.currentAddress} onChange={e => setFormData({ ...formData, currentAddress: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City</label>
                        <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pincode</label>
                        <input type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Permanent Address</label>
                        <input type="text" value={formData.permanentAddress} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                </div>

                {/* 3. Identity & Insurance */}
                <SectionHeader icon={IdCard} title="Identity & Payer" color="text-purple-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ABHA ID (Health ID)</label>
                        <input type="text" value={formData.abhaId || ''} onChange={e => setFormData({ ...formData, abhaId: e.target.value })} placeholder="xx-xxxx-xxxx-xxxx" className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Proof Type</label>
                        <select value={formData.idProofType} onChange={e => setFormData({ ...formData, idProofType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Aadhar</option><option>PAN</option><option>Driving License</option><option>Passport</option>
                        </select>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Number</label>
                        <input type="text" value={formData.idProofNumber || ''} onChange={e => setFormData({ ...formData, idProofNumber: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payer Type</label>
                        <select value={formData.defaultPayerType} onChange={e => setFormData({ ...formData, defaultPayerType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Self Pay</option><option>Insurance</option><option>Govt Scheme</option><option>Corporate</option>
                        </select>
                    </div>
                    {formData.defaultPayerType !== 'Self Pay' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurance Provider</label>
                                <input type="text" value={formData.insuranceProvider || ''} onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Policy Number</label>
                                <input type="text" value={formData.policyNumber || ''} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800 bg-white" />
                            </div>
                        </>
                    )}
                </div>

                {/* 6. Admission Assignment */}
                <SectionHeader icon={BedDouble} title="Admission & Bed Assignment" color="text-purple-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admission Type</label>
                        <select value={formData.admissionType} onChange={e => setFormData({ ...formData, admissionType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Emergency</option>
                            <option value="Planned">Elective (Planned)</option>
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
