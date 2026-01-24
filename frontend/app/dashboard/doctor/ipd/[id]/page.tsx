"use client";

import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Activity, ClipboardList, Utensils, FileText, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tabs } from '@/components/ui/tabs-custom';
import { motion } from 'framer-motion';

// Mock Data for Visuals
const PATIENT_DATA = {
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    uhid: 'UHID-2024-X91',
    bed: 'ICU-04',
    diagnosis: 'Dengue Hemorrhagic Fever',
    admissionDate: '2024-01-20',
    allergies: ['Penicillin'],
    diet: 'Liquid Diet'
};

export default function PatientCockpit({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/doctor/ipd" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <PageHeader title="Patient Cockpit" description={`Managing care for ${PATIENT_DATA.name}`} />
            </div>

            {/* Patient Header Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={120} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-black text-slate-900">{PATIENT_DATA.name}</h1>
                            <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-wider">Critical</span>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                            <span>{PATIENT_DATA.age}y / {PATIENT_DATA.gender}</span>
                            <span>•</span>
                            <span>{PATIENT_DATA.uhid}</span>
                            <span>•</span>
                            <span className="text-slate-900 font-bold">Bed: {PATIENT_DATA.bed}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</div>
                            <div className="font-bold text-slate-800">{PATIENT_DATA.diagnosis}</div>
                        </div>
                        <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Allergies</div>
                            <div className="font-bold">{PATIENT_DATA.allergies.join(", ")}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs tabs={[
                {
                    id: 'overview',
                    label: 'Overview & Vitals',
                    content: <OverviewTab />
                },
                {
                    id: 'orders',
                    label: 'Orders (CPOE)',
                    content: <OrdersTab />
                },
                {
                    id: 'notes',
                    label: 'Progress Notes',
                    content: <NotesTab />
                },
                {
                    id: 'discharge',
                    label: 'Discharge Summary',
                    content: <DischargeTab />
                }
            ]} />
        </div>
    );
}

function OverviewTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Live Vitals Mockchart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Activity} title="Vitals Trends (Last 24h)" />
                    <div className="h-64 flex items-end justify-between gap-2 mt-6 px-4">
                        {[40, 65, 55, 80, 70, 90, 85, 60, 75, 50, 65, 70].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-xl relative group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-colors"
                                ></motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 px-2">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>23:59</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={Utensils} title="Current Diet" iconClassName="text-emerald-500" />
                    <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="text-2xl font-black text-emerald-700">Liquid Diet</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Started: Today, 08:00 AM</p>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 font-medium">
                        Patient is NBM (Nil by Mouth) post 10 PM for scheduled ultrasound tomorrow.
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                    <SectionHeader icon={ClipboardList} title="Active Nursing Tasks" />
                    <div className="mt-4 space-y-3">
                        {['Check BP every 2 hrs', 'Insulin 10U before lunch', 'SpO2 Monitoring'].map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                <span className="text-sm font-bold text-slate-700">{task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function OrdersTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={Utensils} title="Dietary & Nursing Orders" />

                <form className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Diet Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Normal', 'Soft', 'Liquid', 'Diabetic', 'Renal', 'NBM'].map(d => (
                                <label key={d} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                                    <input type="radio" name="diet" className="w-4 h-4 text-indigo-600 accent-indigo-600" />
                                    <span className="text-sm font-bold text-slate-700">{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Instructions</label>
                        <textarea
                            className="w-full h-32 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium"
                            placeholder="e.g. Low salt, fluid restriction 1.5L..."
                        ></textarea>
                    </div>

                    <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        Update Dietary Orders
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl opacity-60 pointer-events-none">
                {/* Placeholder for CPOE */}
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <ClipboardList size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-black text-slate-400">Medication & Labs</h3>
                    <p className="text-sm text-slate-400">Integrated CPOE module comming soon.</p>
                </div>
            </div>
        </div>
    )
}

function NotesTab() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={FileText} title="Add Daily Progress Note (SOAP)" />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest">Subjective</label>
                        <textarea className="w-full h-32 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 outline-none text-sm font-medium" placeholder="Patient's complaints..."></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-rose-500 uppercase tracking-widest">Objective</label>
                        <textarea className="w-full h-32 p-4 rounded-2xl border border-rose-100 bg-rose-50/30 outline-none text-sm font-medium" placeholder="O/E findings..."></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-amber-500 uppercase tracking-widest">Assessment</label>
                        <textarea className="w-full h-32 p-4 rounded-2xl border border-amber-100 bg-amber-50/30 outline-none text-sm font-medium" placeholder="Diagnosis/Status..."></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-emerald-500 uppercase tracking-widest">Plan</label>
                        <textarea className="w-full h-32 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 outline-none text-sm font-medium" placeholder="Treatment plan..."></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                        Save Note
                    </button>
                </div>
            </div>

            <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                {[1, 2].map(i => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-slate-200 ring-4 ring-white"></div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-800">Daily Rounding Note</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Dr. Smith • Yesterday 09:30 AM</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Day {4 - i}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Patient stable. Temperature spike resolved. Chest clear on auscultation. Continue current antibiotics. Plan for discharge in 2 days if afebrile.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DischargeTab() {
    return (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Ready for Discharge?</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Generate the final discharge summary and clearance checklist. This action will notify billing and nursing.
            </p>

            <Link href="/dashboard/doctor/ipd">
                <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all">
                    Initiate Discharge Process
                </button>
            </Link>
        </div>
    )
}
