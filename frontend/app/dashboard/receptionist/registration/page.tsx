"use client";

import React, { useState, useEffect } from 'react';
import {
    UserPlus, Search, ShieldCheck, CheckCircle2, AlertCircle,
    Home, Heart, IdCard, User as UserIcon, Landmark
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { motion, AnimatePresence } from 'framer-motion';

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

    useEffect(() => {
        if (ageInput && !isNaN(parseInt(ageInput))) {
            const birthYear = new Date().getFullYear() - parseInt(ageInput);
            setFormData(prev => ({ ...prev, dob: `${birthYear}-01-01` }));
        }
    }, [ageInput]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({
            text: `Patient Registration Successful. UHID Generated: MED${Math.floor(Math.random() * 10000)}`,
            type: 'success'
        });
        setTimeout(() => {
            setMessage(null);
            // Reset Logic here if needed
        }, 3000);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">

            <PageHeader title="Patient Registration" description="New Patient Enrollment & MPI Creation" />

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
                </div>

                {/* Actions */}
                <div className="mt-12 pt-10 border-t border-slate-100 flex gap-4">
                    <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 cursor-pointer">
                        <UserPlus size={24} /> Register Patient
                    </button>
                </div>
            </form>

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
