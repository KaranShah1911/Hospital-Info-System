"use client";

import { Activity } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function PreOpVitals({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <SectionHeader icon={Activity} title="Pre-Induction Vitals" description="Record baseline vitals before starting the procedure." />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Blood Pressure</label>
                        <input type="text" placeholder="120/80" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-black text-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Pulse Rate</label>
                        <input type="number" placeholder="72" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-black text-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">SpO2 %</label>
                        <input type="number" placeholder="99" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-black text-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Resp. Rate</label>
                        <input type="number" placeholder="18" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-black text-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300" />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onComplete}
                        className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-200 transition-all hover:scale-105"
                    >
                        Sign & Start Surgery
                    </button>
                </div>
            </div>
        </div>
    );
}
