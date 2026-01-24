"use client";

import { History, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import Link from 'next/link';

export function VisitHistory({ history }: { history?: any[] }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl h-fit">
                <SectionHeader icon={History} title="Visit History" />

                <div className="mt-6 relative pl-4 border-l-2 border-slate-100 space-y-8">
                    {!history?.length && <div className="text-sm text-slate-400 py-4">No previous visits recorded.</div>}

                    {history?.map((visit, i) => (
                        <div key={i} className="relative group cursor-pointer mb-6">
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white group-hover:bg-indigo-500 transition-colors"></div>
                            <div className="pl-4">
                                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                                    {new Date(visit.date).toLocaleDateString()}
                                </div>
                                <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{visit.diagnosis || 'Diagnosis Pending'}</div>
                                <div className="text-xs font-medium text-slate-500 mt-1">{visit.doctor} • {visit.type || 'OPD'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={AlertTriangle} title="Risk Factors" iconClassName="text-amber-500" />
                <div className="mt-4 flex flex-wrap gap-2">
                    {/* Ideally fetch from backend too, currently mostly AI generated displayed elsewhere or static */}
                    {['Smoker (Occasional)', 'Family History of Diabetes', 'High Stress Job'].map((risk, i) => (
                        <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-100">
                            {risk}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
