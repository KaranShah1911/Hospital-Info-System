"use client";

import React, { useState, useEffect } from 'react';
import {
    UserPlus, Search, ShieldCheck, CheckCircle2, AlertCircle,
    Home, Heart, IdCard, User as UserIcon, Landmark, Printer, Phone, MapPin, Calendar, UploadCloud
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { motion, AnimatePresence } from 'framer-motion';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock data (in a real app, this would be imported or fetched)
const MOCK_PATIENTS = [
    {
        uhid: 'MED1001',
        firstName: 'John',
        lastName: 'Doe',
        dob: '1985-05-15',
        gender: 'Male',
        phone: '9876543210',
        email: 'john.doe@example.com',
        city: 'New York',
        state: 'NY',
    },
];

export default function RegistrationPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageInput, setAgeInput] = useState<string>('');

    const [formData, setFormData] = useState({
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
        emergencyContactName: '',
        emergencyContactPhone: '',
        defaultPayerType: 'Self Pay',
    });

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [registeredPatient, setRegisteredPatient] = useState<any | null>(null);

    useEffect(() => {
        if (ageInput && !isNaN(parseInt(ageInput))) {
            const birthYear = new Date().getFullYear() - parseInt(ageInput);
            setFormData(prev => ({ ...prev, dob: `${birthYear}-01-01` }));
        }
    }, [ageInput]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/patients/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",   // 👈 this line
                body: JSON.stringify(formData),
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setRegisteredPatient(data);
            setMessage({
                text: `Patient Registration Successful. UHID Generated: ${data.uhid}`,
                type: 'success'
            });

        } catch (error: any) {
            setMessage({
                text: error.message || 'An error occurred during registration.',
                type: 'error'
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const resetForm = () => {
        setRegisteredPatient(null);
        setFormData({
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
            emergencyContactName: '',
            emergencyContactPhone: '',
            defaultPayerType: 'Self Pay',
        });
        setAgeInput('');
        setMessage(null);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">

            <div className="print:hidden">
                <PageHeader title="Patient Registration" description="New Patient Enrollment & MPI Creation" />
            </div>

            {/* Success View & ID Card */}
            {registeredPatient ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-center gap-6 print:hidden">
                        <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-900">Registration Successful</h2>
                            <p className="text-emerald-700 font-medium">Patient has been enrolled in the system with UHID: <span className="font-black">{registeredPatient.uhid}</span></p>
                        </div>
                        <div className="ml-auto flex gap-4">
                            <button onClick={handlePrint} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer">
                                <Printer size={20} /> Print Card
                            </button>
                            <button onClick={resetForm} className="px-8 py-4 bg-white text-emerald-900 border-2 border-emerald-100 font-bold rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer">
                                Register New
                            </button>
                        </div>
                    </div>

                    {/* Printable ID Card */}
                    <div id="patient-id-card" className="w-[500px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border print:w-full print:mx-0 print:rounded-none">
                        {/* Header */}
                        <div className="bg-indigo-600 p-6 flex items-center justify-between text-white print:bg-indigo-600 print:text-white print-color-adjust-exact">
                            <div>
                                <h3 className="text-lg font-black tracking-wider uppercase">MediFlow Hospital</h3>
                                <p className="text-xs font-medium opacity-80">Excellence in Healthcare</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-black">{registeredPatient.uhid}</h2>
                                <p className="text-[10px] uppercase tracking-widest opacity-80">UHID Number</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex gap-6">
                            {/* Photo Placeholder */}
                            <div className="w-32 h-40 bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                                <UserIcon size={48} className="text-slate-300 mb-2" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Photo</span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">
                                        {registeredPatient.firstName} {registeredPatient.lastName}
                                    </h1>
                                    <p className="text-sm font-bold text-slate-500 uppercase">
                                        {new Date().getFullYear() - new Date(registeredPatient.dob).getFullYear()} Yrs / {registeredPatient.gender}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <Phone size={14} className="text-slate-400 mt-0.5" />
                                        <p className="text-sm font-bold text-slate-700">{registeredPatient.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <MapPin size={14} className="text-slate-400 mt-0.5" />
                                        <p className="text-sm font-bold text-slate-700 leading-tight">
                                            {registeredPatient.permanentAddress || 'No Address Provided'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Calendar size={14} className="text-slate-400 mt-0.5" />
                                        <p className="text-sm font-bold text-slate-700">DOB: {new Date(registeredPatient.dob).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency: +91 999-999-9999</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generated on: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <style jsx global>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #patient-id-card, #patient-id-card * {
                                visibility: visible;
                            }
                            #patient-id-card {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                            }
                        }
                    `}</style>

                </motion.div>
            ) : (
                <div className="print:hidden">

                    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">

                        {/* 1. Basic Information */}
                        <SectionHeader icon={UserIcon} title="Demographics" iconClassName="text-indigo-600" />
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
                        </div>

                        {/* 2. Contact & Address */}
                        <SectionHeader icon={Home} title="Contact Information" iconClassName="text-emerald-600" />
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
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pincode</label>
                                <input type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                            </div>
                            <div className="lg:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Permanent Address</label>
                                <input required type="text" value={formData.permanentAddress} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none text-slate-800" />
                            </div>
                        </div>

                        {/* 3. Old Medical Records (Mock Upload) */}
                        <SectionHeader icon={Calendar} title="Previous Medical Records" iconClassName="text-orange-600" />
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                    <UploadCloud size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-700">Upload Old Medical Files</h3>
                                    <p className="text-xs text-slate-500 font-bold mt-1">Supported format: .zip (Max 50MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                                                loading: 'Uploading medical records...',
                                                success: `File "${file.name}" uploaded successfully (Mock)`,
                                                error: 'Upload failed'
                                            });
                                        }
                                    }}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-12 pt-10 border-t border-slate-100 flex gap-4">
                            <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 cursor-pointer">
                                <UserPlus size={24} /> Register Patient
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
}
