"use client";

import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
    Activity, ClipboardList, FileText, Sparkles,
    History, AlertTriangle, Plus, Pill, TestTube,
    Stethoscope, Save, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs } from '@/components/ui/tabs-custom';
import Link from 'next/link';

export default function ConsultationPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Consultation Room"
                    description={`Patient Visit • ${new Date().toLocaleDateString()}`}
                />
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                    <Save size={18} />
                    Finish & Sign
                </button>
            </div>

            {/* Patient Header & AI Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Patient Profile Card */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-slate-800">Anjali Gupta</h2>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">OPD</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mb-6">28y / Female • UHID-2026-X892</p>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-700">
                                <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Allergies</div>
                                <div className="font-bold text-sm">Sulpha Drugs</div>
                            </div>
                            <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                                <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Blood Group</div>
                                <div className="font-bold text-sm">O+</div>
                            </div>
                            <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                                <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Last Visit</div>
                                <div className="font-bold text-sm">2 weeks ago</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-px bg-slate-100 hidden md:block"></div>

                    <div className="flex-1 space-y-4">
                        <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-slate-400">BP</div>
                                    <div className="font-bold text-slate-800">120/80</div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 font-bold">10m ago</div>
                        </div>
                        <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-slate-400">Pulse</div>
                                    <div className="font-bold text-slate-800">78 bpm</div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-slate-400">Temp</div>
                                    <div className="font-bold text-slate-800">98.4 F</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Summary Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <Sparkles size={20} className="text-yellow-300" />
                            </div>
                            <h3 className="font-black text-lg">AI Health Insight</h3>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="text-xs font-bold text-indigo-200 uppercase mb-1">Health Score</div>
                                <div className="text-3xl font-black">82/100</div>
                                <div className="w-full h-1 bg-black/20 rounded-full mt-2 overflow-hidden">
                                    <div className="w-[82%] h-full bg-green-400 rounded-full"></div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                                Patient shows consistent improvement. BP has normalized compared to last 3 visits.
                                <span className="font-bold text-white block mt-2">✨ Suggestion: Review Iron supplements dosage.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Clinical Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: History & Timeline */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl h-fit">
                        <SectionHeader icon={History} title="Visit History" />

                        <div className="mt-6 relative pl-4 border-l-2 border-slate-100 space-y-8">
                            {[
                                { id: 'VIS-001', date: '10 Jan 2024', doctor: 'Dr. Smith', diagnosis: 'Viral Fever', type: 'OPD' },
                                { id: 'VIS-002', date: '22 Dec 2023', doctor: 'Dr. Wilson', diagnosis: 'Migraine', type: 'Emergency' },
                                { id: 'VIS-003', date: '15 Nov 2023', doctor: 'Dr. Smith', diagnosis: 'General Checkup', type: 'OPD' }
                            ].map((visit, i) => (
                                <Link key={i} href={`/dashboard/doctor/history/${visit.id}`}>
                                    <div className="relative group cursor-pointer mb-6">
                                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white group-hover:bg-indigo-500 transition-colors"></div>
                                        <div className="pl-4">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{visit.date}</div>
                                            <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{visit.diagnosis}</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1">{visit.doctor} • {visit.type}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                        <SectionHeader icon={AlertTriangle} title="Risk Factors" iconClassName="text-amber-500" />
                        <div className="mt-4 flex flex-wrap gap-2">
                            {['Smoker (Occasional)', 'Family History of Diabetes', 'High Stress Job'].map((risk, i) => (
                                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-100">
                                    {risk}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Clinical Note & Orders */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8">
                        <Tabs tabs={[
                            {
                                id: 'note',
                                label: 'Clinical Note',
                                content: <ClinicalNoteForm />
                            },
                            {
                                id: 'rx',
                                label: 'Prescription (Rx)',
                                content: <PrescriptionForm />
                            },
                            {
                                id: 'labs',
                                label: 'Lab & Radiology',
                                content: <LabOrderForm />
                            }
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClinicalNoteForm() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <Stethoscope size={14} /> Chief Complaints
                </div>
                <textarea
                    className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[80px]"
                    placeholder="e.g. Headache since 2 days, Fever..."
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">Diagnosis</div>
                    <textarea
                        className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[120px]"
                        placeholder="Provisional Diagnosis..."
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">Examination Notes (O/E)</div>
                    <textarea
                        className="w-full bg-white rounded-xl border-none p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 min-h-[120px]"
                        placeholder="Chest clear, Abd soft..."
                    />
                </div>
            </div>
        </div>
    );
}

function PrescriptionForm() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <input type="text" placeholder="Medicine Name" className="flex-1 px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    <select className="px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold text-slate-600 bg-white focus:outline-none">
                        <option>1-0-1</option>
                        <option>1-1-1</option>
                        <option>1-0-0</option>
                        <option>0-0-1</option>
                        <option>SOS</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-indigo-200 text-sm font-bold text-slate-600 bg-white focus:outline-none">
                        <option>5 Days</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                        <option>15 Days</option>
                    </select>
                </div>
                <button className="ml-4 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-indigo-100 transition-colors">
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                            <Pill size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Paracetamol 650mg</h4>
                            <div className="text-xs font-medium text-slate-400 mt-0.5">1-0-1 • After Food • 3 Days</div>
                        </div>
                        <button className="text-slate-300 hover:text-red-500 transition-colors font-bold text-xs uppercase">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LabOrderForm() {
    const LAB_TESTS = [
        'Complete Blood Count (CBC)', 'Lipid Profile', 'Liver Function Test (LFT)', 'Renal Function Test (RFT)',
        'Thyroid Profile (T3, T4, TSH)', 'HbA1c', 'Blood Sugar Fasting', 'Blood Sugar PP',
        'Urine Routine & Microscopy', 'Stool Routine', 'Serum Electrolytes', 'Serum Calcium',
        'Vitamin D Total', 'Vitamin B12', 'Iron Studies', 'C-Reactive Protein (CRP)',
        'Erythrocyte Sedimentation Rate', 'Prothrombin Time (PT/INR)', 'APTT', 'D-Dimer',
        'Typhoid Widal Test', 'Dengue NS1 Antigen', 'Malaria Antigen', 'HIV 1 & 2 Antibody', 'HBsAg'
    ];

    const RADIOLOGY_TESTS = [
        'X-Ray Chest PA View', 'X-Ray Knee AP/Lat', 'X-Ray LS Spine', 'X-Ray Abdomen Erect',
        'USG Abdomen & Pelvis', 'USG KUB', 'USG Obstetric', 'USG Thyroid / Neck',
        'USG Doppler Carotid', 'USG Doppler Lower Limb', 'CT Brain Plain', 'CT Chest HRCT',
        'CT Abdomen Contrast', 'CT KUB', 'MRI Brain', 'MRI Cervical Spine',
        'MRI Lumbar Spine', 'MRI Knee Joint', 'Mammography', 'DEXA Scan (Bone Density)',
        '2D ECHO Cardiography', 'ECG (12 Lead)', 'TMT (Treadmill Test)', 'Holter Monitoring', 'PET-CT Whole Body'
    ];

    return (
        <div className="space-y-8">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <SectionHeader icon={TestTube} title="Laboratory Investigations" iconClassName="text-indigo-500" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {LAB_TESTS.map(test => (
                        <label key={test} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 leading-tight">{test}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <SectionHeader icon={Activity} title="Radiology & Imaging" iconClassName="text-rose-500" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {RADIOLOGY_TESTS.map(test => (
                        <label key={test} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-rose-300 hover:shadow-md transition-all group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300" />
                            <span className="text-xs font-bold text-slate-700 group-hover:text-rose-700 leading-tight">{test}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg h-fit">
                    <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-amber-800 text-sm">Clinical Indication / Notes</h4>
                    <textarea
                        className="w-full mt-2 bg-white rounded-xl border-amber-200 p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-200"
                        placeholder="Reason for test, specific instructions, or priority (Stat)..."
                        rows={3}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
