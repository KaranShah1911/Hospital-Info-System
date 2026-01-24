"use client";

import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Scissors, Clock, Calendar, CheckCircle, AlertOctagon } from 'lucide-react';

export default function DoctorSurgery() {
    return (
        <div className="space-y-8">
            <PageHeader title="Surgery & OT Management" description="Schedule procedures and manage surgical teams." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                        <SectionHeader icon={Scissors} title="Upcoming Surgeries" />

                        <div className="space-y-4">
                            {[1].map(i => (
                                <div key={i} className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>

                                    <div className="flex flex-col items-center justify-center min-w-[100px] p-4 bg-white rounded-2xl shadow-sm">
                                        <span className="text-xs font-black text-slate-400 uppercase">TODAY</span>
                                        <span className="text-2xl font-black text-slate-900">14:00</span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full">Elective</span>
                                            <h3 className="text-lg font-black text-slate-800">Laparoscopic Cholecystectomy</h3>
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 mb-4">
                                            Patient: <span className="font-bold text-slate-900">Suresh Raina (45M)</span> • OT Room 3
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                                Pre-Op Checklist
                                            </button>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                                View Team
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl h-fit">
                    <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="text-slate-400" size={20} /> OT Availability
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(room => (
                            <div key={room} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-700">OT Room {room}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">General Surgery</div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${room === 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {room === 2 ? 'In Use' : 'Available'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
