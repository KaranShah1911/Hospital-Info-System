"use client";

import { Activity, Stethoscope } from 'lucide-react';

export function ClinicalNoteForm({ patientId, visitId }: { patientId?: string, visitId?: string | null }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Vitals Entry Section */}
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold text-xs uppercase tracking-wider">
                    <Activity size={14} /> Record Vitals
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">BP (mmHg)</label>
                        <input type="text" placeholder="120/80" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Pulse (bpm)</label>
                        <input type="number" placeholder="72" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">SpO2 (%)</label>
                        <input type="number" placeholder="98" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Temp (°F)</label>
                        <input type="text" placeholder="98.6" className="w-full px-4 py-2 bg-white rounded-xl border border-indigo-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                </div>
            </div>

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
