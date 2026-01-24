"use client";

import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
    Calendar, User, FileText, Activity, TestTube,
    Image as ImageIcon, Download, Eye, File, Stethoscope,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Mock Data based on Schema
const VISIT_DATA = {
    id: 'VIS-20231222-001',
    date: '22 Dec 2023',
    time: '14:30',
    type: 'Emergency',
    doctor: 'Dr. James Wilson (Neurology)',
    diagnosis: 'Acute Migraine',
    vitals: {
        bp: '140/90',
        pulse: '98',
        temp: '98.6 F',
        spo2: '99%'
    },
    notes: {
        subjective: "Patient presented with severe throbbing headache on right side, sensitive to light. Nausea present.",
        objective: "Alert, oriented. PERRLA. No neck stiffness. BP elevated due to pain.",
        assessment: "Acute Migraine vs Tension Headache.",
        plan: "Administered IV fluids + Analgesics. Observation for 2 hours."
    }
};

const LAB_RESULTS = [
    {
        id: 'LR-001',
        testName: 'Complete Blood Count (CBC)',
        date: '22 Dec 2023 - 15:00',
        status: 'Completed',
        values: [
            { param: 'Hemoglobin', value: '13.5 g/dL', range: '12-15' },
            { param: 'WBC', value: '8,500 /cmm', range: '4000-11000' },
            { param: 'Platelets', value: '2.5 Lakhs', range: '1.5-4.5' }
        ],
        technician: 'Raj Test (Lab Tech)'
    },
    {
        id: 'LR-002',
        testName: 'Serum Electrolytes',
        date: '22 Dec 2023 - 15:15',
        status: 'Completed',
        values: [
            { param: 'Sodium', value: '138 mEq/L', range: '135-145' },
            { param: 'Potassium', value: '4.2 mEq/L', range: '3.5-5.0' }
        ],
        technician: 'Raj Test (Lab Tech)'
    }
];

const RADIOLOGY_REPORTS = [
    {
        id: 'RR-001',
        testName: 'CT Brain Plain',
        date: '22 Dec 2023 - 15:45',
        status: 'Normal',
        reportUrl: '#',
        images: ['/mock-scan-1.jpg', '/mock-scan-2.jpg'],
        radiologist: 'Dr. Radhika (Radiologist)',
        finding: "No acute intracranial hemorrhage, mass effect, or midline shift. Ventricles are normal in size."
    }
];

const DOCUMENTS = [
    { id: 'DOC-1', name: 'Consent Form - Emergency', type: 'PDF', date: '22 Dec 2023' },
    { id: 'DOC-2', name: 'Referral Letter', type: 'Image', date: '22 Dec 2023' }
];

export default function PastVisitPage({ params }: { params: { visitId: string } }) {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/doctor/appointments/view-history`} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <PageHeader
                        title="Visit Details"
                        description={`Reference: ${VISIT_DATA.id} • ${VISIT_DATA.date || '2023'}`}
                    />
                </div>
            </div>

            {/* 1. Visit Snapshot */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Visit Date</div>
                                <div className="text-xl font-bold text-slate-900">{VISIT_DATA.date} <span className="text-slate-400 text-sm">at {VISIT_DATA.time}</span></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
                                <User size={24} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Attending Doctor</div>
                                <div className="text-lg font-bold text-slate-900">{VISIT_DATA.doctor}</div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-rose-50 rounded-3xl border border-rose-100 min-w-[200px]">
                        <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">Final Diagnosis</div>
                        <div className="text-xl font-black text-rose-700 leading-tight">
                            {VISIT_DATA.diagnosis}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/50 rounded-lg text-xs font-bold text-rose-600 border border-rose-200">
                                {VISIT_DATA.type}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vitals Strip */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
                    {Object.entries(VISIT_DATA.vitals).map(([key, value]) => (
                        <div key={key} className="p-3 bg-slate-50 rounded-xl text-center">
                            <div className="text-[10px] uppercase font-black text-slate-400 mb-1">{key}</div>
                            <div className="text-lg font-black text-slate-700">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Clinical Notes (SOAP) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <SectionHeader icon={Stethoscope} title="Clinical Summary (SOAP)" />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                            <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Subjective (S)</div>
                            <p className="text-sm font-medium text-slate-700">{VISIT_DATA.notes.subjective}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                            <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Assessment (A)</div>
                            <p className="text-sm font-medium text-slate-700">{VISIT_DATA.notes.assessment}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                            <div className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Objective (O)</div>
                            <p className="text-sm font-medium text-slate-700">{VISIT_DATA.notes.objective}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                            <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Plan (P)</div>
                            <p className="text-sm font-medium text-slate-700">{VISIT_DATA.notes.plan}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 3. Lab Results */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <SectionHeader icon={TestTube} title="Lab Results" />
                    <div className="mt-6 space-y-6">
                        {LAB_RESULTS.map((res) => (
                            <div key={res.id} className="border border-slate-100 rounded-3xl overflow-hidden">
                                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{res.testName}</h4>
                                        <p className="text-xs text-slate-400 font-bold">{res.date}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">
                                        {res.status}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    {res.values.map((val, i) => (
                                        <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                                            <span className="text-slate-500 font-medium">{val.param}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-800">{val.value}</span>
                                                <span className="text-xs text-slate-300 ml-2">({val.range})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-6 py-3 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Verified by: {res.technician}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Radiology & Docs */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                        <SectionHeader icon={ImageIcon} title="Radiology Reports" />
                        <div className="mt-6 space-y-4">
                            {RADIOLOGY_REPORTS.map((rad) => (
                                <div key={rad.id} className="p-4 border border-slate-100 rounded-3xl hover:border-indigo-100 transition-colors">
                                    <div className="flex justify-between mb-3">
                                        <div className="font-bold text-slate-800">{rad.testName}</div>
                                        <div className="text-xs font-bold text-slate-400">{rad.date}</div>
                                    </div>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-3 leading-relaxed">
                                        "{rad.finding}"
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                                            <Eye size={14} /> View Images
                                        </button>
                                        <button className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                            <FileText size={14} /> Read Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                        <SectionHeader icon={File} title="Documents" />
                        <div className="mt-6 space-y-3">
                            {DOCUMENTS.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <File size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-700">{doc.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{doc.type} • {doc.date}</div>
                                        </div>
                                    </div>
                                    <div className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                        <Download size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
