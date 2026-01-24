"use client";

import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { Activity, Search, AlertCircle, Clock, Bed, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_PATIENTS = [
    { id: '1', name: 'Rajesh Kumar', age: 45, uhid: 'UHID-2024-X91', bed: 'ICU-04', diagnosis: 'Dengue Hemorrhagic Fever', status: 'Critical', admitDay: 3, color: 'bg-rose-500' },
    { id: '2', name: 'Priya Sharma', age: 32, uhid: 'UHID-2024-Y22', bed: 'Ward-A-12', diagnosis: 'Acute Appendicitis (Post-Op)', status: 'Stable', admitDay: 2, color: 'bg-emerald-500' },
    { id: '3', name: 'Amit Verma', age: 58, uhid: 'UHID-2024-Z55', bed: 'Ward-B-03', diagnosis: 'Uncontrolled Diabetes', status: 'Observation', admitDay: 5, color: 'bg-amber-500' },
    { id: '4', name: 'Sita Devi', age: 65, uhid: 'UHID-2024-A11', bed: 'ICU-02', diagnosis: 'Pneumonia', status: 'Serious', admitDay: 4, color: 'bg-orange-500' },
];

export default function DoctorIPD() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader title="In-Patient Department (IPD)" description="Monitor admitted patients and manage care plans." />
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search Patient / Bed..." className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_PATIENTS.map((p, i) => (
                    <Link key={p.id} href={`/dashboard/doctor/ipd/${p.id}`}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer group h-full flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${p.color}`}>
                                    {p.status}
                                </span>
                                <span className="text-xs font-bold text-slate-400">Day {p.admitDay}</span>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                                <p className="text-xs font-medium text-slate-500">{p.age}y / Male • {p.uhid}</p>
                            </div>

                            <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                    <Bed size={16} className="text-indigo-500" />
                                    {p.bed}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Diagnosis</div>
                                <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-relaxed">
                                    {p.diagnosis}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600">
                                <span className="text-xs font-bold">View Cockpit</span>
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
