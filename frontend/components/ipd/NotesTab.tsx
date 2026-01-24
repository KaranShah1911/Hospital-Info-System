"use client";

import { FileText } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function NotesTab() {
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
