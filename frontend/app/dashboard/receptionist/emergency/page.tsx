"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { AlertTriangle, Siren, Clock, Activity, HeartPulse, Stethoscope, User, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';
import { socket } from '@/lib/socket';

export default function EmergencyPage() {
    const [triageLevel, setTriageLevel] = useState('Level 3');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        arrivalMode: 'Ambulance',
        firstName: '',
        lastName: '',
        age: '',
        gender: 'Male',
        notes: '',
        isMLC: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };


    // ... inside component ...

    const handleEmergencyRequest = () => {
        setIsSubmitting(true);

        const patientName = (formData.firstName || formData.lastName)
            ? `${formData.firstName} ${formData.lastName}`
            : 'Unknown Trauma Patient';

        const newRequest = {
            id: 'EMG-' + Math.floor(Math.random() * 1000),
            patientName: patientName.trim(),
            severity: triageLevel === 'Level 1' ? 'Critical (Code Red)' : triageLevel === 'Level 2' ? 'Severe (Code Blue)' : 'Urgent (Code Orange)',
            location: 'ER - Trauma Bay',
            notes: `[${triageLevel}] ${formData.arrivalMode} Arrival. ${formData.notes}`,
            isMLC: formData.isMLC,
            timestamp: new Date().toISOString()
        };

        // Emit Socket Event
        socket.emit("EMERGENCY_INITIATED", newRequest);

        // Also save to localStorage for persistence/demo purposes if needed, 
        // but rely on socket for real-time
        const existing = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
        localStorage.setItem('emergencyRequests', JSON.stringify([newRequest, ...existing]));

        setTimeout(() => {
            setIsSubmitting(false);
            setRequestSent(true);
        }, 500);
    };

    const TRIAGE_LEVELS = [
        { level: 'Level 1', color: 'bg-red-600', val: 'Red', desc: 'Resuscitation (Immediate)' },
        { level: 'Level 2', color: 'bg-yellow-500', val: 'Yellow', desc: 'Urgent (15 min)' },
        { level: 'Level 3', color: 'bg-green-500', val: 'Green', desc: 'Non Urgent (60 min)' },
    ];

    if (requestSent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle size={48} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Code Red Initiated</h2>
                    <p className="text-slate-500 font-medium mt-2 text-lg">
                        OT Manager and Emergency Response Team have been notified.<br />
                        Proceed to <strong>Trauma Bay</strong> for patient handover.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setRequestSent(false);
                        setFormData({
                            arrivalMode: 'Ambulance',
                            firstName: '',
                            lastName: '',
                            age: '',
                            gender: 'Male',
                            notes: '',
                            isMLC: false
                        });
                        setTriageLevel('Level 3');
                    }}
                    className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    Raise Another Request
                </button>
            </div>
        );
    }

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
                                name="arrivalMode"
                                value={formData.arrivalMode}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold outline-none bg-white text-slate-800"
                            >
                                <option>Ambulance</option>
                                <option>Private Vehicle</option>
                                <option>Walk-in</option>
                                <option>Police Escort</option>
                            </select>
                        </div>

                        <div className="flex items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <input
                                type="checkbox"
                                name="isMLC"
                                checked={formData.isMLC}
                                onChange={handleChange}
                                id="mlc-check"
                                className="w-5 h-5 accent-orange-600 mr-3"
                            />
                            <label htmlFor="mlc-check" className="font-bold text-orange-800 text-sm cursor-pointer select-none">
                                Mark as Medico-Legal Case (MLC)
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 bg-slate-50 outline-none font-bold text-slate-800 placeholder:text-slate-400"
                            />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-50 bg-slate-50 outline-none font-bold text-slate-800"
                            >
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Chief Complaint / Injury Description..."
                            className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-red-50 focus:border-red-500 bg-slate-50 outline-none font-bold text-slate-800 resize-none placeholder:text-slate-400"
                        ></textarea>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <button
                            onClick={handleEmergencyRequest}
                            disabled={isSubmitting}
                            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <Activity className="animate-spin" /> DISPATCHING ALERT...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={20} /> Initiate Code Red & Admit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
