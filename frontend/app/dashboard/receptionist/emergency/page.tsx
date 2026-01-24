"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { AlertTriangle, Siren, Clock, Activity, HeartPulse, Stethoscope, User, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function EmergencyPage() {
    const [triageLevel, setTriageLevel] = useState('Level 1'); // RED by default
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: 'Male',
        complaint: '',
        arrivalMode: 'Ambulance'
    });
    const [loading, setLoading] = useState(false);

    const TRIAGE_LEVELS = [
        { level: 'Level 1', color: 'bg-red-600', val: 'Red', desc: 'Resuscitation (Immediate)' },
        { level: 'Level 2', color: 'bg-yellow-500', val: 'Yellow', desc: 'Urgent (15 min)' },
        { level: 'Level 3', color: 'bg-green-500', val: 'Green', desc: 'Non Urgent (60 min)' },
    ];

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.age || !formData.complaint) {
            toast.error("Please fill all required fields for Rapid Intake");
            return;
        }

        setLoading(true);
        try {
            // 1. Generate Temporary UHID/Register Patient
            // In a real emergency, we might just create a temporary patient.
            // Here we use the standard register endpoint but with minimal fields
            const dobYear = new Date().getFullYear() - parseInt(formData.age);

            // Register Patient
            const patientRes = await api.post('/patients/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                dob: `${dobYear}-01-01`,
                phone: '9999999999', // Placeholder
                address: 'Emergency Admission', // Placeholder
                // Add emergency specific flag if backend supports, or just minimal fields
            });

            const patientId = patientRes.data.data.id;

            // 2. Create Emergency Visit (with Triage)
            const selectedTriage = TRIAGE_LEVELS.find(t => t.level === triageLevel)?.val || 'Red';

            await api.post('/er/visit', {
                patientId,
                doctorId: null, // Assign later
                triageColor: selectedTriage
            });

            toast.success("Emergency Code Initiated. Patient Admitted.");
            // Reset
            setFormData({
                firstName: '',
                lastName: '',
                age: '',
                gender: 'Male',
                complaint: '',
                arrivalMode: 'Ambulance'
            });

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to initiate emergency intake");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <PageHeader title="Emergency Trauma Intake" description="Rapid Patient Registration & Triage" />
                <div className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse">
                    <Siren size={16} /> Active Emergency Protocol
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Triage Selection */}
                <div className="bg-white p-6 rounded-4xl shadow-xl border border-slate-100 h-fit">
                    <SectionHeader icon={Activity} title="Triage Assessment" iconClassName="text-rose-600" />
                    <div className="space-y-3">
                        {TRIAGE_LEVELS.map((t) => (
                            <button
                                key={t.level}
                                onClick={() => setTriageLevel(t.level)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all text-left group ${triageLevel === t.level
                                    ? `border-transparent ${t.color} text-white shadow-lg`
                                    : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-black uppercase">{t.level}</span>
                                    {triageLevel === t.level && <Activity size={16} />}
                                </div>
                                <div className={`text-xs font-bold ${triageLevel === t.level ? 'text-white/80' : 'text-slate-400'}`}>
                                    {t.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rapid Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <SectionHeader icon={HeartPulse} title="Vital Information (Quick Entry)" iconClassName="text-red-600" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Arrival Mode</label>
                            <select
                                value={formData.arrivalMode}
                                onChange={(e) => setFormData({ ...formData, arrivalMode: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800"
                            >
                                <option>Ambulance</option>
                                <option>Private Vehicle</option>
                                <option>Walk-in</option>
                                <option>Police Escort</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Age"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 bg-slate-50 outline-none font-bold text-slate-800 placeholder:text-slate-400"
                            />
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 bg-slate-50 outline-none font-bold text-slate-800"
                            >
                                <option>Male</option><option>Female</option>
                            </select>
                        </div>

                        <textarea
                            placeholder="Chief Complaint / Injury Description..."
                            value={formData.complaint}
                            onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                            className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 bg-slate-50 outline-none font-bold text-slate-800 resize-none placeholder:text-slate-400"
                        ></textarea>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            <AlertTriangle size={20} />
                            {loading ? 'Initiating Protocol...' : 'Initiate Code Red & Admit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
