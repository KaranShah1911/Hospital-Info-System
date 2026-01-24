"use client";

import Link from 'next/link';
import { Bed, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientProps {
    id: string;
    name: string;
    age: number;
    uhid: string;
    bed: string;
    diagnosis: string;
    status: string;
    admitDay: number;
    color: string;
}

export function PatientCard({ patient }: { patient: PatientProps }) {
    return (
        <Link href={`/dashboard/doctor/ipd/${patient.id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer group h-full flex flex-col"
            >
                <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${patient.color}`}>
                        {patient.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Day {patient.admitDay}</span>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{patient.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{patient.age}y / Male • {patient.uhid}</p>
                </div>

                <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                        <Bed size={16} className="text-indigo-500" />
                        {patient.bed}
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Diagnosis</div>
                    <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-relaxed">
                        {patient.diagnosis}
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
    );
}
