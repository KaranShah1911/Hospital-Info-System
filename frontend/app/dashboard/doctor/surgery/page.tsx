"use client";

import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { Calendar, Clock, Activity, Play, CheckCircle, AlertTriangle, Search } from 'lucide-react';

const SURGERIES = [
    {
        id: 'SURG-001',
        patient: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        uhid: 'UHID-2024-X91',
        procedure: 'Laparoscopic Appendectomy',
        ot: 'OT-1 (General)',
        time: '09:00 AM',
        status: 'In Progress',
        priority: 'Urgent',
        team: 'Dr. Sharma (Anaesthetist)'
    },
    {
        id: 'SURG-002',
        patient: 'Sita Devi',
        age: 65,
        gender: 'Female',
        uhid: 'UHID-2024-A11',
        procedure: 'Total Knee Replacement (Right)',
        ot: 'OT-3 (Ortho)',
        time: '11:00 AM',
        status: 'Scheduled',
        priority: 'Elective',
        team: 'Dr. Patel (Ortho)'
    },
    {
        id: 'SURG-003',
        patient: 'Vikram Singh',
        age: 28,
        gender: 'Male',
        uhid: 'UHID-2024-B12',
        procedure: 'ACL Reconstruction',
        ot: 'OT-2 (Ortho)',
        time: '02:00 PM',
        status: 'Scheduled',
        priority: 'Elective',
        team: 'Dr. Patel (Ortho)'
    },
    {
        id: 'SURG-004',
        patient: 'Anjali Gupta',
        age: 34,
        gender: 'Female',
        uhid: 'UHID-2024-C33',
        procedure: 'C-Section',
        ot: 'OT-4 (Maternity)',
        time: '04:00 PM',
        status: 'On Hold',
        priority: 'Emergency',
        team: 'Dr. Meera (Gynae)'
    }
];

export default function SurgeryDashboard() {
    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="Operation Theater Schedule" description="Manage today's surgical procedures." />

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search Patient / Procedure..." className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-72" />
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-800">4</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Surgeries</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Play size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-800">1</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-800">2</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-800">1</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Hold</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {SURGERIES.map((surg) => (
                    <div key={surg.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-6 items-center group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
                        {/* Time & Status Column */}
                        <div className="flex lg:flex-col items-center gap-4 lg:gap-2 min-w-[120px] lg:border-r border-slate-100 lg:pr-6">
                            <div className="flex flex-col items-center text-center">
                                <span className="text-xl font-black text-slate-800">{surg.time.split(' ')[0]}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">{surg.time.split(' ')[1]}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${surg.status === 'In Progress' ? 'bg-emerald-100 text-emerald-600 animate-pulse' :
                                    surg.status === 'On Hold' ? 'bg-rose-100 text-rose-600' :
                                        'bg-indigo-100 text-indigo-600'
                                }`}>
                                {surg.status}
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 w-full text-center lg:text-left">
                            <h3 className="text-lg font-black text-slate-800 mb-1">{surg.procedure}</h3>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-500 mb-3">
                                <span>{surg.patient} ({surg.age}y/{surg.gender})</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{surg.uhid}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-indigo-600 font-bold">{surg.ot}</span>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                    <Activity size={12} className="text-slate-400" />
                                    {surg.team}
                                </span>
                                {surg.priority === 'Urgent' || surg.priority === 'Emergency' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 rounded-lg text-xs font-bold text-rose-600">
                                        Priority: {surg.priority}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-bold text-amber-600">
                                        Type: {surg.priority}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 min-w-[200px] justify-end">
                            {surg.status === 'In Progress' ? (
                                <Link href={`/dashboard/doctor/surgery/${surg.id}`}>
                                    <button className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                                        <Activity size={18} className="animate-spin" />
                                        Resume
                                    </button>
                                </Link>
                            ) : surg.status === 'Scheduled' ? (
                                <Link href={`/dashboard/doctor/surgery/${surg.id}`}>
                                    <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                                        <Play size={18} />
                                        Start Procedure
                                    </button>
                                </Link>
                            ) : (
                                <button className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                    <AlertTriangle size={18} />
                                    On Hold
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
