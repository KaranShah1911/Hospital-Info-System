"use client";

import { Activity } from 'lucide-react';

export function PatientProfileCard({ patient }: { patient?: any }) {
    if (!patient) return <div className="xl:col-span-2 bg-slate-50 p-8 rounded-[2.5rem] animate-pulse">Loading Profile...</div>;

    const vitals = patient.vitals || { bp: 'N/A', pulse: 'N/A', temp: 'N/A' };

    return (
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-slate-800">{patient.firstName} {patient.lastName}</h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">OPD</span>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-6">{patient.age}y / {patient.gender} • {patient.uhid}</p>

                <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-700">
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Allergies</div>
                        <div className="font-bold text-sm">{patient.allergies?.length ? patient.allergies.join(", ") : "None"}</div>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Blood Group</div>
                        <div className="font-bold text-sm">{patient.bloodGroup}</div>
                    </div>
                    <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                        <div className="text-[10px] font-black uppercase tracking-wider opacity-60">Conditions</div>
                        <div className="font-bold text-sm">{patient.conditions?.length ? patient.conditions.join(", ") : "None"}</div>
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
                            <div className="font-bold text-slate-800">{vitals.bp}</div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 font-bold">Recent</div>
                </div>
                <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <Activity size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase text-slate-400">Pulse</div>
                            <div className="font-bold text-slate-800">{vitals.pulse} bpm</div>
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
                            <div className="font-bold text-slate-800">{vitals.temp} F</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
