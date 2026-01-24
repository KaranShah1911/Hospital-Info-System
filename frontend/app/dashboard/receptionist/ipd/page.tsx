"use client";

import React, { useState, useEffect } from 'react';
import {
    UserPlus, Search, ShieldCheck, X, CheckCircle2, AlertCircle, Save,
    Calendar, Phone, Mail, Home, Heart, Droplets, IdCard, BedDouble,
    MapPin, Landmark, Shield, User as UserIcon
} from 'lucide-react';
import { MOCK_PATIENTS, MOCK_BEDS } from '@/lib/constants';
// Define Patient type locally if not fully exported, or import partial
// Assuming types/index.ts has basic User, we need a Patient interface. 
// For now, I'll define a local interface or extend if necessary to match the Code provided.

// Quick Interface for the form
interface PatientFormData {
    uhid: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    phone: string;
    email: string;
    preferredLanguage: string;
    permanentAddress: string;
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
    idProofType: string;
    idProofNumber: string;
    abhaId: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    defaultPayerType: string;
    insuranceProvider: string;
    policyNumber: string;
    bedId: string;
    attendingDoctor: string;
}

import { motion, AnimatePresence } from 'framer-motion';

const ReceptionistIPDAdmit: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExistingPatient, setIsExistingPatient] = useState(false);
    const [ageInput, setAgeInput] = useState<string>('');

    const [formData, setFormData] = useState<PatientFormData>({
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
        attendingDoctor: ''
    });

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Age to DOB logic
    useEffect(() => {
        if (ageInput && !isNaN(parseInt(ageInput))) {
            const birthYear = new Date().getFullYear() - parseInt(ageInput);
            setFormData(prev => ({ ...prev, dob: `${birthYear}-01-01` }));
        }
    }, [ageInput]);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        const patient = MOCK_PATIENTS.find(p => p.uhid.toLowerCase() === searchQuery.toLowerCase());

        if (patient) {
            // Map mock data to form data structure
            // Since mock data might not have all fields, spread existing form data first
            setFormData(prev => ({
                ...prev,
                ...patient,
                // Ensure optional fields are handled if missing in mock
                middleName: '',
                maritalStatus: 'Single',
                preferredLanguage: 'English',
                permanentAddress: '',
                currentAddress: '',
                pincode: '',
                abhaId: '',
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelation: '',
                bedId: '',
                attendingDoctor: '',
            }));
            if (patient.dob) {
                const birthYear = new Date(patient.dob).getFullYear();
                setAgeInput((new Date().getFullYear() - birthYear).toString());
            }
            setIsExistingPatient(true);
            setMessage({ text: 'Patient details retrieved for IPD intake.', type: 'success' });
        } else {
            setMessage({ text: 'No record found. Starting new IPD registration.', type: 'error' });
            setFormData(prev => ({ ...prev, uhid: searchQuery }));
            setIsExistingPatient(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({
            text: `IPD Admission successful for ${formData.firstName}. Bed ${formData.bedId} allocated.`,
            type: 'success'
        });
        // Reset form after 2 seconds
        setTimeout(() => {
            setFormData({
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
                attendingDoctor: ''
            });
            setSearchQuery('');
            setAgeInput('');
            setMessage(null);
        }, 3000);
    };

    const availableBeds = MOCK_BEDS.filter(b => b.status === 'Available');

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
                            placeholder="Enter UHID to fetch existing patient data (Try 'MED1001')..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all text-slate-800"
                        />
                    </div>
                    <button onClick={handleSearch} className="px-10 py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-700 transition-all cursor-pointer">Fetch & Populate</button>
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

                {/* 1. Basic Information */}
                <SectionHeader icon={UserIcon} title="Primary Identity & Socio-Demographics" color="text-indigo-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                        <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Middle Name</label>
                        <input type="text" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                        <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</label>
                            <input type="number" value={ageInput} onChange={e => setAgeInput(e.target.value)} className="w-full px-4 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800" />
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
                        <input required type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marital Status</label>
                        <select value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nationality</label>
                        <input type="text" value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preferred Language</label>
                        <input type="text" value={formData.preferredLanguage} onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                </div>

                {/* 2. Contact & Address */}
                <SectionHeader icon={Home} title="Contact & Residential Logistics" color="text-emerald-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Address</label>
                        <input type="text" value={formData.currentAddress} onChange={e => setFormData({ ...formData, currentAddress: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City</label>
                        <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">State</label>
                        <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pincode</label>
                        <input type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Permanent Address</label>
                        <input type="text" value={formData.permanentAddress} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                </div>

                {/* 3. Statutory Identifiers */}
                <SectionHeader icon={IdCard} title="Statutory Identifiers & ABHA" color="text-blue-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Proof Type</label>
                        <select value={formData.idProofType} onChange={e => setFormData({ ...formData, idProofType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Aadhar</option><option>PAN</option><option>Passport</option><option>Voter ID</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Number</label>
                        <input required type="text" value={formData.idProofNumber} onChange={e => setFormData({ ...formData, idProofNumber: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ABHA ID (Health ID)</label>
                        <input type="text" value={formData.abhaId} onChange={e => setFormData({ ...formData, abhaId: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" placeholder="14-digit number" />
                    </div>
                </div>

                {/* 4. Emergency Contact */}
                <SectionHeader icon={Heart} title="Emergency Notification Details" color="text-rose-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Name</label>
                        <input required type="text" value={formData.emergencyContactName} onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone</label>
                        <input required type="tel" value={formData.emergencyContactPhone} onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Relation</label>
                        <input type="text" value={formData.emergencyContactRelation} onChange={e => setFormData({ ...formData, emergencyContactRelation: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                    </div>
                </div>

                {/* 5. Insurance & Payer */}
                <SectionHeader icon={Landmark} title="Payer & Insurance Information" color="text-amber-600" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payer Type</label>
                        <select value={formData.defaultPayerType} onChange={e => setFormData({ ...formData, defaultPayerType: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option>Self Pay</option><option>Insurance</option><option>Corporate</option><option>Govt Scheme</option>
                        </select>
                    </div>
                    {formData.defaultPayerType === 'Insurance' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Insurance Provider</label>
                                <input type="text" value={formData.insuranceProvider} onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Policy Number</label>
                                <input type="text" value={formData.policyNumber} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                            </div>
                        </>
                    )}
                </div>

                {/* 6. Admission Assignment */}
                <SectionHeader icon={BedDouble} title="Admission & Bed Assignment" color="text-purple-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Available Bed</label>
                        <select required value={formData.bedId} onChange={e => setFormData({ ...formData, bedId: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option value="">Choose Bed Location</option>
                            {availableBeds.map(b => (
                                <option key={b.id} value={b.id}>{b.id} ({b.type})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attending Doctor</label>
                        <select required value={formData.attendingDoctor} onChange={e => setFormData({ ...formData, attendingDoctor: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800">
                            <option value="">Assign Physician</option>
                            <option>Dr. Sarah Smith</option>
                            <option>Dr. James Wilson</option>
                        </select>
                    </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 flex gap-4">
                    <button type="submit" className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-3xl text-lg shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer">
                        <ShieldCheck size={24} /> Complete IPD Admission
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
