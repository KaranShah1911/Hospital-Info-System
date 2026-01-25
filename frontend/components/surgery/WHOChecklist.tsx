"use client";

import { CheckSquare } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

export function WHOChecklist({ surgeryId, onComplete }: { surgeryId: string, onComplete: () => void }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
                <SectionHeader icon={CheckSquare} title="WHO Surgical Safety Checklist" description="Sign In (Before Induction of Anaesthesia)" />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {['Patient Identity Confirmed', 'Site Marking Verified', 'Anaesthesia Safety Check Completed', 'Pulse Oximeter on Patient and Functioning', 'Known Allergies Checked', 'Difficult Airway / Aspiration Risk Assessed', 'Risk of Blood Loss > 500ml Evaluated'].map((item, i) => (
                        <label key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 transition-colors group">
                            <input type="checkbox" className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="font-bold text-slate-700 group-hover:text-indigo-800">{item}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onComplete}
                        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-105"
                    >
                        Confirm & Proceed to Vitals
                    </button>
                </div>
            </div>
        </div>
    );
}
