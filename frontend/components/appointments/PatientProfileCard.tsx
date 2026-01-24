"use client";

import { Activity } from 'lucide-react';

export function PatientProfileCard() {
    return (
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
    );
}
